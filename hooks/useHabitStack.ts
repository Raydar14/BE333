import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export type HabitActivity =
    | 'Yoga'
    | 'Chanting'
    | 'Singing'
    | 'Journaling'
    | 'Stretching'
    | 'Gratitude'
    | 'Poetry'
    | 'Day Planning'
    | 'Prayer'
    | 'Mantra';

export interface HabitStackTemplate {
    id?: string;
    name: string; // e.g. "Morning Yoga Flow"
    activity: HabitActivity;
    mode: 'timer' | 'count_up';
    durationSeconds: number; // Ignored if count_up
    createdAt?: any;
}

export interface HabitSessionLog {
    id?: string;
    userId: string;
    activity: HabitActivity;
    durationSeconds: number;
    completedAt: string; // ISO String
    stackTemplateId?: string; // Optional linkage
}

export function useHabitStack() {
    const { user } = useAuth();
    const [savedStacks, setSavedStacks] = useState<HabitStackTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Saved Stacks (Pro Users)
    useEffect(() => {
        if (!user) {
            setSavedStacks([]);
            setLoading(false);
            return;
        }

        const stacksRef = collection(db, 'users', user.uid, 'saved_stacks');
        const q = query(stacksRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const stacks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as HabitStackTemplate[];
            setSavedStacks(stacks);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching stacks:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Save a new Template (Pro)
    const saveStackTemplate = async (template: Omit<HabitStackTemplate, 'id' | 'createdAt'>) => {
        if (!user) return;
        try {
            const stacksRef = collection(db, 'users', user.uid, 'saved_stacks');
            await addDoc(stacksRef, {
                ...template,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error saving stack:", error);
            throw error;
        }
    };

    // Delete a Template
    const deleteStackTemplate = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'saved_stacks', id));
        } catch (error) {
            console.error("Error deleting stack:", error);
            throw error;
        }
    };

    // Log a completed session (History)
    const logHabitSession = async (activity: HabitActivity, durationSeconds: number, templateId?: string) => {
        if (!user) return;
        try {
            // 1. Log to 'habit_sessions' subcollection for granular history
            const sessionsRef = collection(db, 'users', user.uid, 'habit_sessions');
            await addDoc(sessionsRef, {
                activity,
                durationSeconds,
                completedAt: new Date().toISOString(),
                stackTemplateId: templateId || null,
            });

            // 2. Optionally we could update aggregate stats here, but we'll stick to raw logs for MVP
        } catch (error) {
            console.error("Error logging session:", error);
            throw error; // UI should handle error
        }
    };

    return {
        savedStacks,
        loading,
        saveStackTemplate,
        deleteStackTemplate,
        logHabitSession
    };
}
