/**
 * BiofeedbackIndicator - Real-time biometrics display for timer screen
 * 
 * Shows current HR and HRV with delta indicators from baseline
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Heart, Activity } from 'lucide-react-native';
import { useBiofeedback } from '../contexts/BiofeedbackContext';
import { useTheme } from '../contexts/ThemeContext';

interface BiofeedbackIndicatorProps {
    compact?: boolean;
}

export function BiofeedbackIndicator({ compact = false }: BiofeedbackIndicatorProps) {
    const { colors } = useTheme();
    const { currentReading, baselineReading, isConnected } = useBiofeedback();

    // Pulse animation synced roughly to heart rate
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!currentReading) return;

        // Calculate pulse duration from heart rate (ms per beat)
        const msPerBeat = 60000 / currentReading.hr;

        const pulse = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: msPerBeat * 0.2,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: msPerBeat * 0.8,
                    useNativeDriver: true,
                }),
            ]).start(() => pulse());
        };

        pulse();

        return () => {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
        };
    }, [currentReading?.hr]);

    if (!isConnected || !currentReading) {
        return null;
    }

    // Calculate deltas from baseline
    const hrDelta = baselineReading
        ? currentReading.hr - baselineReading.hr
        : 0;

    const hrvDelta = (baselineReading?.hrv && currentReading.hrv)
        ? currentReading.hrv - baselineReading.hrv
        : 0;

    // Positive change = improvement
    const hrImproving = hrDelta < 0; // Lower HR is better
    const hrvImproving = hrvDelta > 0; // Higher HRV is better

    const getDeltaColor = (improving: boolean) =>
        improving ? '#4CAF50' : colors.textSecondary;

    const formatDelta = (value: number, invert = false) => {
        const sign = invert
            ? (value <= 0 ? '↓' : '↑')
            : (value >= 0 ? '+' : '');
        return `${sign}${Math.abs(Math.round(value))}`;
    };

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                <Animated.View style={[styles.compactItem, { transform: [{ scale: pulseAnim }] }]}>
                    <Heart size={14} color="#FF6B6B" fill="#FF6B6B" />
                    <Text style={[styles.compactValue, { color: colors.text }]}>
                        {currentReading.hr}
                    </Text>
                </Animated.View>

                {currentReading.hrv && (
                    <View style={styles.compactItem}>
                        <Activity size={14} color="#4ECDC4" />
                        <Text style={[styles.compactValue, { color: colors.text }]}>
                            {Math.round(currentReading.hrv)}
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
            {/* Heart Rate */}
            <View style={styles.metric}>
                <View style={styles.metricHeader}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <Heart size={18} color="#FF6B6B" fill="#FF6B6B" />
                    </Animated.View>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                        {currentReading.hr}
                    </Text>
                    <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>
                        BPM
                    </Text>
                </View>

                {baselineReading && (
                    <Text style={[styles.delta, { color: getDeltaColor(hrImproving) }]}>
                        {formatDelta(hrDelta, true)} from start
                    </Text>
                )}
            </View>

            <View style={styles.divider} />

            {/* HRV */}
            <View style={styles.metric}>
                <View style={styles.metricHeader}>
                    <Activity size={18} color="#4ECDC4" />
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                        {currentReading.hrv ? Math.round(currentReading.hrv) : '--'}
                    </Text>
                    <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>
                        ms
                    </Text>
                </View>

                {baselineReading?.hrv && currentReading.hrv && (
                    <Text style={[styles.delta, { color: getDeltaColor(hrvImproving) }]}>
                        {formatDelta(hrvDelta)} HRV
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 15,
    },
    metric: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '600',
    },
    metricUnit: {
        fontSize: 12,
        marginLeft: 2,
    },
    delta: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    // Compact mode
    compactContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    compactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    compactValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});
