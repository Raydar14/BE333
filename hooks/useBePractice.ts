import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BePracticeStats {
    practiceState: 'active' | 'resting_ritual' | 'completed';
    startDate: string; // ISO Date String
    dayOfPractice: number; // 1-21 estimated by calendar days

    bloomDays: number; // Total Petals (0-21)
    currentPauses: number; // Pauses completed TODAY (0-3)
    streakBreaksUsed: number; // Rest days used (0-3)

    // History for 3-Day Trend
    recentHistory: { date: string; pauses: number }[];

    lastActiveDate: string; // YYYY-MM-DD to track daily resets
    resetRitualStartDate?: string | null; // If in resting state
}

const DEFAULT_STATS: BePracticeStats = {
    practiceState: 'active',
    startDate: new Date().toISOString(),
    dayOfPractice: 1,
    bloomDays: 0,
    currentPauses: 0,
    streakBreaksUsed: 0,
    recentHistory: [],
    lastActiveDate: new Date().toISOString().split('T')[0],
    resetRitualStartDate: null,
};

export function useBePractice() {
    const { user } = useAuth();
    const { isPro } = usePurchase();
    const [stats, setStats] = useState<BePracticeStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper to get today's date string YYYY-MM-DD
    const getTodayStr = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!user) {
            setStats(null);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().bePractice) {
                const data = docSnap.data().bePractice as BePracticeStats;
                checkDailyLogic(data, user.uid, isPro);
            } else {
                // Initialize if missing
                const initialStats = {
                    ...DEFAULT_STATS,
                    startDate: new Date().toISOString(),
                    lastActiveDate: getTodayStr(),
                };
                setDoc(userRef, { bePractice: initialStats }, { merge: true });
                setStats(initialStats);
                setLoading(false);
            }
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

        // New Day Detected!
        let newStreakBreaks = currentStats.streakBreaksUsed;
        const lastDateObj = new Date(lastActive);
        const todayObj = new Date(today);
        const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Update History: Push yesterday's final state
        let updatedHistory = [...(currentStats.recentHistory || [])];
        // If we missed days, we might want to fill them with 0, but for "Last 3 Days of active use" vs "Last 3 calendar days":
        // Requirements say "trend", usually implies calendar days.
        // Simple approach: Add the *last active* day's result to history
        updatedHistory.push({ date: lastActive, pauses: currentStats.currentPauses });

        // Keep only last 3
        if (updatedHistory.length > 3) {
            updatedHistory = updatedHistory.slice(updatedHistory.length - 3);
        }

        let addedStrikes = 0;

        // Check yesterday's completeness
        const targetPauses = userIsPro ? 2 : 3;

        if (currentStats.currentPauses < targetPauses) {
            addedStrikes += 1;
        }
        // Penalize for completely missed days in between
        if (diffDays > 1) {
            addedStrikes += (diffDays - 1);
            // Optionally backfill missed days as 0 in history
            for (let i = 1; i < diffDays; i++) {
                const missedDate = new Date(lastDateObj);
                missedDate.setDate(missedDate.getDate() + i);
                updatedHistory.push({ date: missedDate.toISOString().split('T')[0], pauses: 0 });
            }
            if (updatedHistory.length > 3) {
                updatedHistory = updatedHistory.slice(updatedHistory.length - 3);
            }
        }

        newStreakBreaks += addedStrikes;

        let newState = currentStats.practiceState;
        let resetDate = currentStats.resetRitualStartDate;

        // PRO RULE: Unlimited Resets / No Loss
        // If Pro, we NEVER enter 'resting_ritual' even if 3 strikes.
        if (!userIsPro && newStreakBreaks >= 3 && currentStats.practiceState === 'active') {
            newState = 'resting_ritual';
            resetDate = new Date().toISOString();
        }

        const updatedStats: BePracticeStats = {
            ...currentStats,
            currentPauses: 0, // Reset for today
            lastActiveDate: today,
            streakBreaksUsed: newStreakBreaks,
            recentHistory: updatedHistory,
            practiceState: newState,
            resetRitualStartDate: resetDate,
        };

        const start = new Date(currentStats.startDate);
        const dayDiff = Math.ceil((todayObj.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        updatedStats.dayOfPractice = dayDiff;

        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { bePractice: updatedStats });
    };

    const registerPause = async (): Promise<{ petalAwarded: boolean }> => {
        if (!user || !stats || stats.practiceState !== 'active') return { petalAwarded: false };

        const newPauses = stats.currentPauses + 1;

        // PRO RULE: Bloom Logic
        const targetPauses = isPro ? 2 : 3;
        let newBloomDays = stats.bloomDays;
        let petalAwarded = false;

        if (newPauses === targetPauses) {
            newBloomDays += 1;
            petalAwarded = true;
        }

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            'bePractice.currentPauses': newPauses,
            'bePractice.bloomDays': newBloomDays
            // We don't strictly need to update 'recentHistory' here because that stores *past* days. 
            // Today is 'currentPauses'.
        });

        return { petalAwarded };
    };

    const startNewPractice = async () => {
        if (!user) return;

        const newStats: BePracticeStats = {
            ...DEFAULT_STATS,
            startDate: new Date().toISOString(),
            lastActiveDate: getTodayStr(),
        };

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { bePractice: newStats });
    };

    return {
        stats,
        loading,
        registerPause,
        startNewPractice
    };
}
