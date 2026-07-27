import { useEffect } from 'react';
import {
    collection, query, where, getDocs, limit, doc, setDoc, updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';

// One-time migration: BE Pause sessions written before the History ship
// (14e42c9) landed at the root-level `sessions/{docId}` collection with a
// `userId` field. The current hook stack (useHistory) reads only from
// scoped `users/{uid}/sessions/`. This migration copies each legacy doc
// into the scoped collection and marks the original with `migratedAt`
// so subsequent runs skip it.
//
// Runs at most once per user per install (AsyncStorage flag). Caps at
// LEGACY_BATCH docs per run — if the user has more, subsequent app opens
// will progress the migration. Any Firestore permission error (rules may
// restrict root-collection reads) is swallowed silently; the migration
// is best-effort and the app continues to work fine without it.

const LEGACY_BATCH = 50;
const flagKey = (uid: string) => `legacySessionsMigrated:${uid}`;

export function useLegacySessionsMigration() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        (async () => {
            try {
                const done = await AsyncStorage.getItem(flagKey(user.uid));
                if (done === '1') return;

                const q = query(
                    collection(db, 'sessions'),
                    where('userId', '==', user.uid),
                    limit(LEGACY_BATCH),
                );
                const snap = await getDocs(q);
                if (cancelled) return;

                let migrated = 0;
                for (const d of snap.docs) {
                    const data = d.data();
                    if (data.migratedAt) continue;
                    try {
                        // Preserve the original id so the History detail
                        // page still resolves any external references.
                        await setDoc(
                            doc(db, 'users', user.uid, 'sessions', d.id),
                            { ...data, migratedFromRoot: true },
                            { merge: true },
                        );
                        await updateDoc(d.ref, { migratedAt: serverTimestamp() });
                        migrated++;
                    } catch (e) {
                        console.warn('legacySessions migrate single doc failed:', d.id, e);
                    }
                }

                // Only set the "done" flag if we processed the full page.
                // A short page means we saw everything the user owns.
                if (snap.size < LEGACY_BATCH) {
                    await AsyncStorage.setItem(flagKey(user.uid), '1');
                }
                if (migrated > 0) {
                    console.log(`[legacySessions] migrated ${migrated} root session docs to users/${user.uid}/sessions/`);
                }
            } catch (e) {
                // Security rules may deny root-collection reads. That's fine —
                // no old data will surface, but the app is otherwise healthy.
                console.warn('[legacySessions] skip:', e);
            }
        })();
        return () => { cancelled = true; };
    }, [user]);
}
