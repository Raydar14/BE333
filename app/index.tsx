import { View, Text, StyleSheet, Image, Vibration, Alert, TouchableOpacity, ScrollView, Platform, Share } from 'react-native';
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
    const { timerDuration, showNatureVisuals, showBreathingGuide, timerMode } = useSettings();
    const router = useRouter();

    useProtectedRoute();

    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [guideText, setGuideText] = useState('Get Ready');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const guideIntervalRef = useRef<any>(null); // Use 'any' or NodeJs.Timeout to avoid type issues

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
            setTimeLeft(timerMode === 'open' ? 0 : timerDuration);
        }
    }, [timerDuration, isActive, isCompleted, timerMode]);

    useEffect(() => {
        // Clear guide interval
        if (guideIntervalRef.current) {
            clearTimeout(guideIntervalRef.current);
            guideIntervalRef.current = null;
        }

        if (isActive) {
            // Breathing Cycle Loop: Exhale (6.5s) -> Hold (0.5s) -> Inhale (4s) -> Hold (0.5s)
            const runBreathingCycle = () => {
                setGuideText("Exhale & Soften");

                // 1. Exhale for 6.5s
                guideIntervalRef.current = setTimeout(() => {
                    setGuideText("...Pause...");

                    // 2. Hold for 0.5s
                    guideIntervalRef.current = setTimeout(() => {
                        setGuideText("Inhale & Expand");

                        // 3. Inhale for 4s
                        guideIntervalRef.current = setTimeout(() => {
                            setGuideText("...Hold...");

                            // 4. Hold for 0.5s
                            guideIntervalRef.current = setTimeout(() => {
                                // Loop
                                if (isActive) runBreathingCycle();
                            }, 500);

                        }, 4000);

                    }, 500);

                }, 6500);
            };

            runBreathingCycle();
        } else {
            setGuideText("Ready");
        }

        return () => {
            if (guideIntervalRef.current) clearTimeout(guideIntervalRef.current);
        };
    }, [isActive]);

    useEffect(() => {
        // Clear any existing interval first
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
                    // Countdown
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
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, timeLeft, timerMode]);

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

                const durationLogged = timerMode === 'open' ? timeLeft : timerDuration;

                // Build session data with optional biofeedback
                const sessionData: any = {
                    user_id: userId,
                    duration_seconds: durationLogged,
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

    const handleShareCompletion = async (platform: 'tiktok' | 'facebook' | 'instagram') => {
        const { socialLinks } = useSettings();
        const message = `I just completed a 3-minute breathing session on BE333! Pause. Breathe. Join me.`;

        try {
            if (platform === 'tiktok' && socialLinks?.tiktok) {
                // If linked, we might just open the app or share sheet.
                // For simplicity, we just use Share API with the message.
                await Share.share({ message });
                return;
            }

            // Fallback for all
            await Share.share({ message });

        } catch (e: any) {
            Alert.alert('Sharing Error', e.message);
        }
    };

    const toggleTimer = () => {
        if (isCompleted) {
            // Reset
            setIsCompleted(false);
            setTimeLeft(timerMode === 'open' ? 0 : timerDuration);
            setIsActive(false);
            setBiofeedbackSummary(null);
        } else {
            const newActive = !isActive;
            setIsActive(newActive);

            // Start/stop biofeedback tracking
            const shouldStartBio = newActive &&
                isBiofeedbackConnected &&
                ((timerMode === 'countdown' && timeLeft === timerDuration) || (timerMode === 'open' && timeLeft === 0));

            if (shouldStartBio) {
                // Starting fresh - begin tracking
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
                        {/* Tagline: Vertical Stack "Pause." then "Breathe." */}
                        <View style={styles.taglineContainer}>
                            <Text style={styles.taglineText}>Pause.</Text>
                            <Text style={styles.taglineText}>Breathe.</Text>
                        </View>

                        {/* Main Logo (Floral BE333 + Lotus) */}
                        <Image
                            source={require('../assets/images/brand_logo_floral.png')}
                            style={styles.logoMain}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Breathing Leaves (Background) */}
                    {showNatureVisuals && (
                        <View style={StyleSheet.absoluteFill} pointerEvents="none">
                            <BreathingLeaves isActive={isActive} />
                        </View>
                    )}


                    {/* Main Content */}
                    <View style={styles.content}>

                        {/* Social Share AFTER Completion */}
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
                            <View style={styles.timerContainer}>

                                {/* Lotus - Moved OUTSIDE the card (Behind it or Overlapping) */}
                                {/* We place it here so z-index handling allows card to be on top, or it to be behind */}
                                <View style={styles.lotusBackground}>
                                    <BreathingCircle
                                        isActive={isActive}
                                        showGuide={false} // We handle guide inside card now
                                        showNature={showNatureVisuals}
                                        isMinuteMark={isActive && timeLeft > 0 && timeLeft % 60 === 0}
                                    />
                                </View>

                                {/* Timer Card (Shorter Rectangle) */}
                                <View style={[styles.timerCard, {
                                    borderColor: isActive ? '#4A9977' : (isCompleted ? '#4CAF50' : colors.textSecondary),
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    shadowColor: isActive ? '#4A9977' : 'transparent',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: isActive ? 0.9 : 0,
                                    shadowRadius: isActive ? 30 : 0,
                                    elevation: isActive ? 25 : 0,
                                }]}>
                                    {/* Timer text at top */}
                                    <View style={styles.timerTextContainer}>
                                        <Text style={[styles.timerText, { color: colors.textLight }]}>
                                            {isCompleted ? "Done!" : formatTime(timeLeft)}
                                        </Text>

                                        {/* Promo Text (Only when not active) */}
                                        {!isCompleted && !isActive && (
                                            <View style={styles.promoTextContainer}>
                                                <Text style={styles.promoText}>
                                                    <Text style={styles.promoGold}>3</Text>MINS
                                                </Text>
                                                <Text style={styles.promoX}>×</Text>
                                                <Text style={styles.promoText}>
                                                    <Text style={styles.promoGold}>3</Text><Text style={[styles.promoX, { marginRight: 0 }]}>×</Text>s DAY
                                                </Text>
                                                <Text style={styles.promoX}>×</Text>
                                                <Text style={styles.promoText}>
                                                    <Text style={styles.promoGold}>3</Text> WKS
                                                </Text>
                                            </View>
                                        )}

                                        {isActive && showBreathingGuide && (
                                            <Text style={styles.guideText}>
                                                {guideText}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Plain Start/Pause Icon (No Circle Background) */}
                                    <View style={styles.innerControlContainer}>
                                        <TouchableOpacity
                                            onPress={toggleTimer}
                                            style={styles.plainControlButton} // New style
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.controlIconContainer}>
                                                {isActive ? (
                                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                                        <View style={styles.pauseBar} />
                                                        <View style={styles.pauseBar} />
                                                    </View>
                                                ) : (
                                                    timerMode === 'countdown' ? (
                                                        timeLeft < timerDuration ? (
                                                            <View style={styles.playTriangle} />
                                                        ) : (
                                                            <Text style={styles.plainStartText}>START</Text>
                                                        )
                                                    ) : (
                                                        // Open mode
                                                        timeLeft > 0 ? (
                                                            <View style={styles.playTriangle} />
                                                        ) : (
                                                            <Text style={styles.plainStartText}>START</Text>
                                                        )
                                                    )
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Inner Glow Overlay */}
                                    <View pointerEvents="none" style={styles.innerGlowCard} />
                                </View>

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

                                {!isCompleted && (
                                    <>
                                        {/* Reset Button (If started) */}
                                        {((timerMode === 'countdown' && timeLeft < timerDuration) || (timerMode === 'open' && timeLeft > 0)) && (
                                            <PremiumButton
                                                title="Reset"
                                                variant="outline"
                                                onPress={resetTimer}
                                                style={styles.secondaryButton}
                                                textStyle={{ color: colors.textSecondary }}
                                            />
                                        )}

                                        {/* Finish Button for Open Mode (If paused and started) */}
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
        marginBottom: 0, // Removed space
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
    logoMain: {
        width: 300,
        height: 220,
        marginBottom: 0, // Removed space
        resizeMode: 'contain',
    },
    taglineContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -30, // Negative to pull logo up close
        zIndex: 5,
    },
    taglineText: {
        color: '#FFD700', // Gold
        fontSize: 32, // Increased size
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        letterSpacing: 2,
        lineHeight: 38,
        // 3D Glow Effect
        textShadowColor: 'rgba(255, 215, 0, 0.6)', // Gold Glow
        textShadowOffset: { width: 2, height: 2 }, // 3D Offset
        textShadowRadius: 10, // Softness
        elevation: 8,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -20, // Negative to pull clearer to logo
    },
    timerCard: {
        width: 320,
        height: 200,
        borderRadius: 30,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        shadowColor: "#4A9977",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
        overflow: 'hidden',
        marginTop: 20, // Reduced from 50
        zIndex: 10,
    },
    innerGlowCard: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    lotusBackground: {
        position: 'absolute',
        top: 0, // Top of timer container
        alignSelf: 'center',
        zIndex: 0, // Behind (or effectively 'outside' visual flow of card contents)
        opacity: 0.9,
    },
    timerTextContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    guideText: {
        color: '#E8F5E9',
        fontSize: 18,
        fontWeight: '500',
        marginTop: 5,
        letterSpacing: 1,
    },
    // Plain button styles
    innerControlContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    plainControlButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plainStartText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    // Keep icons
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
        marginLeft: 4,
    },
    controlIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusInCircle: {
        position: 'absolute',
        // Center vertically but slightly up to leave room for button
        top: '15%',
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerTextTop: {
        position: 'absolute',
        top: 30,
        alignItems: 'center',
        zIndex: 10,
    },
    // Updated button styles for inside the card

    // controlIconContainer reused from above (removed duplicate logic)
    miniButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    // pauseBar and playTriangle reused from above, removing duplicates to fix lint error
    timerText: {
        fontSize: 48,
        fontWeight: '200',
        letterSpacing: -2,
    },
    promoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 15,
        zIndex: 200,
    },
    promoText: {
        fontSize: 18, // Larger numbers
        fontWeight: 'bold',
        color: '#E8F5E9',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    promoLabel: {
        fontSize: 12, // Smaller labels
        fontWeight: '600',
        color: '#CCCCCC', // Slightly dimmer to let Gold pop
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    promoX: {
        fontSize: 40, // Doubled from 20
        fontWeight: 'bold',
        color: '#FFD700',
        top: 2, // Adjusted for larger size alignment
        marginHorizontal: 3,
        textShadowColor: '#FFD700',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    promoGold: {
        fontSize: 36, // Doubled from 18 (base text)
        color: '#FFD700',
        textShadowColor: '#FFD700', // Self-color glow
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
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
    completionShareRow: {
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 100,
    },
    miniShareBtn: {
        backgroundColor: '#000',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 15,
        minWidth: 50,
        alignItems: 'center',
    }
});
