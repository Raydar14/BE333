import { useEffect, useState, useCallback } from 'react';
import {
    collection, query, where, getDocs, limit, updateDoc, doc, onSnapshot, getDoc,
    setDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import type { BePracticeStats } from './useBePractice';

/**
 * useBeGuide — the therapist-facing "BE Guide View" (Master Manual Part 3).
 *
 * Data model:
 *  Client user doc (users/{clientUid}):
 *      linkedGuideEmail: string
 *      linkedGuideUid:   string | null
 *      shareWithGuide:   boolean (defaults true)
 *
 *  Guide user doc (users/{guideUid}):
 *      role: 'therapist'
 *      licenseInfo?: string     (self-attested)
 *      specialty?: string       (optional)
 *      hipaaAgreedAt?: string   (ISO date of acknowledgment)
 *
 *  Client notes (users/{guideUid}/clientNotes/{clientUid}):
 *      text: string
 *      updatedAt: serverTimestamp
 *      clientDisplayName: string  (denormalized for the notes list)
 *
 *  Invite codes (guideInvites/{code}):
 *      guideUid: string
 *      createdAt: serverTimestamp
 *      redeemedByUid?: string
 *      redeemedAt?: serverTimestamp
 */

// Capacity per subscription tier. Free therapists can browse but not link.
export const GUIDE_CAPACITY: Record<'free' | 'pro' | 'lifetime', number> = {
    free: 0,
    pro: 25,
    lifetime: 100,
};

export function capacityForTier(tier: 'free' | 'pro' | 'lifetime'): number {
    return GUIDE_CAPACITY[tier] ?? 0;
}

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
                    shareWithGuide: data.shareWithGuide !== false,
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
    const [linkedGuideUid, setLinkedGuideUid] = useState<string | null>(null);
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
                setLinkedGuideUid(d.linkedGuideUid || null);
                setShareWithGuideState(d.shareWithGuide !== false);
            }
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    // Shared helper: link the client to a guide by their user doc, checking capacity.
    const linkToGuideDoc = useCallback(async (
        guideUid: string,
        guideEmail: string,
        guideDisplayName?: string,
    ): Promise<{ ok: boolean; message: string }> => {
        if (!user) return { ok: false, message: 'Sign in first.' };
        if (guideUid === user.uid) return { ok: false, message: 'You cannot link yourself.' };

        // Enforce guide client capacity.
        try {
            const roster = await getDocs(
                query(collection(db, 'users'), where('linkedGuideUid', '==', guideUid))
            );
            // TODO: once RevenueCat tier is mirrored to Firestore, read purchaseTier
            // from the guide's user doc and use capacityForTier(tier). For now,
            // missing tier -> 'pro' so live guides aren't blocked from accepting
            // clients while the sync is being wired.
            const guideSnap = await getDoc(doc(db, 'users', guideUid));
            const tier = (guideSnap.data()?.purchaseTier as 'free' | 'pro' | 'lifetime') || 'pro';
            const cap = capacityForTier(tier);
            const currentClients = roster.size;
            const alreadyLinkedToThisGuide = roster.docs.some((d) => d.id === user.uid);
            if (!alreadyLinkedToThisGuide && currentClients >= cap) {
                if (cap === 0) {
                    return { ok: false, message: 'This BE Guide is on the free tier and cannot accept clients yet. Ask them to upgrade to Therapist Pro.' };
                }
                return { ok: false, message: 'This BE Guide has reached their client capacity.' };
            }

            await updateDoc(doc(db, 'users', user.uid), {
                linkedGuideEmail: guideEmail,
                linkedGuideUid: guideUid,
                shareWithGuide: true,
            });
            return { ok: true, message: `Linked with ${guideDisplayName || guideEmail}.` };
        } catch (e) {
            console.warn('linkToGuideDoc error:', e);
            return { ok: false, message: 'Something went wrong. Try again.' };
        }
    }, [user]);

    // Link by email lookup.
    const linkGuide = useCallback(async (email: string): Promise<{ ok: boolean; message: string }> => {
        if (!user) return { ok: false, message: 'Sign in first.' };
        const clean = email.trim().toLowerCase();
        if (!clean) return { ok: false, message: 'Enter a valid email.' };
        try {
            const snap = await getDocs(
                query(collection(db, 'users'), where('email', '==', clean), limit(1))
            );
            if (snap.empty) return { ok: false, message: 'No BE Guide found with that email.' };
            const guideDoc = snap.docs[0];
            const guideData = guideDoc.data();
            if (guideData.role !== 'therapist') {
                return { ok: false, message: 'That user is not a BE Guide.' };
            }
            return linkToGuideDoc(guideDoc.id, clean, guideData.displayName);
        } catch (e) {
            console.warn('linkGuide error:', e);
            return { ok: false, message: 'Something went wrong. Try again.' };
        }
    }, [user, linkToGuideDoc]);

    // Link by invite code.
    const linkGuideByCode = useCallback(async (rawCode: string): Promise<{ ok: boolean; message: string }> => {
        if (!user) return { ok: false, message: 'Sign in first.' };
        const code = rawCode.trim().toUpperCase();
        if (!code) return { ok: false, message: 'Enter an invite code.' };
        try {
            const inviteSnap = await getDoc(doc(db, 'guideInvites', code));
            if (!inviteSnap.exists()) return { ok: false, message: 'Invite code not found.' };
            const invite = inviteSnap.data();
            const guideUid = invite.guideUid as string;
            const guideSnap = await getDoc(doc(db, 'users', guideUid));
            if (!guideSnap.exists()) return { ok: false, message: 'That BE Guide account no longer exists.' };
            const guideData = guideSnap.data();
            if (guideData.role !== 'therapist') return { ok: false, message: 'That code does not belong to a BE Guide.' };
            const result = await linkToGuideDoc(guideUid, guideData.email || '', guideData.displayName);
            if (result.ok) {
                await updateDoc(doc(db, 'guideInvites', code), {
                    redeemedByUid: user.uid,
                    redeemedAt: serverTimestamp(),
                });
            }
            return result;
        } catch (e) {
            console.warn('linkGuideByCode error:', e);
            return { ok: false, message: 'Something went wrong. Try again.' };
        }
    }, [user, linkToGuideDoc]);

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
        setShareWithGuideState(share);
        try {
            await updateDoc(doc(db, 'users', user.uid), { shareWithGuide: share });
        } catch (e) {
            console.warn('setShareWithGuide error:', e);
        }
    }, [user]);

    return {
        linkedGuideEmail,
        linkedGuideUid,
        shareWithGuide,
        loading,
        linkGuide,
        linkGuideByCode,
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

// Guide-side: read/write a private note pinned to a client.
export function useClientNotes(clientUid: string | undefined) {
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [savedAt, setSavedAt] = useState<Date | null>(null);

    useEffect(() => {
        if (!user || !clientUid) {
            setLoading(false);
            return;
        }
        const ref = doc(db, 'users', user.uid, 'clientNotes', clientUid);
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const d = snap.data();
                setText(d.text || '');
                if (d.updatedAt && typeof d.updatedAt.toDate === 'function') {
                    setSavedAt(d.updatedAt.toDate());
                }
            } else {
                setText('');
                setSavedAt(null);
            }
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, [user, clientUid]);

    const save = useCallback(async (nextText: string, clientDisplayName?: string) => {
        if (!user || !clientUid) return;
        try {
            await setDoc(doc(db, 'users', user.uid, 'clientNotes', clientUid), {
                text: nextText,
                updatedAt: serverTimestamp(),
                clientDisplayName: clientDisplayName || null,
            }, { merge: true });
        } catch (e) {
            console.warn('client notes save error:', e);
        }
    }, [user, clientUid]);

    return { text, loading, savedAt, save };
}

// Guide-side: subscribe to every client note this guide has written, most
// recent first. Powers the /guide/notes list view — one screen to scan
// what was said about whom across the whole roster.
export interface ClientNoteSummary {
    clientUid: string;
    clientDisplayName: string;
    text: string;
    updatedAt: Date | null;
}
export function useAllClientNotes(enabled: boolean) {
    const { user } = useAuth();
    const [notes, setNotes] = useState<ClientNoteSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!enabled || !user) {
            setNotes([]);
            setLoading(false);
            return;
        }
        const col = collection(db, 'users', user.uid, 'clientNotes');
        const unsub = onSnapshot(col, (snap) => {
            const list: ClientNoteSummary[] = [];
            snap.forEach((d) => {
                const data = d.data();
                if (!data.text || !String(data.text).trim()) return;
                const updated = data.updatedAt && typeof data.updatedAt.toDate === 'function'
                    ? data.updatedAt.toDate() as Date
                    : null;
                list.push({
                    clientUid: d.id,
                    clientDisplayName: data.clientDisplayName || 'Client',
                    text: data.text,
                    updatedAt: updated,
                });
            });
            list.sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
            setNotes(list);
            setLoading(false);
        }, (e) => {
            console.warn('useAllClientNotes snapshot error:', e);
            setLoading(false);
        });
        return () => unsub();
    }, [enabled, user]);

    return { notes, loading };
}

// Guide-side: manage a persistent invite code (one active code at a time).
export function useGuideInviteCode() {
    const { user } = useAuth();
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Cache which code belongs to this guide on their own doc for quick display.
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) setCode(snap.data().activeInviteCode || null);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const generate = useCallback(async () => {
        if (!user) return null;
        setGenerating(true);
        try {
            const newCode = randomCode(8);
            await setDoc(doc(db, 'guideInvites', newCode), {
                guideUid: user.uid,
                createdAt: serverTimestamp(),
            });
            await updateDoc(doc(db, 'users', user.uid), { activeInviteCode: newCode });
            return newCode;
        } catch (e) {
            console.warn('generateInvite error:', e);
            return null;
        } finally {
            setGenerating(false);
        }
    }, [user]);

    const revoke = useCallback(async () => {
        if (!user || !code) return;
        try {
            await deleteDoc(doc(db, 'guideInvites', code));
            await updateDoc(doc(db, 'users', user.uid), { activeInviteCode: null });
        } catch (e) {
            console.warn('revokeInvite error:', e);
        }
    }, [user, code]);

    return { code, loading, generating, generate, revoke };
}

// Uppercase alphanumeric (no ambiguous 0/O/1/I).
function randomCode(len: number): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < len; i++) {
        out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return out;
}
