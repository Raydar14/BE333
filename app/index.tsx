import { View, Text, StyleSheet, Image, Vibration, Alert, TouchableOpacity, ScrollView } from 'react-native';
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
import { BreathingCircle } from '../components/BreathingCircle';
import { PetalAwardModal } from '../components/PetalAwardModal';

import { BiofeedbackIndicator } from '../components/BiofeedbackIndicator';
import { BiofeedbackSummary } from '../components/BiofeedbackSummary';
import { DeviceScanner } from '../components/DeviceScanner';
import { SessionSummary } from '../services/BiofeedbackService';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';



export default function Home() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();
    const { timerDuration, showNatureVisuals, showBreathingGuide } = useSettings();
    const router = useRouter();

    useProtectedRoute();

    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Biofeedback state
    const {
        isConnected: isBiofeedbackConnected,
        startSessionTracking,
        stopSessionTracking,
        currentReading
    } = useBiofeedback();
    const [biofeedbackSummary, setBiofeedbackSummary] = useState<SessionSummary | null>(null);
    const [showDeviceScanner, setShowDeviceScanner] = useState(false);
    const [showPetalAward, setShowPetalAward] = useState(false);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Update timer if settings change (and not active)
    useEffect(() => {
        if (!isActive && !isCompleted) {
            setTimeLeft(timerDuration);
        }
    }, [timerDuration, isActive, isCompleted]);

    useEffect(() => {
        // Clear any existing interval first
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleComplete();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, timeLeft]);

    const { registerPause, stats } = useBePractice();

    async function handleComplete() {
        setIsActive(false);
        setIsCompleted(true);
        Vibration.vibrate();

        // Stop biofeedback tracking and get summary
        let bioSummary: SessionSummary | null = null;
        if (isBiofeedbackConnected) {
            bioSummary = stopSessionTracking();
            setBiofeedbackSummary(bioSummary);
        }

        // Log Session if User
        if (user) {
            try {
                const userId = user.uid;

                // Build session data with optional biofeedback
                const sessionData: any = {
                    user_id: userId,
                    duration_seconds: timerDuration,
                    completed_at: new Date()
                };

                // Add biofeedback data if available
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

                // Update BE Practice Stats
                const { petalAwarded } = await registerPause();
                if (petalAwarded) {
                    setShowPetalAward(true);
                }

            } catch (e) {
                console.error('Exception logging session:', e);
            }
        }
    }

    const toggleTimer = () => {
        if (isCompleted) {
            // Reset
            setIsCompleted(false);
            setTimeLeft(timerDuration);
            setIsActive(false);
            setBiofeedbackSummary(null);
        } else {
            const newActive = !isActive;
            setIsActive(newActive);

            // Start/stop biofeedback tracking
            if (newActive && isBiofeedbackConnected && timeLeft === timerDuration) {
                // Starting fresh - begin tracking
                startSessionTracking();
            }
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(timerDuration);
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


    // ... (in component)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.container, { backgroundColor: colors.background }]}>

                    {/* Header Controls: Properly stacked now (Icons -> Lotus -> Catchphrase) */}
                    <View style={styles.headerControls}>
                        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerButton}>
                            <SettingsIcon size={24} color={colors.textSecondary} />
                        </TouchableOpacity>

                        {/* Biofeedback device button */}
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
                            {user ? (
                                <UserCircle size={24} color={colors.textSecondary} />
                            ) : (
                                <LogIn size={24} color={colors.textSecondary} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {!user && <GuestBanner />}

                    {/* Breathing leaves animation - Needs relative positioning or different handling if it was absolute full screen */}
                    {/* We'll wrap it in a container if it needs to be behind everything, or keep it as is if it's absolute */}
                    {/* BreathingLeaves is usually absolute. Let's ensure it doesn't block interactions or get cut off. 
                        Usually it's fine as absolute background. */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={[styles.tagline, { color: colors.textLight }]}>Pause. Breathe. Be333</Text>
                    </View>

                    {/* Breathing Leaves (Background) */}
                    {showNatureVisuals && (
                        <View style={StyleSheet.absoluteFill} pointerEvents="none">
                            <BreathingLeaves isActive={isActive} />
                        </View>
                    )}


                    <View style={styles.content}>

                        <View style={styles.timerContainer}>
                            <View style={[styles.timerCircle, {
                                borderColor: isActive ? '#4A9977' : (isCompleted ? '#4CAF50' : colors.textSecondary),
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                shadowColor: isActive ? '#4A9977' : 'transparent',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: isActive ? 0.9 : 0,
                                shadowRadius: isActive ? 30 : 0,
                                elevation: isActive ? 25 : 0,
                            }]}>
                                {/* Timer text at top */}
                                <View style={styles.timerTextTop}>
                                    <Text style={[styles.timerText, { color: colors.textLight }]}>
                                        {isCompleted ? "Done!" : formatTime(timeLeft)}
                                    </Text>
                                    {!isCompleted && !isActive && (
                                        <Text style={[styles.timerSubtext, { color: colors.textSecondary }]}>
                                            3mins × 3×Day × 3wks
                                        </Text>
                                    )}
                                </View>

                                {/* Lotus centered */}
                                <View style={styles.lotusInCircle}>
                                    <BreathingCircle
                                        isActive={isActive}
                                        showGuide={showBreathingGuide}
                                        showNature={showNatureVisuals}
                                        isMinuteMark={isActive && timeLeft > 0 && timeLeft % 60 === 0}
                                    />
                                </View>

                                {/* Inner Circle Glow Overlay */}
                                <View pointerEvents="none" style={styles.innerGlow} />
                            </View>

                        </View>

                        {/* Control Button - Moved Clearly Below Visuals */}
                        <View style={styles.controlsContainer}>
                            <TouchableOpacity
                                onPress={toggleTimer}
                                style={styles.mainControlCircle}
                                activeOpacity={0.7}
                            >
                                <View style={styles.controlIconContainer}>
                                    {isActive ? (
                                        // Pause Icon
                                        <View style={{ flexDirection: 'row', gap: 6 }}>
                                            <View style={styles.pauseBar} />
                                            <View style={styles.pauseBar} />
                                        </View>
                                    ) : (
                                        // Play Triangle / Start Text
                                        timeLeft < timerDuration ? (
                                            <View style={styles.playTriangle} />
                                        ) : (
                                            <Text style={styles.miniButtonText}>START</Text>
                                        )
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Temporary Onboarding Test Button */}
                        <TouchableOpacity onPress={() => router.push('/onboarding')} style={{ marginTop: 20 }}>
                            <Text style={{ color: colors.textSecondary, textDecorationLine: 'underline' }}>
                                (Test Onboarding)
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.actions}>
                            {/* Primary Start Button removed from here, moved to circle */}


                            {isCompleted && (
                                <ShimmerButton
                                    title="Stack a Habit (+3 min)"
                                    onPress={() => router.push('/habit-stack/selection')}
                                    style={styles.secondaryButton}
                                />
                            )}

                            {!isCompleted && timeLeft < timerDuration && (
                                <PremiumButton
                                    title="Reset"
                                    variant="outline"
                                    onPress={resetTimer}
                                    style={styles.secondaryButton}
                                    textStyle={{ color: colors.textSecondary }}
                                />
                            )}

                            <PremiumButton
                                title="Dashboard"
                                variant="primary" // Gradient Green
                                onPress={() => router.push('/dashboard')}
                                style={styles.secondaryButton}
                            />
                        </View>

                        {/* Biofeedback post-session summary */}
                        {isCompleted && biofeedbackSummary && (
                            <BiofeedbackSummary
                                summary={biofeedbackSummary}
                                durationSeconds={timerDuration}
                            />
                        )}
                    </View>

                    {/* Device Scanner Modal */}
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
        maxWidth: 500, // Increased max width
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    headerControls: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end', // Right align icons
        gap: 15,
        marginBottom: 10,
        marginTop: 10,
        zIndex: 50,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 20,
    },
    // ... existing headerButton styles ...
    headerButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    headerButtonActive: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
    },
    settingsButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        minWidth: 0,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 100,
        marginBottom: 5,
        resizeMode: 'contain',
    },
    tagline: {
        fontSize: 16,
        fontWeight: '300',
        marginBottom: 10,
        letterSpacing: 1,
        opacity: 0.9,
    },
    timerContainer: {
        alignItems: 'center',
        marginVertical: 20, // Vertical spacing
    },
    timerCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 6, // Thicker border
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        shadowColor: "#4A9977",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
    },
    innerGlow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 140,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#FFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    lotusInCircle: {
        position: 'absolute',
        top: 20,
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerTextTop: {
        position: 'absolute',
        top: 40, // Moved down slightly to make room
        alignItems: 'center',
        zIndex: 10,
    },
    controlsContainer: {
        marginTop: 60, // Clear the overflowing Lotus (Lotus extends ~140px below 280px circle, so we need space)
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    mainControlCircle: {
        width: 70, // Slightly larger target
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.1)', // Subtle background
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    controlIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    pauseBar: {
        width: 6,
        height: 22,
        backgroundColor: '#FFF',
        borderRadius: 3,
    },
    playTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 18,
        borderRightWidth: 0,
        borderBottomWidth: 11,
        borderTopWidth: 11,
        borderLeftColor: '#FFF',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginLeft: 5,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '200',
        letterSpacing: -2,
    },
    timerSubtext: {
        fontSize: 13,
        marginTop: 10,
        fontWeight: '300',
        opacity: 0.7,
    },
    // Removed old circle styles
    actions: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        paddingHorizontal: 30,
        gap: 15,
    },
    primaryButton: {
        height: 56,
        borderRadius: 28,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    secondaryButton: {
        height: 52,
        borderRadius: 26,
    },
    // Keep old styles for other screens
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    instruction: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    habitCue: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    actionButton: {
        marginBottom: 10,
    },
    stackSection: {
        width: '100%',
        marginBottom: 20,
    },
    stackTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DAA520', // Gold title
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    stackRow: {
        gap: 10,
        paddingHorizontal: 5,
    },
    stackOption: {
        backgroundColor: '#1A4331',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    stackOptionText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
});
