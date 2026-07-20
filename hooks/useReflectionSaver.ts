import { useEffect, useRef, useCallback } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { HabitStackActivity } from '../content/habitStack';
import { WorkCategory, defaultCategoryFor } from '../content/myWork';

// Autosaves entries from a writing habit-stack activity to
// users/{uid}/reflections. Debounced by 1.5s of typing inactivity.
// Each entry carries a category so the "My Work" viewer can filter.
export function useReflectionSaver(activity: HabitStackActivity) {
    const { user } = useAuth();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const latestTextRef = useRef<string>('');
    const savedTextRef = useRef<string>('');
    const categoryRef = useRef<WorkCategory>(defaultCategoryFor(activity));
    const startedAtRef = useRef<number>(Date.now());

    // Reset the start marker and default category each time the activity changes.
    useEffect(() => {
        startedAtRef.current = Date.now();
        latestTextRef.current = '';
        savedTextRef.current = '';
        categoryRef.current = defaultCategoryFor(activity);
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
                category: categoryRef.current,
                createdAt: serverTimestamp(),
                startedAt: startedAtRef.current,
            });
        } catch (e) {
            console.warn('Failed to save reflection:', e);
        }
    }, [activity, user]);

    const onEntryChange = useCallback((text: string) => {
        latestTextRef.current = text;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            flush();
        }, 1500);
    }, [flush]);

    // Called by the category picker in the writing UI. Doesn't force a flush;
    // the next debounced save (or manual flush) will pick up the new category.
    const setCategory = useCallback((cat: WorkCategory) => {
        categoryRef.current = cat;
    }, []);

    return {
        onEntryChange,
        flushNow: flush,
        setCategory,
        defaultCategory: defaultCategoryFor(activity),
    };
}
