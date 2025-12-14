import { View, Text, StyleSheet, Image, Vibration, Alert, TouchableOpacity, ScrollView, Platform, Share, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, UserCircle, LogIn, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useBePractice } from '../hooks/useBePractice';
import { useBiofeedback } from '../contexts/BiofeedbackContext';
import { PremiumButton } from '../components/PremiumButton';
import { ShimmerButton } from '../components/ShimmerButton';
import { GuestBanner } from '../components/GuestBanner';
import { BreathingLeaves } from '../components/BreathingLeaves';
import { BreathingBelly } from '../components/BreathingBelly'; // Use new Belly component
import { PetalAwardModal } from '../components/PetalAwardModal';

import { BiofeedbackSummary } from '../components/BiofeedbackSummary';
import { DeviceScanner } from '../components/DeviceScanner';
import { SessionSummary } from '../services/BiofeedbackService';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Home() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();
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

    useProtectedRoute();

    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [guideText, setGuideText] = useState('Get Ready');
    const [breathingPhase, setBreathingPhase] = useState<'deep3' | 'exhale' | 'inhale' | 'pause' | 'idle'>('idle');

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const breathingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Biofeedback state
    const {
        isConnected: isBiofeedbackConnected,
        startSessionTracking,
        stopSessionTracking,
    } = useBiofeedback();
    const [biofeedbackSummary, setBiofeedbackSummary] = useState<SessionSummary | null>(null);
    const [showDeviceScanner, setShowDeviceScanner] = useState(false);
    const [showPetalAward, setShowPetalAward] = useState(false);

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
            if (breathingTimeoutRef.current) clearTimeout(breathingTimeoutRef.current);
            return;
        }

        const inhaleDur = breathingPattern === '3-1-5' ? 3000 : 4000;
        const exhaleDur = breathingPattern === '3-1-5' ? 5000 : 6000;
        const pauseDur = 1000;

        const startDeep3 = () => {
            setBreathingPhase('deep3');
            setGuideText("First, blow all the air out of your body through your mouth—blow until you can't blow anymore.\n\nThen, when your body naturally retracts with an in-breath, allow it through your nose, filling your belly/lungs to 84% before blowing out through your mouth again for 3 cycles.");
            breathingTimeoutRef.current = setTimeout(() => {
                startNormalCycle();
            }, deep3Duration * 1000);
        };

        const startNormalCycle = () => {
            setBreathingPhase('exhale');
            setGuideText("Breathe Out Slow & Long - Shrink Belly In");

            breathingTimeoutRef.current = setTimeout(() => {
                setBreathingPhase('inhale');
                setGuideText("Breathe In - Fill Belly Out");

                breathingTimeoutRef.current = setTimeout(() => {
                    setBreathingPhase('pause');
                    setGuideText("...Pause...");

                    breathingTimeoutRef.current = setTimeout(() => {
                        if (isActive) startNormalCycle();
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
        } else if (timeLeft === 0 && isActive && timerMode === 'countdown') {
            handleComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft, timerMode]);

    const { registerPause, stats } = useBePractice();

    async function handleComplete() {
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
                const sessionData: any = {
                    user_id: userId,
                    duration_seconds: durationLogged,
                    completed_at: new Date()
                };

                if (bioSummary) {
                    sessionData.biofeedback = {
                        startHR: bioSummary.startReading.hr,
                        endHR: bioSummary.endReading.hr,
                        startHRV: bioSummary.startReading.hrv,
                        endHRV: bioSummary.endReading.hrv,
                        avgHR: bioSummary.avgHr,
                        avgHRV: bioSummary.avgHrv,
                        hrChange: bioSummary.hrChange,
                        hrvChange: bioSummary.hrvChange,
                    };
                }

                await addDoc(collection(db, 'sessions'), sessionData);
                const { petalAwarded } = await registerPause();
                if (petalAwarded) setShowPetalAward(true);

            } catch (e) {
                console.error('Exception logging session:', e);
            }
        }
    }

    const handleShareCompletion = async (platform: 'tiktok' | 'facebook' | 'instagram') => {
        const message = `I just completed a 3-minute breathing session on BE333! Pause. Breathe. Join me.`;
        try {
            await Share.share({ message });
        } catch (e: any) {
            Alert.alert('Sharing Error', e.message);
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

    if (loading) return null;

    return (
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

                        {isCompleted && (
                            <View style={styles.completionShareRow}>
                                <Text style={{ color: colors.textSecondary, marginBottom: 10 }}>Share your session:</Text>
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
                        )}

                        <View style={styles.timerContainer}>

                            {/* LAYOUT REVISION: 
                                1. The Person (BreathingBelly) is the BACKGROUND / BASE.
                                2. The Timer (Text) and Guide are OVERLAID on top of the person.
                            */}

                            {/* Stacked Layout: Green Glowing Box (Timer+Promo+Start) -> Instructions -> Person (Separated) */}

                            {/* 1. Green Glowing Box (Timer, 3-min line, Start Button) */}
                            <View style={[styles.glowBox, { borderColor: '#4A9977', shadowColor: '#4A9977' }]}>

                                {/* Timer Text */}
                                <Text style={[styles.timerTextMain, { color: colors.textLight }]}>
                                    {isCompleted ? "Done!" : formatTime(timeLeft)}
                                </Text>

                                {/* Promo Text (3 mins line) */}
                                {!isCompleted && !isActive && (
                                    <View style={styles.promoTextContainer}>
                                        <Text style={styles.promoText}><Text style={styles.promoGold}>3</Text>MINS<Text style={styles.promoX}>×</Text><Text style={styles.promoGold}>3</Text><Text style={styles.promoX}>×</Text>sDAY<Text style={styles.promoX}>×</Text><Text style={styles.promoGold}>3</Text>WKS</Text>
                                    </View>
                                )}

                                {/* Start/Pause Button (Inside the Box now) */}
                                <TouchableOpacity
                                    onPress={toggleTimer}
                                    style={styles.innerBoxButton}
                                    activeOpacity={0.7}
                                >
                                    {isActive ? (
                                        <View style={{ flexDirection: 'row', gap: 6 }}>
                                            <View style={styles.pauseBarSmall} />
                                            <View style={styles.pauseBarSmall} />
                                        </View>
                                    ) : (
                                        <Text style={styles.plainStartTextSmall}>START</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* 2. Instructions (Between Box and Person) */}
                            {isActive ? (
                                <View style={styles.instructionArea}>
                                    {showBreathingGuide && (
                                        <Text style={styles.guideTextLarge}>
                                            {guideText}
                                        </Text>
                                    )}
                                    {breathingPhase === 'deep3' && (
                                        <TouchableOpacity onPress={() => setDeep3Enabled(false)}>
                                            <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>(Skip Intro)</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                !isCompleted && (
                                    <View style={styles.guidanceFrame}>
                                        <Text style={styles.guidanceTitle}>DEEP3 GUIDANCE</Text>
                                        <Text style={styles.guidanceText}>
                                            <Text style={{ fontWeight: 'bold' }}>Release: </Text>Begin by sighing or blowing all the air out through your mouth until your lungs feel completely empty.
                                            {"\n\n"}
                                            <Text style={{ fontWeight: 'bold' }}>Pause: </Text>Relax with no breath for just a moment until your body requests a breath in.
                                            {"\n\n"}
                                            <Text style={{ fontWeight: 'bold' }}>Inhale: </Text>Through your nose, take a full, calm breath, filling your belly like a slow balloon till 84% full then,
                                            {"\n\n"}
                                            <Text style={{ fontWeight: 'bold' }}>Exhale: </Text>Let the breath go slowly through your mouth.
                                        </Text>
                                    </View>
                                )
                            )}

                            {/* 3. Person Graphic Box (Base) */}
                            <View style={[styles.personBox, { backgroundColor: colors.background }]}>
                                <BreathingBelly isActive={isActive} phase={breathingPhase} />
                            </View>

                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            {isCompleted && (
                                <ShimmerButton
                                    title="Stack a Habit (+3 min)"
                                    onPress={() => router.push('/habit-stack/selection')}
                                    style={styles.secondaryButton}
                                />
                            )}

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
        marginBottom: -30,
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
        marginBottom: 10,
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
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        zIndex: 20,
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
        marginBottom: 20,
        backgroundColor: 'rgba(26, 67, 49, 0.5)', // Slight background dim
    },
    guidanceTitle: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 3,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    guidanceText: {
        color: '#E8F5E9',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        fontStyle: 'italic',
    },
});
