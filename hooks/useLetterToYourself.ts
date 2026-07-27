import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import type { BePracticeStats } from './useBePractice';

// Manual Part 5 · Letter to Yourself.
// Written once during onboarding (or edited later). Surfaced at the top of
// the first BE Pause after a Missed Day. If the user skipped writing one,
// the DEFAULT_LETTER below plays that role in the same voice.
//
// Stored as a single field on the user doc rather than a versioned list —
// the intent is one canonical letter the user can revise as their voice
// changes over time, not a diary of drafts.

export const DEFAULT_LETTER =
    "Welcome back. A missed day isn't a broken practice — it's the practice, meeting you where you are. Petals stay. The breath is right here. Three minutes, and you're back.";

export const ONBOARDING_PROMPT =
    "Write a kind letter to your future self for the day you miss a Pause. What would you want to hear on that day? Two or three sentences is plenty.";

export function useLetterToYourself(): {
    letter: string;
    hasLetter: boolean;
    loading: boolean;
    save: (text: string) => Promise<void>;
    clear: () => Promise<void>;
} {
    const { user } = useAuth();
    const [letter, setLetter] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLetter(''); setLoading(false); return; }
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            const data = snap.data();
            setLetter((data?.letterToSelf as string) || '');
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, [user]);

    const save = useCallback(async (text: string) => {
        if (!user) return;
        const trimmed = text.trim();
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                letterToSelf: trimmed,
                letterToSelfUpdatedAt: serverTimestamp(),
            });
        } catch (e) {
            console.warn('useLetterToYourself.save error:', e);
        }
    }, [user]);

    const clear = useCallback(async () => save(''), [save]);

    return {
        letter,
        hasLetter: !!letter.trim(),
        loading,
        save,
        clear,
    };
}

// Manual: "the first BE Pause after a Missed Day."
// True when the user hasn't completed a pause today AND at least one of the
// most recent days recorded has fewer than 3 pauses (i.e., they're returning
// from a shortfall). currentPauses > 0 hides the letter for the rest of the day.
export function justReturnedFromMissedDay(stats?: BePracticeStats | null): boolean {
    if (!stats) return false;
    if ((stats.currentPauses ?? 0) > 0) return false;
    const history = stats.recentHistory || [];
    if (history.length === 0) return false;
    return history.some((h) => (h.pauses ?? 0) < 3);
}
