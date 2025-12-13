/**
 * BiofeedbackSummary - Post-session comparison card
 * 
 * Shows before/after comparison of biometrics with improvement highlights
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Activity, TrendingDown, TrendingUp, Sparkles } from 'lucide-react-native';
import { SessionSummary } from '../services/BiofeedbackService';
import { useTheme } from '../contexts/ThemeContext';

interface BiofeedbackSummaryProps {
    summary: SessionSummary;
    durationSeconds: number;
}

export function BiofeedbackSummary({ summary, durationSeconds }: BiofeedbackSummaryProps) {
    const { colors } = useTheme();

    const hrImproved = summary.hrChange < 0;
    const hrvImproved = summary.hrvChange !== null && summary.hrvChange > 0;

    const formatMinutes = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return mins === 1 ? '1 Minute' : `${mins} Minutes`;
    };

    const getImprovementMessage = () => {
        const messages = [];

        if (hrImproved && Math.abs(summary.hrChange) >= 5) {
            messages.push(`Heart rate dropped ${Math.abs(Math.round(summary.hrChange))} BPM`);
        }

        if (hrvImproved && summary.hrvChange! >= 10) {
            messages.push(`HRV improved ${Math.round(summary.hrvChange!)} ms`);
        }

        if (messages.length === 0) {
            if (hrImproved || hrvImproved) {
                return "Your body is responding to the practice!";
            }
            return "Keep practicing - benefits build over time!";
        }

        return messages.join(' • ');
    };

    return (
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            {/* Header */}
            <View style={styles.header}>
                <Sparkles size={20} color="#FFD700" />
                <Text style={[styles.title, { color: colors.text }]}>
                    Your {formatMinutes(durationSeconds)} Impact
                </Text>
            </View>

            {/* Comparison Grid */}
            <View style={styles.grid}>
                {/* Header Row */}
                <View style={styles.row}>
                    <View style={styles.labelCell} />
                    <View style={styles.valueCell}>
                        <Text style={[styles.columnHeader, { color: colors.textSecondary }]}>
                            Start
                        </Text>
                    </View>
                    <View style={styles.valueCell}>
                        <Text style={[styles.columnHeader, { color: colors.textSecondary }]}>
                            End
                        </Text>
                    </View>
                    <View style={styles.changeCell}>
                        <Text style={[styles.columnHeader, { color: colors.textSecondary }]}>
                            Change
                        </Text>
                    </View>
                </View>

                {/* Heart Rate Row */}
                <View style={styles.row}>
                    <View style={styles.labelCell}>
                        <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />
                        <Text style={[styles.label, { color: colors.text }]}>HR</Text>
                    </View>
                    <View style={styles.valueCell}>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {summary.startReading.hr}
                        </Text>
                    </View>
                    <View style={styles.valueCell}>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {summary.endReading.hr}
                        </Text>
                    </View>
                    <View style={styles.changeCell}>
                        <View style={styles.changeContent}>
                            {hrImproved ? (
                                <TrendingDown size={14} color="#4CAF50" />
                            ) : (
                                <TrendingUp size={14} color={colors.textSecondary} />
                            )}
                            <Text style={[
                                styles.changeValue,
                                { color: hrImproved ? '#4CAF50' : colors.textSecondary }
                            ]}>
                                {summary.hrChange > 0 ? '+' : ''}{summary.hrChange} BPM
                            </Text>
                        </View>
                    </View>
                </View>

                {/* HRV Row */}
                {summary.startReading.hrv && summary.endReading.hrv && (
                    <View style={styles.row}>
                        <View style={styles.labelCell}>
                            <Activity size={16} color="#4ECDC4" />
                            <Text style={[styles.label, { color: colors.text }]}>HRV</Text>
                        </View>
                        <View style={styles.valueCell}>
                            <Text style={[styles.value, { color: colors.text }]}>
                                {Math.round(summary.startReading.hrv)}
                            </Text>
                        </View>
                        <View style={styles.valueCell}>
                            <Text style={[styles.value, { color: colors.text }]}>
                                {Math.round(summary.endReading.hrv)}
                            </Text>
                        </View>
                        <View style={styles.changeCell}>
                            <View style={styles.changeContent}>
                                {hrvImproved ? (
                                    <TrendingUp size={14} color="#4CAF50" />
                                ) : (
                                    <TrendingDown size={14} color={colors.textSecondary} />
                                )}
                                <Text style={[
                                    styles.changeValue,
                                    { color: hrvImproved ? '#4CAF50' : colors.textSecondary }
                                ]}>
                                    {summary.hrvChange! > 0 ? '+' : ''}{Math.round(summary.hrvChange!)} ms
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Encouragement Message */}
            <View style={[styles.messageBox, { backgroundColor: 'rgba(74, 153, 119, 0.2)' }]}>
                <Text style={[styles.message, { color: colors.text }]}>
                    {getImprovementMessage()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginVertical: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    grid: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelCell: {
        width: 60,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
    },
    valueCell: {
        flex: 1,
        alignItems: 'center',
    },
    columnHeader: {
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
    },
    changeCell: {
        width: 90,
        alignItems: 'flex-end',
    },
    changeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    changeValue: {
        fontSize: 12,
        fontWeight: '600',
    },
    messageBox: {
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
    },
    message: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    },
});
