import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Leaf } from 'lucide-react-native';

interface TrendChartProps {
    currentPauses: number;
    history: { date: string; pauses: number }[];
}

export function TrendChart({ currentPauses, history }: TrendChartProps) {
    // We want to show Yesterday, Day Before, Day Before That (or similar) + Today
    // But user asked for "Past 3 days to show a trend"
    // Let's show: [Day -2] [Day -1] [Today]

    // Construct the 3 columns
    const today = { label: 'Today', pauses: currentPauses };

    // Fill from history. History has stored dates.
    // If history is empty, use 0.
    const dayMinus1 = history.length > 0 ? history[history.length - 1] : { pauses: 0 };
    const dayMinus2 = history.length > 1 ? history[history.length - 2] : { pauses: 0 };

    const data = [
        { label: '2 Days Ago', pauses: dayMinus2.pauses, projected: false },
        { label: 'Yesterday', pauses: dayMinus1.pauses, projected: false },
        { label: 'Today', pauses: today.pauses, projected: false },
        { label: 'Tomorrow', pauses: 3, projected: true },
    ];

    const renderLeafs = (count: number, isProjected: boolean) => {
        // Always 3 slots
        return (
            <View style={[styles.leafColumn, isProjected && { opacity: 0.5 }]}>
                {[3, 2, 1].map((slot) => {
                    const isFilled = count >= slot;
                    return (
                        <Leaf
                            key={slot}
                            size={20}
                            color={isFilled ? '#4CAF50' : Colors.border}
                            fill={isFilled ? '#4CAF50' : 'transparent'}
                            style={{ marginBottom: 4 }}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recent Flow</Text>
            <View style={styles.chart}>
                {data.map((day, index) => (
                    <View key={index} style={styles.dayCol}>
                        {renderLeafs(day.pauses, day.projected)}
                        <Text style={[styles.dayLabel, day.projected && { color: '#4CAF50', fontWeight: '600' }]}>{day.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.border,
        width: '100%',
    },
    header: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    dayCol: {
        alignItems: 'center',
    },
    leafColumn: {
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
