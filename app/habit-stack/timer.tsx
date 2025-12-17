import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Vibration, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { PremiumButton } from '../../components/PremiumButton';
import { BreathingCircle } from '../../components/BreathingCircle';
import { useHabitStack, HabitActivity } from '../../hooks/useHabitStack';
import { useSettings } from '../../contexts/SettingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home } from 'lucide-react-native';

export default function HabitTimerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { logHabitSession } = useHabitStack();

    const activity = params.activity as HabitActivity;
    const mode = params.mode as 'timer' | 'count_up';
    // Param comes as string, parse it.
    const initialDuration = parseInt(params.durationSeconds as string) || 180;

    const [secondsLeft, setSecondsLeft] = useState(initialDuration);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [isActive, setIsActive] = useState(true); // Start immediately
    const [isCompleted, setIsCompleted] = useState(false);
    const [hasAutoSaved, setHasAutoSaved] = useState(false);

    const { showBreathingGuide, showNatureVisuals } = useSettings();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                if (mode === 'timer') {
                    setSecondsLeft((prev) => {
                        if (prev <= 1) {
                            handleComplete();
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    // Count up
                    setSecondsElapsed((prev) => prev + 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, mode]);

    const handleComplete = async () => {
        setIsActive(false);
        setIsCompleted(true);
        Vibration.vibrate();

        // Autosave
        if (!hasAutoSaved) {
            setHasAutoSaved(true);
            const finalDuration = mode === 'timer' ? initialDuration : secondsElapsed;
            await logHabitSession(activity, finalDuration);
        }
    };

    const handleFinishStopwatch = async () => {
        setIsActive(false);
        setIsCompleted(true);
        // Autosave for stopwatch
        if (!hasAutoSaved) {
            setHasAutoSaved(true);
            const finalDuration = secondsElapsed;
            await logHabitSession(activity, finalDuration);
        }
    };

    const returnHome = () => {
        router.dismissAll();
        router.push('/dashboard'); // Or direct to home if that's the flow
    };

    const formatTime = (totalSeconds: number) => {
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header with Back and Home Button */}
                <View style={[styles.header, { justifyContent: 'space-between' }]}>
                    <TouchableOpacity
                        onPress={() => router.replace({ pathname: '/', params: { restored: 'true' } })}
                        style={styles.homeButton}
                    >
                        <Text style={styles.homeText}>← Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={returnHome} style={styles.homeButton}>
                        <Home size={24} color={Colors.textSecondary} />
                        <Text style={styles.homeText}>Home</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.activityTitle}>{activity}</Text>
                    <Text style={styles.modeLabel}>{mode === 'timer' ? 'Timer' : 'Stopwatch'}</Text>

                    {/* Premium Circle Visuals (Matched to Home) */}
                    <View style={styles.timerContainer}>
                        <View style={[styles.timerCircle, {
                            borderColor: isActive ? '#4A9977' : (isCompleted ? '#DAA520' : Colors.textSecondary),
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            shadowColor: isActive ? '#4A9977' : (isCompleted ? '#DAA520' : 'transparent'),
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: isActive || isCompleted ? 0.9 : 0,
                            shadowRadius: isActive || isCompleted ? 30 : 0,
                            elevation: isActive || isCompleted ? 25 : 0,
                        }]}>
                            {/* Timer text at top */}
                            <View style={styles.timerTextTop}>
                                <Text style={styles.timerText}>
                                    {isCompleted ? "Saved!" : (mode === 'timer' ? formatTime(secondsLeft) : formatTime(secondsElapsed))}
                                </Text>
                            </View>

                            {/* Lotus centered - Only for Breath Work */}
                            {['Breath Work', 'Breathing', 'BE Again'].includes(activity) && (
                                <View style={styles.lotusInCircle}>
                                    <BreathingCircle isActive={isActive} showGuide={showBreathingGuide} showNature={showNatureVisuals} />
                                </View>
                            )}

                            {/* Inner Circle Glow Overlay */}
                            <View pointerEvents="none" style={styles.innerGlow} />
                        </View>
                    </View>

                    {/* Control Button - Moved Clearly Below Visuals */}
                    {!isCompleted && (
                        <View style={styles.controlsContainer}>
                            <TouchableOpacity
                                onPress={() => setIsActive(!isActive)}
                                style={styles.mainControlCircle}
                                activeOpacity={0.7}
                            >
                                <View style={{ flexDirection: 'row', gap: 6 }}>
                                    {isActive ? (
                                        <>
                                            <View style={styles.pauseBar} />
                                            <View style={styles.pauseBar} />
                                        </>
                                    ) : (
                                        <View style={styles.playTriangle} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}


                    {isCompleted ? (
                        <View style={styles.controls}>
                            <Text style={styles.completeText}>Great work! Auto-saved.</Text>
                            <PremiumButton
                                title="Return Home"
                                variant="primary"
                                onPress={returnHome}
                                style={{ width: 220 }}
                            />
                        </View>
                    ) : (
                        <View style={styles.controls}>
                            {mode === 'count_up' && isActive && (
                                <PremiumButton
                                    title="Finish & Save"
                                    variant="secondary"
                                    onPress={handleFinishStopwatch}
                                    style={{ width: 220, marginBottom: 15 }}
                                />
                            )}

                            {!isActive && (
                                <PremiumButton
                                    title="Cancel"
                                    variant="outline"
                                    onPress={returnHome}
                                    style={{ width: 140 }}
                                    textStyle={{ color: Colors.textSecondary }}
                                />
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
        maxWidth: 400, // constrained width
        width: '100%',
        alignSelf: 'center',
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        gap: 8,
    },
    homeText: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    content: {
        alignItems: 'center',
        marginTop: 20,
    },
    activityTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#DAA520', // Gold
        marginBottom: 5,
        textAlign: 'center',
    },
    modeLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    timerCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
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
        top: 60,
        alignItems: 'center',
        zIndex: 10,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '200',
        color: Colors.text,
        letterSpacing: -1,
    },
    controlsContainer: {
        marginTop: 60, // Clear the overflowing Lotus
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainControlCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.1)',
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
    controls: {
        alignItems: 'center',
        width: '100%',
    },
    completeText: {
        fontSize: 20,
        color: '#DAA520',
        marginBottom: 20,
        fontWeight: '600',
    },
});
