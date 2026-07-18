import { useEffect, useRef, useCallback } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { HabitStackActivity } from '../content/habitStack';

// Autosaves text entries from a habit-stack activity to
// users/{uid}/reflections. Debounced so we don't fire per-keystroke.
//
// TODO (Wave 3): Build the "My Reflections" viewer to browse and export.
export function useReflectionSaver(activity: HabitStackActivity) {
    const { user } = useAuth();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const latestTextRef = useRef<string>('');
    const savedTextRef = useRef<string>('');
    const startedAtRef = useRef<number>(Date.now());

    // Reset the start marker each time the activity changes.
    useEffect(() => {
        startedAtRef.current = Date.now();
        latestTextRef.current = '';
        savedTextRef.current = '';
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [activity]);

    const flush = useCallback(async () => {
        if (!user) return;
        const text = latestTextRef.current.trim();
        if (!text) return;
        if (text === savedTextRef.current) return;
        savedTextRef.current = text;
        try {
            await addDoc(collection(db, 'users', user.uid, 'reflections'), {
                activity,
                text,
                createdAt: serverTimestamp(),
                startedAt: startedAtRef.current,
            });
        } catch (e) {
            console.warn('Failed to save reflection:', e);
        }
    }, [activity, user]);

    // Called on every keystroke; debounced by 1.5s of inactivity.
    const onEntryChange = useCallback((text: string) => {
        latestTextRef.current = text;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            flush();
        }, 1500);
    }, [flush]);

    return { onEntryChange, flushNow: flush };
}
