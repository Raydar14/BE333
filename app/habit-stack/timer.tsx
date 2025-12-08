import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { useHabitStack, HabitActivity } from '../../hooks/useHabitStack';

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
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // For Stopwatch mode, we just track elapsed time
    // For Timer mode, we track secondsLeft

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

    const handleComplete = () => {
        setIsActive(false);
        setIsCompleted(true);
        Vibration.vibrate();
    };

    const handleFinishStopwatch = () => {
        setIsActive(false);
        setIsCompleted(true);
    };

    const saveAndExit = async () => {
        const finalDuration = mode === 'timer' ? initialDuration : secondsElapsed;
        await logHabitSession(activity, finalDuration);
        router.dismissAll();
        router.push('/dashboard');
    };

    const formatTime = (totalSeconds: number) => {
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.activityTitle}>{activity}</Text>
                    <Text style={styles.modeLabel}>{mode === 'timer' ? 'Timer' : 'Stopwatch'}</Text>

                    <View style={[styles.timerCircle, isCompleted && styles.timerCircleComplete]}>
                        <Text style={styles.timerText}>
                            {mode === 'timer'
                                ? formatTime(secondsLeft)
                                : formatTime(secondsElapsed)
                            }
                        </Text>
                    </View>

                    {isCompleted ? (
                        <View style={styles.controls}>
                            <Text style={styles.completeText}>Great work!</Text>
                            <Button
                                title="Save & Finish"
                                onPress={saveAndExit}
                                style={{ width: 200 }}
                            />
                        </View>
                    ) : (
                        <View style={styles.controls}>
                            <Button
                                title={isActive ? "Pause" : "Start"}
                                onPress={() => setIsActive(!isActive)}
                                variant={isActive ? "outline" : "primary"}
                                style={{ width: 200, marginBottom: 15 }}
                            />

                            {mode === 'count_up' && isActive && (
                                <Button
                                    title="Finish"
                                    variant="secondary"
                                    onPress={handleFinishStopwatch}
                                    style={{ width: 200 }}
                                />
                            )}

                            {!isActive && (
                                <Button
                                    title="Cancel"
                                    variant="outline"
                                    onPress={() => router.back()}
                                    style={{ borderColor: 'transparent' }}
                                    textStyle={{ color: Colors.textSecondary }}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    content: {
        alignItems: 'center',
    },
    activityTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    modeLabel: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 50,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    timerCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 4,
        borderColor: Colors.textSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    timerCircleComplete: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(74, 153, 119, 0.1)',
    },
    timerText: {
        fontSize: 72,
        fontWeight: '200',
        color: Colors.text,
        fontVariant: ['tabular-nums'],
    },
    controls: {
        alignItems: 'center',
        width: '100%',
    },
    completeText: {
        fontSize: 24,
        color: Colors.primary,
        marginBottom: 20,
        fontWeight: 'bold',
    },
});
