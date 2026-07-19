import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// The Master Manual defines three progression stages after the first
// 21-day Practice. Duration is per BE Pause; the daily rhythm stays at 3×.
export type PracticeStage = '333' | '666' | '999';

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
    // Manual: 333 → 666 (6 min × 3) → 999 (9 min × 3).
    // Optional so existing docs default to 333.
    practiceStage?: PracticeStage;
    // Tracks which stages the user has ever completed — drives which
    // upgrades are offered on Practice completion.
    completedStages?: PracticeStage[];
}

export interface BuddyChallengeState {
    active: boolean;
    buddyUid?: string;
    buddyName?: string;
    myMissedSessions: number;
    buddyMissedSessions: number;
    status: 'ongoing' | 'won' | 'lost';
}

function getTodayStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Manual: BE Pause length depends on the current stage.
// 333 → 3 min · 666 → 6 min · 999 → 9 min. Pro users can override in Settings.
export function getPauseDurationForStage(stage?: PracticeStage): number {
    switch (stage) {
        case '666': return 360;
        case '999': return 540;
        case '333':
        default: return 180;
    }
}

// Given the stage the user just completed, return the next stage (or null).
export function nextStageAfter(stage: PracticeStage): PracticeStage | null {
    if (stage === '333') return '666';
    if (stage === '666') return '999';
    return null; // Completed all three
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
    practiceStage: '333',
    completedStages: [],
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
                const buddy = docSnap.data().buddyChallenge as BuddyChallengeState | undefined;
                await checkDailyLogic(data, user.uid, isPro, buddy);
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

    const checkDailyLogic = async (
        currentStats: BePracticeStats,
        uid: string,
        userIsPro: boolean,
        buddy?: BuddyChallengeState
    ) => {
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

        // Manual: every user needs all 3 BE Pauses for a Bloom Day.
        const targetPauses = 3;
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

        // Buddy Challenge — a "missed" day is any day the user did not
        // complete the target Pause count. Increment on each missed day.
        // At 3 misses, the current Round is lost (Practice itself continues).
        let updatedBuddy: BuddyChallengeState | undefined = undefined;
        if (buddy && buddy.active && buddy.status === 'ongoing' && addedStrikes > 0) {
            const newMissed = buddy.myMissedSessions + addedStrikes;
            const lost = newMissed >= 3;
            updatedBuddy = {
                ...buddy,
                myMissedSessions: newMissed,
                status: lost ? 'lost' : 'ongoing',
            };
        }

        try {
            const userRef = doc(db, 'users', uid);
            const payload: Record<string, unknown> = { bePractice: updatedStats };
            if (updatedBuddy) payload.buddyChallenge = updatedBuddy;
            await updateDoc(userRef, payload);

            // Mirror the loss on the buddy's side so their Round is marked won.
            if (updatedBuddy && updatedBuddy.status === 'lost' && buddy.buddyUid) {
                try {
                    await updateDoc(doc(db, 'users', buddy.buddyUid), {
                        'buddyChallenge.status': 'won',
                    });
                } catch (e) {
                    console.warn('Failed to mirror buddy round win:', e);
                }
            }
        } catch (e) {
            console.error('Failed to update daily stats:', e);
            setStats(updatedStats);
            setLoading(false);
        }
    };

    const registerPause = async (): Promise<{ petalAwarded: boolean }> => {
        if (!user || !stats || stats.practiceState !== 'active') return { petalAwarded: false };

        const newPauses = stats.currentPauses + 1;
        // Manual: everyone needs all 3 daily BE Pauses to earn a Bloom Petal.
        const targetPauses = 3;
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

    const startNewPractice = async (opts?: { stage?: PracticeStage }) => {
        if (!user) return;

        const desiredStage = opts?.stage ?? stats?.practiceStage ?? '333';

        const newStats: BePracticeStats = {
            ...DEFAULT_STATS,
            startDate: new Date().toISOString(),
            lastActiveDate: getTodayStr(),
            practiceStage: desiredStage,
            completedStages: stats?.completedStages ?? [],
        };

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { bePractice: newStats });
        } catch (e) {
            console.error('Failed to start new practice:', e);
        }
    };

    // Called from the Practice-complete flow to mark the current stage as
    // done and (optionally) roll into the next stage's Practice. If no
    // next stage exists, the user simply repeats their current stage.
    const completeStageAndAdvance = async (): Promise<{ advancedTo: PracticeStage | null }> => {
        if (!user || !stats) return { advancedTo: null };
        const current = stats.practiceStage ?? '333';
        const alreadyCompleted = stats.completedStages ?? [];
        const nextStage = nextStageAfter(current);
        const completedStages = alreadyCompleted.includes(current)
            ? alreadyCompleted
            : [...alreadyCompleted, current];

        const advanceTo = nextStage ?? current; // No further stage → repeat current

        const nextStats: BePracticeStats = {
            ...DEFAULT_STATS,
            startDate: new Date().toISOString(),
            lastActiveDate: getTodayStr(),
            practiceStage: advanceTo,
            completedStages,
        };

        try {
            await updateDoc(doc(db, 'users', user.uid), { bePractice: nextStats });
        } catch (e) {
            console.error('Failed to advance practice stage:', e);
        }

        return { advancedTo: nextStage };
    };

    return {
        stats,
        loading,
        registerPause,
        startNewPractice,
        completeStageAndAdvance,
        pauseDurationSec: getPauseDurationForStage(stats?.practiceStage),
    };
}
