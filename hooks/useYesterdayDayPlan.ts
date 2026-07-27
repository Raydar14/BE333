import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';

// The most recent Day Planning entry from before today, if any.
// Returns the joined text (as saved by useReflectionSaver) plus a parsed
// map of Label → value so the Day Planning renderer can prefill matching
// fields when the user taps "Carry forward".
export interface YesterdayDayPlan {
    text: string;
    date: Date;
    fields: Record<string, string>;
}

export function useYesterdayDayPlan(): {
    plan: YesterdayDayPlan | null;
    loading: boolean;
} {
    const { user } = useAuth();
    const [plan, setPlan] = useState<YesterdayDayPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setPlan(null); setLoading(false); return; }
        let cancelled = false;
        (async () => {
            try {
                // Grab the last few Day Planning entries and pick the most
                // recent one whose createdAt is strictly before today.
                const q = query(
                    collection(db, 'users', user.uid, 'reflections'),
                    where('activity', '==', 'Day Planning'),
                    orderBy('createdAt', 'desc'),
                    limit(10),
                );
                const snap = await getDocs(q);
                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);

                let pick: { text: string; date: Date } | null = null;
                for (const d of snap.docs) {
                    const data = d.data();
                    const created = data.createdAt?.toDate?.() as Date | undefined;
                    if (!created || !data.text) continue;
                    if (created.getTime() < startOfToday.getTime()) {
                        pick = { text: data.text as string, date: created };
                        break;
                    }
                }

                if (cancelled) return;
                if (!pick) { setPlan(null); setLoading(false); return; }

                setPlan({
                    text: pick.text,
                    date: pick.date,
                    fields: parseFields(pick.text),
                });
                setLoading(false);
            } catch (e) {
                console.warn('useYesterdayDayPlan error:', e);
                if (!cancelled) { setPlan(null); setLoading(false); }
            }
        })();
        return () => { cancelled = true; };
    }, [user]);

    return { plan, loading };
}

// Reverse of the saver's format: "${label}: ${value}" per line.
// Preserves the order of labels for display; ignores blank values.
function parseFields(text: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const raw of text.split('\n')) {
        const line = raw.trim();
        if (!line) continue;
        const colonIdx = line.indexOf(':');
        if (colonIdx < 0) continue;
        const label = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        if (label && value) out[label] = value;
    }
    return out;
}
