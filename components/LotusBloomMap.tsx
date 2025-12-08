import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Svg, Circle, Path, G } from 'react-native-svg';

interface LotusBloomMapProps {
    bloomDays: number; // 0 to 21
    totalDays?: number;
}

export function LotusBloomMap({ bloomDays, totalDays = 21 }: LotusBloomMapProps) {
    // Generate an array of days [1, ... 21]
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Simple Grid or Circle visualization
    // For MVP transparency, we'll use a flex wrap grid of "Petals"
    // Ideally this would be a beautiful SVG illustration filling up.

    return (
        <View style={styles.container}>
            <View style={styles.lotusContainer}>
                {/* Placeholder for the main Lotus Image - Dynamic based on progress? */}
                {/* For now, just a grid of petals below */}
            </View>

            <View style={styles.grid}>
                {days.map((day) => {
                    const isBloomed = day <= bloomDays;
                    return (
                        <View key={day} style={[styles.petalSlot, isBloomed && styles.petalFilled]}>
                            {/* <Text style={[styles.dayNum, isBloomed && styles.dayNumFilled]}>{day}</Text> */}
                        </View>
                    );
                })}
            </View>
            <Text style={styles.label}>{bloomDays} / {totalDays} Bloom Petals</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    lotusContainer: {
        // height: 100,
        // justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        maxWidth: 300,
    },
    petalSlot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        // Teardrop shape simulation via border radius
        borderTopLeftRadius: 0,
        transform: [{ rotate: '-45deg' }]
    },
    petalFilled: {
        backgroundColor: Colors.secondary, // Gold petal
        borderColor: Colors.secondary,
        shadowColor: Colors.secondary,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    dayNum: {
        fontSize: 10,
        color: Colors.textSecondary,
        transform: [{ rotate: '45deg' }] // Counter rotate text
    },
    dayNumFilled: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    label: {
        marginTop: 15,
        color: Colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    }
});
