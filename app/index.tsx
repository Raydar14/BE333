import { View, Text, StyleSheet, Image, Vibration, Alert, TouchableOpacity, ScrollView, Platform, Share, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, UserCircle, LogIn, Heart, ArrowUp } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useBePractice } from '../hooks/useBePractice';
import { useBiofeedback } from '../contexts/BiofeedbackContext';
import { PremiumButton } from '../components/PremiumButton';
import { ShimmerButton } from '../components/ShimmerButton';
import { GuestBanner } from '../components/GuestBanner';
import { BreathingLeaves } from '../components/BreathingLeaves';
import { BiofeedbackChart } from '../components/BiofeedbackChart';
import { SessionPhaseGuide } from '../components/SessionPhaseGuide';
import { BreathingBelly } from '../components/BreathingBelly'; // Use new Belly component
import { PetalAwardModal } from '../components/PetalAwardModal';

import { BiofeedbackSummary } from '../components/BiofeedbackSummary';
import { DeviceScanner } from '../components/DeviceScanner';
import { SessionSummary } from '../services/BiofeedbackService';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing as ReanimatedEasing } from 'react-native-reanimated';


const HABIT_ACTIVITIES = [
    'Breath Work', 'BE Again', 'Yoga', 'Chanting', 'Singing', 'Journaling',
    'Stretching', 'Gratitude', 'Poetry',
    'Day Planning', 'Prayer', 'Mantra'
];

export default function Home() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();
    const { isPro } = usePurchase();
    const {
        timerDuration,
        showNatureVisuals,
        showBreathingGuide,
        timerMode,
        breathingPattern,
        deep3Enabled,
        deep3Duration,
        setDeep3Enabled
    } = useSettings();
    const router = useRouter();
    const params = useLocalSearchParams();

    useProtectedRoute();

    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Restore completion state if navigating back; clear the param so it doesn't re-fire
    useEffect(() => {
        if (params.restored === 'true') {
            setIsCompleted(true);
            setIsActive(false);
            setTimeLeft(0);
            router.setParams({ restored: undefined });
        }
    }, [params.restored]);

    // Refs for safe access inside timeouts to fix persistence issues
    const isActiveRef = useRef(isActive);
    const isCompletedRef = useRef(isCompleted);

    useEffect(() => {
        isActiveRef.current = isActive;
        isCompletedRef.current = isCompleted;
    }, [isActive, isCompleted]);

    const [guideText, setGuideText] = useState('Get Ready');
    const [subGuideText, setSubGuideText] = useState('');
    const [breathingPhase, setBreathingPhase] = useState<'deep3' | 'exhale' | 'inhale' | 'pause' | 'idle'>('idle');
    const [isDeep3Active, setIsDeep3Active] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const breathingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Biofeedback state
    const {
        isConnected: isBiofeedbackConnected,
        startSessionTracking,
        stopSessionTracking,
        currentReading,
        recentReadings,
    } = useBiofeedback();
    const { stats, registerPause } = useBePractice();

    // Logic for Start Button
    const sessionsToday = stats?.currentPauses || 0;
    const durationInMinutes = Math.floor(timerDuration / 60);
    // Interpreting "!isGuest" as "!isPro" for the limit logic, assuming Pro is unlimited.
    const isBonusSession = sessionsToday >= 3;
    const [biofeedbackSummary, setBiofeedbackSummary] = useState<SessionSummary | null>(null);
    const [showDeviceScanner, setShowDeviceScanner] = useState(false);
    const [showPetalAward, setShowPetalAward] = useState(false);
    const [isGuidanceDismissed, setIsGuidanceDismissed] = useState(false);




    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (breathingTimeoutRef.current) clearTimeout(breathingTimeoutRef.current);
        };
    }, []);

    // Update timer if settings change (and not active)
    useEffect(() => {
        if (!isActive && !isCompleted) {
            setTimeLeft(timerMode === 'open' ? 0 : timerDuration);
        }
    }, [timerDuration, isActive, isCompleted, timerMode]);

    // Main Breathing Logic Engine
    useEffect(() => {
        if (!isActive) {
            setBreathingPhase('idle');
            setGuideText('Ready');
            setSubGuideText('');
            setIsDeep3Active(false);
            if (breathingTimeoutRef.current) clearTimeout(breathingTimeoutRef.current);
            return;
        }

        const inhaleDur = breathingPattern === '3-1-5' ? 3000 : 4000;
        const exhaleDur = breathingPattern === '3-1-5' ? 5000 : 6000;
        const pauseDur = 1000;

        const runDeep3Cycle = (count: number) => {
            if (count <= 0) {
                startNormalCycle();
                return;
            }

            // 1. DEEP3 Exhale (8s)
            setBreathingPhase('exhale');
            setGuideText("Sigh Out");
            setSubGuideText("(Thru mouth. Belly falls.)");

            breathingTimeoutRef.current = setTimeout(() => {
                if (!isActiveRef.current) return;

                // 2. DEEP3 Pause (2s)
                setBreathingPhase('pause');
                setGuideText("Pause");
                setSubGuideText("(Wait for the urge)");

                breathingTimeoutRef.current = setTimeout(() => {
                    if (!isActiveRef.current) return;

                    // 3. DEEP3 In (5s)
                    setBreathingPhase('inhale');
                    setGuideText("Deep Inhale");
                    setSubGuideText("(Thru nose. Belly rises.)");

                    breathingTimeoutRef.current = setTimeout(() => {
                        if (!isActiveRef.current) return;

                        // Loop to next cycle
                        runDeep3Cycle(count - 1);

                    }, 5000); // 5s In duration

                }, 2000); // 2s Pause duration

            }, 8000); // 8s Exhale duration
        };

        const startDeep3 = () => {
            setIsDeep3Active(true);
            runDeep3Cycle(3);
        };

        const startNormalCycle = () => {
            if (!isActiveRef.current) return;
            setIsDeep3Active(false);

            setBreathingPhase('exhale');
            setGuideText("Breathe Out");
            setSubGuideText("");

            breathingTimeoutRef.current = setTimeout(() => {
                if (!isActiveRef.current) return;

                setBreathingPhase('inhale');
                setGuideText("Breathe In");
                setSubGuideText("");

                breathingTimeoutRef.current = setTimeout(() => {
                    if (!isActiveRef.current) return;

                    setBreathingPhase('pause');
                    setGuideText("Pause");
                    setSubGuideText("");

                    breathingTimeoutRef.current = setTimeout(() => {
                        if (isActiveRef.current) startNormalCycle();
                    }, pauseDur);

                }, inhaleDur);

            }, exhaleDur);
        };

        if (deep3Enabled) {
            startDeep3();
        } else {
            startNormalCycle();
        }

        return () => {
            if (breathingTimeoutRef.current) clearTimeout(breathingTimeoutRef.current);
        };
    }, [isActive, breathingPattern, deep3Enabled, deep3Duration]);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (timerMode === 'open') {
                        return prev + 1;
                    }
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            // Clear interval logic if needed, but handled by cleanup
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timerMode]); // Removed timeLeft dependency from interval setup

    // Check for completion
    useEffect(() => {
        if (timeLeft === 0 && isActive && timerMode === 'countdown') {
            handleComplete();
        }
    }, [timeLeft, isActive, timerMode]);



    async function handleComplete() {
        // Stop animations immediately
        if (breathingTimeoutRef.current) clearTimeout(breathingTimeoutRef.current);

        setIsActive(false);
        setIsCompleted(true);
        Vibration.vibrate();

        let bioSummary: SessionSummary | null = null;
        if (isBiofeedbackConnected) {
            bioSummary = stopSessionTracking();
            setBiofeedbackSummary(bioSummary);
        }

        if (user) {
            try {
                const userId = user.uid;
                const durationLogged = timerMode === 'open' ? timeLeft : timerDuration;
                interface SessionRecord {
                    user_id: string;
                    duration_seconds: number;
                    completed_at: Date;
                    biofeedback?: {
                        startHR: number; endHR: number;
                        startHRV: number | null; endHRV: number | null;
                        avgHR: number; avgHRV: number;
                        hrChange: number; hrvChange: number;
                    };
                }
                const sessionData: SessionRecord = {
                    user_id: userId,
                    duration_seconds: durationLogged,
                    completed_at: new Date(),
                };

                if (bioSummary) {
                    sessionData.biofeedback = {
                        startHR: bioSummary.startReading.hr,
                        endHR: bioSummary.endReading.hr,
                        startHRV: bioSummary.startReading.hrv ?? null,
                        endHRV: bioSummary.endReading.hrv ?? null,
                        avgHR: bioSummary.avgHr,
                        avgHRV: bioSummary.avgHrv,
                        hrChange: bioSummary.hrChange,
                        hrvChange: bioSummary.hrvChange,
                    };
                }

                await addDoc(collection(db, 'sessions'), sessionData);
                const result = await registerPause();
                if (result?.petalAwarded) setShowPetalAward(true);

            } catch (e: unknown) {
                console.error('Exception logging session:', e instanceof Error ? e.message : e);
            }
        }
    }

    const handleShareCompletion = async (platform: 'tiktok' | 'facebook' | 'instagram') => {
        const message = `I just completed a 3-minute breathing session on BE333! Pause. Breathe. Join me.`;
        try {
            await Share.share({ message });
        } catch (e: unknown) {
            Alert.alert('Sharing Error', e instanceof Error ? e.message : 'Could not share');
        }
    };

    const toggleTimer = () => {
        if (isCompleted) {
            setIsCompleted(false);
            setTimeLeft(timerMode === 'open' ? 0 : timerDuration);
            setIsActive(false);
            setBiofeedbackSummary(null);
        } else {
            const newActive = !isActive;
            setIsActive(newActive);

            const shouldStartBio = newActive &&
                isBiofeedbackConnected &&
                ((timerMode === 'countdown' && timeLeft === timerDuration) || (timerMode === 'open' && timeLeft === 0));

            if (shouldStartBio) {
                startSessionTracking();
            }
        }
    };

    const handleStartStack = (activity: string) => {
        router.push({
            pathname: '/habit-stack/timer',
            params: {
                activity: activity,
                mode: 'timer',
                durationSeconds: 180 // Default 3 mins
            }
        });
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(timerMode === 'open' ? 0 : timerDuration);
        setBiofeedbackSummary(null);
        if (isBiofeedbackConnected) {
            stopSessionTracking();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={'#FFFFFF'} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.container, { backgroundColor: colors.background }]}>

                        {/* Header Controls */}
                        <View style={styles.headerControls}>
                            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerButton}>
                                <SettingsIcon size={24} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowDeviceScanner(true)}
                                style={[styles.headerButton, isBiofeedbackConnected && styles.headerButtonActive]}
                            >
                                <Heart
                                    size={24}
                                    color={isBiofeedbackConnected ? '#FF6B6B' : colors.textSecondary}
                                    fill={isBiofeedbackConnected ? '#FF6B6B' : 'transparent'}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => user ? router.push('/dashboard') : router.push('/(auth)/login')}
                                style={styles.headerButton}
                            >
                                {user ? <UserCircle size={24} color={colors.textSecondary} /> : <LogIn size={24} color={colors.textSecondary} />}
                            </TouchableOpacity>
                        </View>

                        {!user && <GuestBanner />}

                        {/* Logo Area */}
                        <View style={styles.logoContainer}>
                            <View style={styles.taglineContainer}>
                                <Text style={styles.taglineText}>Pause.</Text>
                                <Text style={styles.taglineText}>Breathe.</Text>
                            </View>
                            <Image
                                source={require('../assets/images/brand_logo_floral.png')}
                                style={styles.logoMain}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Breathing Leaves (Background) */}
                        {showNatureVisuals && (
                            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                                <BreathingLeaves isActive={isActive} phase={breathingPhase} />
                            </View>
                        )}

                        {/* Content */}
                        <View style={styles.content}>

                            {/* Removed Share Row from here */}

                            <View style={styles.timerContainer}>

                                {/* LAYOUT REVISION: 
                                1. The Person (BreathingBelly) is the BACKGROUND / BASE.
                                2. The Timer (Text) and Guide are OVERLAID on top of the person.
                            */}

                                {/* Stacked Layout: Green Glowing Box (Timer+Promo+Start) -> Instructions -> Person (Separated) */}

                                {/* 1. Green Glowing Box (Timer, 3-min line, Start Button) */}
                                <View style={[styles.glowBox, { borderColor: '#4A9977', shadowColor: '#4A9977' }]}>

                                    {/* Timer Text */}
                                    <Text style={[styles.timerTextMain, { color: colors.textLight, fontSize: isCompleted ? 36 : 50 }]}>
                                        {isCompleted ? "You DID it!" : formatTime(timeLeft)}
                                    </Text>

                                    {/* BIOFEEDBACK DISPLAY */}
                                    {isBiofeedbackConnected && !isCompleted && (
                                        <>
                                            <View style={styles.bioRow}>
                                                <View style={styles.bioItem}>
                                                    <Heart size={14} color="#FF6B6B" fill="#FF6B6B" />
                                                    <Text style={styles.bioText}>{currentReading?.hr || '--'} BPM</Text>
                                                </View>
                                                {currentReading?.hrv !== null && (
                                                    <View style={styles.bioItem}>
                                                        <Text style={[styles.bioText, { color: '#4A9977' }]}>HRV</Text>
                                                        <Text style={styles.bioText}>{currentReading?.hrv || '--'} ms</Text>
                                                    </View>
                                                )}
                                            </View>

                                            {/* LIVE GRAPH */}
                                            {/* Unified Session Phase Guide with Chart */}
                                            {isActive && (
                                                <SessionPhaseGuide
                                                    elapsedTime={timerMode === 'open' ? timeLeft : (timerDuration - timeLeft)}
                                                    data={recentReadings}
                                                />
                                            )}
                                        </>
                                    )}

                                    {/* Promo Text (3 mins line) */}
                                    {!isCompleted && !isActive && (
                                        <View style={styles.promoTextContainer}>
                                            <Text style={styles.promoText}><Text style={styles.promoGold}>3</Text>MINS<Text style={styles.promoX}>×</Text><Text style={styles.promoGold}>3</Text><Text style={styles.promoX}>×</Text>sDAY<Text style={styles.promoX}>×</Text><Text style={styles.promoGold}>3</Text>WKS</Text>
                                        </View>
                                    )}

                                    {/* Start/Pause Button OR Stack Habit and Share */}
                                    {isCompleted ? (
                                        <View style={{ alignItems: 'center', width: '100%' }}>

                                            {/* Inline Habit Selection */}
                                            <Text style={{ color: colors.textSecondary, marginBottom: 10, marginTop: 10, fontWeight: '600' }}>Choose Activity</Text>

                                            <View style={styles.habitGrid}>
                                                {HABIT_ACTIVITIES.map(activity => (
                                                    <TouchableOpacity
                                                        key={activity}
                                                        onPress={() => handleStartStack(activity)}
                                                        style={styles.habitCard}
                                                    >
                                                        <Text style={styles.habitText}>{activity}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>

                                            <View style={{ marginTop: 20, alignItems: 'center' }}>
                                                <Text style={{ color: colors.textSecondary, marginBottom: 10, fontSize: 12 }}>Share your session:</Text>
                                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                                    <TouchableOpacity onPress={() => handleShareCompletion('tiktok')} style={styles.miniShareBtn}>
                                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>TikTok</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleShareCompletion('facebook')} style={[styles.miniShareBtn, { backgroundColor: '#1877F2' }]}>
                                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>FB</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleShareCompletion('instagram')} style={[styles.miniShareBtn, { backgroundColor: '#E1306C' }]}>
                                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>IG</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        isActive ? (
                                            <TouchableOpacity
                                                onPress={toggleTimer}
                                                style={styles.innerBoxButton}
                                                activeOpacity={0.7}
                                            >
                                                <View style={{ flexDirection: 'row', gap: 6 }}>
                                                    <View style={styles.pauseBarSmall} />
                                                    <View style={styles.pauseBarSmall} />
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <ShimmerButton
                                                title={isBonusSession ? "Begin Bonus Session" : `Begin ${durationInMinutes}-Minute Practice`}
                                                onPress={toggleTimer}
                                                style={{
                                                    width: 260,
                                                    height: 50,
                                                    marginTop: 10,
                                                    alignSelf: 'center'
                                                }}
                                                textStyle={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }}
                                            />
                                        )
                                    )}
                                </View>

                                {/* 2. Instructions (Between Box and Person) */}
                                {isActive && (
                                    <View style={styles.instructionArea}>
                                        <Image
                                            source={require('../assets/images/monstera_leaves_bg.png')}
                                            style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}
                                            resizeMode="cover"
                                        />
                                        <Text style={{
                                            color: '#FFFFFF',
                                            fontSize: 32, // 3xl equivalent
                                            fontWeight: 'bold',
                                            letterSpacing: 1,
                                            textAlign: 'center',
                                            textShadowColor: 'rgba(0,0,0,0.8)',
                                            textShadowOffset: { width: 1, height: 1 },
                                            textShadowRadius: 3,
                                            zIndex: 10
                                        }}>
                                            {guideText}
                                        </Text>
                                        {subGuideText ? (
                                            <Text style={{
                                                color: '#E0F2F1', // Light green/teal (green-50/100 ish)
                                                fontSize: 15,
                                                marginTop: 4,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                opacity: 0.9,
                                                textShadowColor: 'rgba(0,0,0,0.8)',
                                                textShadowOffset: { width: 1, height: 1 },
                                                textShadowRadius: 2,
                                                zIndex: 10
                                            }}>
                                                {subGuideText}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                                {/* If active but not deep3, we show nothing here to keep layout tight */}
                                {/* If active but not deep3, we show nothing here to keep layout tight */}
                                {!isActive && !isCompleted && !isGuidanceDismissed && (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => setIsGuidanceDismissed(true)}
                                    >
                                        <Animated.View style={[styles.guidanceFrame]}>
                                            <TouchableOpacity
                                                style={{ position: 'absolute', top: 10, right: 10, zIndex: 50, padding: 5 }}
                                                onPress={() => setIsGuidanceDismissed(true)}
                                            >
                                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, fontWeight: 'bold' }}>×</Text>
                                            </TouchableOpacity>

                                            <Text style={styles.guidanceTitle}>
                                                <Text style={styles.deep3LogoText}>DEEP3</Text> GUIDANCE {"\n"}
                                                <Text style={{ fontSize: 8, fontWeight: 'normal', opacity: 0.7 }}>(Tap to Dismiss)</Text>
                                            </Text>
                                            <Text style={styles.guidanceText}>
                                                <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>Exhale: </Text>Release all of the air through your mouth with a sigh, until your body is empty of breath.
                                                {"\n"}
                                                <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>Pause: </Text>Until your body requests an in-breath.
                                                {"\n"}
                                                <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>Inhale: </Text>Through your nose, filling your belly up like a balloon—don't fill it up completely.
                                            </Text>
                                            <View style={{ marginTop: 5, alignItems: 'center' }}>
                                                <Text style={{ color: '#FFD700', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }}>
                                                    Exhale - Pause - Inhale × 3
                                                </Text>
                                            </View>
                                        </Animated.View>
                                    </TouchableOpacity>
                                )}




                                {/* 3. Person Graphic Box (Base) */}
                                <View style={[styles.personBox, { backgroundColor: colors.background }]}>
                                    <BreathingBelly isActive={isActive} phase={breathingPhase} />
                                </View>

                            </View>

                            {/* Actions */}
                            <View style={styles.actions}>
                                {/* Stack Habit moved to Timer Box */}

                                {!isCompleted && (
                                    <>
                                        {((timerMode === 'countdown' && timeLeft < timerDuration) || (timerMode === 'open' && timeLeft > 0)) && (
                                            <PremiumButton
                                                title="Reset"
                                                variant="outline"
                                                onPress={resetTimer}
                                                style={styles.secondaryButton}
                                                textStyle={{ color: colors.textSecondary }}
                                            />
                                        )}
                                        {!isActive && timerMode === 'open' && timeLeft > 0 && (
                                            <PremiumButton
                                                title="Finish Session"
                                                variant="primary"
                                                onPress={handleComplete}
                                                style={[styles.secondaryButton, { marginTop: 10 }]}
                                            />
                                        )}
                                    </>
                                )}

                                <PremiumButton
                                    title="Dashboard"
                                    variant="primary"
                                    onPress={() => router.push('/dashboard')}
                                    style={styles.secondaryButton}
                                />
                            </View>

                            {isCompleted && biofeedbackSummary && (
                                <BiofeedbackSummary
                                    summary={biofeedbackSummary}
                                    durationSeconds={timerDuration}
                                />
                            )}
                        </View>

                        <DeviceScanner
                            visible={showDeviceScanner}
                            onClose={() => setShowDeviceScanner(false)}
                        />

                        <PetalAwardModal
                            visible={showPetalAward}
                            onClose={() => setShowPetalAward(false)}
                            dayOfPractice={stats?.dayOfPractice || 0}
                            bloomDays={stats?.bloomDays || 0}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView >
    );

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    headerControls: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 15,
        marginBottom: 10,
        marginTop: 10,
        zIndex: 50,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 0,
        zIndex: 20,
    },
    headerButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    headerButtonActive: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    logoMain: {
        width: 300,
        height: 220,
        marginBottom: 0,
        resizeMode: 'contain',
    },
    taglineContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        zIndex: 5,
    },
    taglineText: {
        color: '#FFD700',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        letterSpacing: 2,
        lineHeight: 38,
        textShadowColor: '#004d40',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        elevation: 8,
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 0,
    },
    // Styles for new Stacked Layout
    // Styles for new GLOW BOX Layout
    glowBox: {
        width: 300,
        paddingVertical: 20,
        borderRadius: 30,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle glass fill
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 0,
    },
    innerBoxButton: {
        marginTop: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    timerTextMain: {
        fontSize: 50,
        fontWeight: '300',
        letterSpacing: -1,
    },
    instructionArea: {
        width: 300,
        height: 140, // Expanded significantly
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)', // Subtle gold border
        zIndex: 20,
        backgroundColor: '#000', // Fallback
    },
    guideTextLarge: {
        color: '#E8F5E9',
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 1,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    guidePlaceholder: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 16,
        fontWeight: '400',
    },
    plainStartTextSmall: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    pauseBarSmall: {
        width: 4,
        height: 16,
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    personBox: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30, // Updated to match timer box
        overflow: 'hidden',
        marginBottom: 20,
    },
    // Old Floating Button Removed
    floatingStartButton: { display: 'none' }, // explicit hide
    plainStartText: { display: 'none' },
    pauseBar: { display: 'none' },

    promoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 0,
    },
    promoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E8F5E9',
        letterSpacing: 0.5,
    },
    promoX: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFD700',
        top: 2,
    },
    promoGold: {
        fontSize: 36,
        color: '#FFD700',
        textShadowColor: '#004d40',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    actions: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        paddingHorizontal: 30,
        gap: 15,
        marginTop: 20
    },
    secondaryButton: {
        height: 52,
        borderRadius: 26,
    },
    completionShareRow: {
        alignItems: 'center',
        marginVertical: 15,
    },
    miniShareBtn: {
        backgroundColor: '#000',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Keep unused styles to avoid specific replacement errors
    controlIconContainer: {},
    innerControlContainer: {},
    plainControlButton: {},
    innerGlowCard: {},
    timerCard: {},
    timerTextOverlay: {},
    overlayContainer: {},
    personLayer: {},
    timerOverlayLayer: {},
    guideBox: {},
    guideText: {},
    guidanceFrame: {
        width: 300, // Constrained width same as timer box
        borderWidth: 1,
        borderColor: '#FFD700', // Gold
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 0,
        backgroundColor: 'rgba(26, 67, 49, 0.5)', // Slight background dim
    },
    guidanceTitle: {
        color: '#E8F5E9',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
        textAlign: 'center',
    },
    deep3LogoText: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        letterSpacing: 1,
        textShadowColor: '#004d40',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    habitGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 10,
    },
    habitCard: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    habitCardSelected: {
        backgroundColor: '#4A9977',
        borderColor: '#4A9977',
    },
    habitText: {
        color: '#E8F5E9',
        fontSize: 12,
        fontWeight: '500',
    },
    habitTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    guidanceText: {
        color: '#E8F5E9',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    bioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        marginTop: 5,
        marginBottom: 10,
    },
    bioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    bioText: {
        color: '#E8F5E9',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
