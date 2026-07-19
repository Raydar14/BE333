import { useEffect, useState, useCallback } from 'react';
import {
    collection, query, where, getDocs, limit, updateDoc, doc, onSnapshot, getDoc,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import type { BePracticeStats } from './useBePractice';

/**
 * useBeGuide — the therapist-facing "BE Guide View" (Master Manual Part 3).
 *
 * Data model (MVP):
 *  - Client-side (client sets these on their own user doc):
 *      linkedGuideEmail: string
 *      linkedGuideUid:   string | null
 *      shareWithGuide:   boolean (defaults true)
 *  - Guide-side (queries users where linkedGuideUid == guide.uid).
 *
 * Follow-up in TODO: on-demand Sneak Peek Report request/approve flow.
 */

export interface LinkedClientSummary {
    uid: string;
    displayName: string;
    email: string | null;
    photoURL: string | null;
    shareWithGuide: boolean;
    bePractice?: BePracticeStats;
}

// Guide-side: subscribe to linked clients live.
export function useLinkedClients(enabled: boolean) {
    const { user } = useAuth();
    const [clients, setClients] = useState<LinkedClientSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!enabled || !user) {
            setClients([]);
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'users'), where('linkedGuideUid', '==', user.uid));
        const unsub = onSnapshot(q, (snap) => {
            const next: LinkedClientSummary[] = [];
            snap.forEach((d) => {
                const data = d.data();
                next.push({
                    uid: d.id,
                    displayName: data.displayName || 'Client',
                    email: data.email || null,
                    photoURL: data.photoURL || null,
                    shareWithGuide: data.shareWithGuide !== false, // default true
                    bePractice: data.bePractice as BePracticeStats | undefined,
                });
            });
            setClients(next);
            setLoading(false);
        }, (e) => {
            console.warn('useLinkedClients snapshot error:', e);
            setLoading(false);
        });
        return () => unsub();
    }, [enabled, user]);

    return { clients, loading };
}

// Guide-side: fetch a single client's up-to-date state on demand.
export function useLinkedClient(clientUid: string | undefined) {
    const [client, setClient] = useState<LinkedClientSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!clientUid) {
            setClient(null);
            setLoading(false);
            return;
        }
        const unsub = onSnapshot(doc(db, 'users', clientUid), (snap) => {
            if (!snap.exists()) {
                setClient(null);
                setLoading(false);
                return;
            }
            const data = snap.data();
            setClient({
                uid: snap.id,
                displayName: data.displayName || 'Client',
                email: data.email || null,
                photoURL: data.photoURL || null,
                shareWithGuide: data.shareWithGuide !== false,
                bePractice: data.bePractice as BePracticeStats | undefined,
            });
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, [clientUid]);

    return { client, loading };
}

// Client-side: link/unlink a guide by email, and toggle shareWithGuide.
export function useGuideLink() {
    const { user } = useAuth();
    const [linkedGuideEmail, setLinkedGuideEmail] = useState<string>('');
    const [shareWithGuide, setShareWithGuideState] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) {
                const d = snap.data();
                setLinkedGuideEmail(d.linkedGuideEmail || '');
                setShareWithGuideState(d.shareWithGuide !== false);
            }
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const linkGuide = useCallback(async (email: string): Promise<{ ok: boolean; message: string }> => {
        if (!user) return { ok: false, message: 'Sign in first.' };
        const clean = email.trim().toLowerCase();
        if (!clean) return { ok: false, message: 'Enter a valid email.' };

        try {
            const q = query(
                collection(db, 'users'),
                where('email', '==', clean),
                limit(1)
            );
            const snap = await getDocs(q);
            if (snap.empty) {
                return { ok: false, message: 'No BE Guide found with that email.' };
            }
            const guideDoc = snap.docs[0];
            const guideData = guideDoc.data();
            if (guideData.role !== 'therapist') {
                return { ok: false, message: 'That user is not a BE Guide.' };
            }
            if (guideDoc.id === user.uid) {
                return { ok: false, message: 'You cannot link yourself.' };
            }
            await updateDoc(doc(db, 'users', user.uid), {
                linkedGuideEmail: clean,
                linkedGuideUid: guideDoc.id,
                shareWithGuide: true,
            });
            return { ok: true, message: `Linked with ${guideData.displayName || clean}.` };
        } catch (e) {
            console.warn('linkGuide error:', e);
            return { ok: false, message: 'Something went wrong. Try again.' };
        }
    }, [user]);

    const unlinkGuide = useCallback(async () => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                linkedGuideEmail: null,
                linkedGuideUid: null,
            });
        } catch (e) {
            console.warn('unlinkGuide error:', e);
        }
    }, [user]);

    const setShareWithGuide = useCallback(async (share: boolean) => {
        if (!user) return;
        setShareWithGuideState(share); // Optimistic
        try {
            await updateDoc(doc(db, 'users', user.uid), { shareWithGuide: share });
        } catch (e) {
            console.warn('setShareWithGuide error:', e);
        }
    }, [user]);

    return {
        linkedGuideEmail,
        shareWithGuide,
        loading,
        linkGuide,
        unlinkGuide,
        setShareWithGuide,
    };
}

// Read the current user's role from their doc so we can decide whether to
// route them into the Guide View section.
export function useUserRole(): 'user' | 'therapist' | 'loading' {
    const { user } = useAuth();
    const [role, setRole] = useState<'user' | 'therapist' | 'loading'>('loading');

    useEffect(() => {
        if (!user) {
            setRole('user');
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (cancelled) return;
                const data = snap.data();
                setRole(data?.role === 'therapist' ? 'therapist' : 'user');
            } catch {
                if (!cancelled) setRole('user');
            }
        })();
        return () => { cancelled = true; };
    }, [user]);

    return role;
}
