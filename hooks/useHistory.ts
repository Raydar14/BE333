import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, doc, getDoc, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import type { HabitActivity } from './useHabitStack';

/**
 * useHistory / useHistoryItem — read-side hooks for the /history feed and
 * per-session detail page. Every write goes through app/index.tsx (BE Pause
 * sessions) or useHabitStack.logHabitSession (habit-stack sessions);
 * these hooks just tail the two collections and merge them into one
 * reverse-chronological feed.
 */

export type HistoryKind = 'be-pause' | 'habit-stack';

export interface BioSummary {
    startHR: number;
    endHR: number;
    startHRV: number | null;
    endHRV: number | null;
    avgHR: number;
    avgHRV: number;
    hrChange: number;
    hrvChange: number;
    hrSamples?: number[];
    hrvSamples?: number[];
}

export interface HistoryItem {
    id: string;
    kind: HistoryKind;
    completedAt: Date;
    durationSeconds: number;
    // BE Pause fields
    practiceStage?: string;
    biofeedback?: BioSummary;
    // Habit-stack fields
    activity?: HabitActivity;
}

// Combined chronological feed for the /history screen.
export function useHistory(maxItems = 200) {
    const { user } = useAuth();
    const [pauses, setPauses] = useState<HistoryItem[]>([]);
    const [habits, setHabits] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Tail BE Pause sessions (users/{uid}/sessions/*).
    useEffect(() => {
        if (!user) {
            setPauses([]);
            return;
        }
        const q = query(
            collection(db, 'users', user.uid, 'sessions'),
            orderBy('completed_at', 'desc'),
            limit(maxItems)
        );
        const unsub = onSnapshot(q, (snap) => {
            const list: HistoryItem[] = [];
            snap.forEach((d) => {
                const data = d.data();
                const bio = data.biofeedback;
                list.push({
                    id: d.id,
                    kind: 'be-pause',
                    completedAt: parseFirestoreDate(data.completed_at) ?? new Date(),
                    durationSeconds: data.duration_seconds ?? 0,
                    practiceStage: data.practice_stage,
                    biofeedback: bio ? {
                        startHR: bio.startHR ?? 0,
                        endHR: bio.endHR ?? 0,
                        startHRV: bio.startHRV ?? null,
                        endHRV: bio.endHRV ?? null,
                        avgHR: bio.avgHR ?? 0,
                        avgHRV: bio.avgHRV ?? 0,
                        hrChange: bio.hrChange ?? 0,
                        hrvChange: bio.hrvChange ?? 0,
                        hrSamples: Array.isArray(bio.hrSamples) ? bio.hrSamples : undefined,
                        hrvSamples: Array.isArray(bio.hrvSamples) ? bio.hrvSamples : undefined,
                    } : undefined,
                });
            });
            setPauses(list);
        }, (err) => { console.warn('useHistory (pauses) error:', err); });
        return () => unsub();
    }, [user, maxItems]);

    // Tail habit-stack sessions (users/{uid}/habit_sessions/*).
    useEffect(() => {
        if (!user) {
            setHabits([]);
            return;
        }
        const q = query(
            collection(db, 'users', user.uid, 'habit_sessions'),
            orderBy('completedAt', 'desc'),
            limit(maxItems)
        );
        const unsub = onSnapshot(q, (snap) => {
            const list: HistoryItem[] = [];
            snap.forEach((d) => {
                const data = d.data();
                list.push({
                    id: d.id,
                    kind: 'habit-stack',
                    completedAt: parseFirestoreDate(data.completedAt) ?? new Date(),
                    durationSeconds: data.durationSeconds ?? 0,
                    activity: data.activity as HabitActivity,
                });
            });
            setHabits(list);
            setLoading(false);
        }, (err) => { console.warn('useHistory (habits) error:', err); setLoading(false); });
        return () => unsub();
    }, [user, maxItems]);

    // Merge + sort newest first.
    const merged = [...pauses, ...habits].sort(
        (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
    );

    return { items: merged, loading };
}

// One-shot fetch for the detail page.
export function useHistoryItem(sessionId: string | undefined) {
    const { user } = useAuth();
    const [item, setItem] = useState<HistoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!user || !sessionId) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const snap = await getDoc(doc(db, 'users', user.uid, 'sessions', sessionId));
                if (cancelled) return;
                if (!snap.exists()) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                const data = snap.data();
                const bio = data.biofeedback;
                setItem({
                    id: snap.id,
                    kind: 'be-pause',
                    completedAt: parseFirestoreDate(data.completed_at) ?? new Date(),
                    durationSeconds: data.duration_seconds ?? 0,
                    practiceStage: data.practice_stage,
                    biofeedback: bio ? {
                        startHR: bio.startHR ?? 0,
                        endHR: bio.endHR ?? 0,
                        startHRV: bio.startHRV ?? null,
                        endHRV: bio.endHRV ?? null,
                        avgHR: bio.avgHR ?? 0,
                        avgHRV: bio.avgHRV ?? 0,
                        hrChange: bio.hrChange ?? 0,
                        hrvChange: bio.hrvChange ?? 0,
                        hrSamples: Array.isArray(bio.hrSamples) ? bio.hrSamples : undefined,
                        hrvSamples: Array.isArray(bio.hrvSamples) ? bio.hrvSamples : undefined,
                    } : undefined,
                });
                setLoading(false);
            } catch (e) {
                console.warn('useHistoryItem error:', e);
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [user, sessionId]);

    return { item, loading, notFound };
}

// EMA entries for the mood trend card.
export interface EmaEntry {
    id: string;
    stress: 'lower' | 'same' | 'higher';
    mood: 'better' | 'same' | 'worse';
    focus: 'clearer' | 'same' | 'foggier';
    oneWord: string | null;
    createdAt: Date;
}
export function useRecentEma(maxItems = 30) {
    const { user } = useAuth();
    const [entries, setEntries] = useState<EmaEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setEntries([]); setLoading(false); return; }
        const q = query(
            collection(db, 'users', user.uid, 'emaEntries'),
            orderBy('createdAt', 'desc'),
            limit(maxItems)
        );
        const unsub = onSnapshot(q, (snap) => {
            const list: EmaEntry[] = [];
            snap.forEach((d) => {
                const data = d.data();
                list.push({
                    id: d.id,
                    stress: data.stress,
                    mood: data.mood,
                    focus: data.focus,
                    oneWord: data.oneWord || null,
                    createdAt: parseFirestoreDate(data.createdAt) ?? new Date(),
                });
            });
            setEntries(list);
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, [user, maxItems]);

    return { entries, loading };
}

// Firestore Timestamps come back with .toDate(). Plain JS Dates work as-is.
// Some early docs used ISO strings, which parse cleanly with new Date().
function parseFirestoreDate(v: unknown): Date | null {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v === 'string') {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
    }
    if (typeof v === 'object' && v !== null && 'toDate' in v) {
        try {
            const d = (v as { toDate: () => Date }).toDate();
            return d instanceof Date ? d : null;
        } catch { return null; }
    }
    return null;
}
