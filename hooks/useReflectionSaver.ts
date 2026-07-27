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
    const photoUrlRef = useRef<string | null>(null);

    // Reset the start marker and default category each time the activity changes.
    useEffect(() => {
        startedAtRef.current = Date.now();
        latestTextRef.current = '';
        savedTextRef.current = '';
        photoUrlRef.current = null;
        categoryRef.current = defaultCategoryFor(activity);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [activity]);

    const flush = useCallback(async () => {
        if (!user) return;
        const text = latestTextRef.current.trim();
        const photoUrl = photoUrlRef.current;
        // Save if there's either text OR a photo (photo-only entries are fine).
        if (!text && !photoUrl) return;
        if (text === savedTextRef.current && !photoUrl) return;
        savedTextRef.current = text;
        try {
            const payload: Record<string, unknown> = {
                activity,
                text,
                category: categoryRef.current,
                createdAt: serverTimestamp(),
                startedAt: startedAtRef.current,
            };
            if (photoUrl) payload.photoUrl = photoUrl;
            await addDoc(collection(db, 'users', user.uid, 'reflections'), payload);
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

    // Attach a photo URL to the current entry (Gratitude, primarily).
    // Force-flushes so the photo doesn't wait 1.5s to persist.
    const setPhotoUrl = useCallback((url: string | null) => {
        photoUrlRef.current = url;
        flush();
    }, [flush]);

    return {
        onEntryChange,
        flushNow: flush,
        setCategory,
        setPhotoUrl,
        defaultCategory: defaultCategoryFor(activity),
    };
}
