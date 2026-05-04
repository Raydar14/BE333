import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BePracticeStats {
    practiceState: 'active' | 'resting_ritual' | 'completed';
    startDate: string;
    dayOfPractice: number;
    bloomDays: number;
    currentPauses: number;
    streakBreaksUsed: number;
    recentHistory: { date: string; pauses: number }[];
    lastActiveDate: string;
    resetRitualStartDate?: string | null;
}

function getTodayStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const DEFAULT_STATS: BePracticeStats = {
    practiceState: 'active',
    startDate: new Date().toISOString(),
    dayOfPractice: 1,
    bloomDays: 0,
    currentPauses: 0,
    streakBreaksUsed: 0,
    recentHistory: [],
    lastActiveDate: getTodayStr(),
    resetRitualStartDate: null,
};

export function useBePractice() {
    const { user } = useAuth();
    const { isPro } = usePurchase();
    const [stats, setStats] = useState<BePracticeStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setStats(null);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists() && docSnap.data().bePractice) {
                const data = docSnap.data().bePractice as BePracticeStats;
                await checkDailyLogic(data, user.uid, isPro);
            } else {
                const initialStats = {
                    ...DEFAULT_STATS,
                    startDate: new Date().toISOString(),
                    lastActiveDate: getTodayStr(),
                };
                try {
                    await setDoc(userRef, { bePractice: initialStats }, { merge: true });
                } catch (e) {
                    console.error('Failed to initialize bePractice stats:', e);
                }
                setStats(initialStats);
                setLoading(false);
            }
        }, (error) => {
            console.error('Error in useBePractice snapshot:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, isPro]);

    const checkDailyLogic = async (currentStats: BePracticeStats, uid: string, userIsPro: boolean) => {
        const today = getTodayStr();
        const lastActive = currentStats.lastActiveDate;

        if (today === lastActive) {
            setStats(currentStats);
            setLoading(false);
            return;
        }

        const lastDateObj = new Date(lastActive);
        const todayObj = new Date(today);
        const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let updatedHistory = [...(currentStats.recentHistory || [])];
        updatedHistory.push({ date: lastActive, pauses: currentStats.currentPauses });
        if (updatedHistory.length > 3) updatedHistory = updatedHistory.slice(-3);

        const targetPauses = userIsPro ? 2 : 3;
        let addedStrikes = currentStats.currentPauses < targetPauses ? 1 : 0;

        if (diffDays > 1) {
            addedStrikes += diffDays - 1;
            for (let i = 1; i < diffDays; i++) {
                const missedDate = new Date(lastDateObj);
                missedDate.setDate(missedDate.getDate() + i);
                updatedHistory.push({ date: missedDate.toISOString().split('T')[0], pauses: 0 });
            }
            if (updatedHistory.length > 3) updatedHistory = updatedHistory.slice(-3);
        }

        const dayDiff = Math.ceil((todayObj.getTime() - new Date(currentStats.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const updatedStats: BePracticeStats = {
            ...currentStats,
            currentPauses: 0,
            lastActiveDate: today,
            streakBreaksUsed: currentStats.streakBreaksUsed + addedStrikes,
            recentHistory: updatedHistory,
            dayOfPractice: dayDiff,
        };

        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { bePractice: updatedStats });
        } catch (e) {
            console.error('Failed to update daily stats:', e);
            // Still update local state even if Firestore write fails
            setStats(updatedStats);
            setLoading(false);
        }
    };

    const registerPause = async (): Promise<{ petalAwarded: boolean }> => {
        if (!user || !stats || stats.practiceState !== 'active') return { petalAwarded: false };

        const newPauses = stats.currentPauses + 1;
        const targetPauses = isPro ? 2 : 3;
        const petalAwarded = newPauses === targetPauses;
        const newBloomDays = petalAwarded ? stats.bloomDays + 1 : stats.bloomDays;

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                'bePractice.currentPauses': newPauses,
                'bePractice.bloomDays': newBloomDays,
            });
        } catch (e) {
            console.error('Failed to register pause:', e);
        }

        return { petalAwarded };
    };

    const startNewPractice = async () => {
        if (!user) return;

        const newStats: BePracticeStats = {
            ...DEFAULT_STATS,
            startDate: new Date().toISOString(),
            lastActiveDate: getTodayStr(),
        };

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { bePractice: newStats });
        } catch (e) {
            console.error('Failed to start new practice:', e);
        }
    };

    return { stats, loading, registerPause, startNewPractice };
}
