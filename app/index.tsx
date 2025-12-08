import { View, Text, StyleSheet, Image, Vibration, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Button } from '../components/Button';
import { GuestBanner } from '../components/GuestBanner';
import { BreathingLeaves } from '../components/BreathingLeaves';
import { BreathingCircle } from '../components/BreathingCircle';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';



export default function Home() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();
    const { timerDuration } = useSettings();
    const router = useRouter();

    useProtectedRoute();

    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    async function handleComplete() {
        setIsActive(false);
        setIsCompleted(true);
        Vibration.vibrate();

        // Log Session if User
        if (user) {
            try {
                const userId = user.uid;

                await addDoc(collection(db, 'sessions'), {
                    user_id: userId,
                    duration_seconds: timerDuration,
                    completed_at: new Date()
                });
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
        } else {
            setIsActive(!isActive);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(timerDuration);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {!user && <GuestBanner />}

            {/* Breathing leaves animation */}
            <BreathingLeaves isActive={isActive} />

            <View style={styles.content}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={[styles.tagline, { color: colors.textLight }]}>Pause. Breathe. Be333</Text>

                <View style={styles.timerContainer}>
                    {/* Breathing circle animation */}
                    <BreathingCircle isActive={isActive} />

                    <View style={[styles.timerCircle, {
                        borderColor: isActive ? '#4A9977' : (isCompleted ? '#4CAF50' : colors.textSecondary),
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        // Bright plant green glow when active (matching mockup)
                        shadowColor: isActive ? '#4A9977' : 'transparent',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: isActive ? 0.9 : 0,
                        shadowRadius: isActive ? 30 : 0,
                        elevation: isActive ? 25 : 0,
                    }]}>
                        <Text style={[styles.timerText, { color: colors.textLight }]}>
                            {isCompleted ? "Done!" : formatTime(timeLeft)}
                        </Text>
                        {!isCompleted && !isActive && (
                            <Text style={[styles.timerSubtext, { color: colors.textSecondary }]}>
                                3 minutes • 3 times a day
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.actions}>
                    <Button
                        title={isCompleted ? "Start New Session" : (isActive ? "Pause" : (timeLeft < timerDuration ? "Resume" : "Start Timer"))}
                        onPress={toggleTimer}
                        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    />

                    {!isCompleted && timeLeft < timerDuration && (
                        <Button
                            title="Reset"
                            variant="outline"
                            onPress={resetTimer}
                            style={[styles.secondaryButton, { borderColor: colors.textSecondary }]}
                            textStyle={{ color: colors.textSecondary }}
                        />
                    )}

                    <Button
                        title="Dashboard"
                        variant="secondary"
                        onPress={() => router.push('/dashboard')}
                        style={[styles.secondaryButton, { backgroundColor: colors.secondary }]}
                        textStyle={{ color: colors.primary }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    headerControls: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    settingsButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        minWidth: 0,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    logo: {
        width: 140,
        height: 90,
        marginBottom: 15,
    },
    tagline: {
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 50,
        letterSpacing: 1,
        opacity: 0.9,
    },
    timerContainer: {
        marginBottom: 50,
    },
    timerCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 72,
        fontWeight: '200',
        letterSpacing: -2,
    },
    timerSubtext: {
        fontSize: 14,
        marginTop: 10,
        fontWeight: '300',
        opacity: 0.7,
    },
    actions: {
        width: '100%',
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
});
