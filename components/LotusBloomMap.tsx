import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';

interface LotusBloomMapProps {
    bloomDays: number; // 0 to 21
    totalDays?: number;
    dayOfPractice?: number; // Current day 1-21; drives chakra unlock days 15-21
}

// Manual: "The first 14 days grow the petals; the final 7 days unlock the
// seven chakras in ascending order and color." Root → Crown, days 15 → 21.
const CHAKRAS: Array<{ name: string; short: string; color: string; day: number }> = [
    { name: 'Root', short: 'Root', color: '#E53935', day: 15 },
    { name: 'Sacral', short: 'Sacral', color: '#FB8C00', day: 16 },
    { name: 'Solar Plexus', short: 'Solar', color: '#F9A825', day: 17 },
    { name: 'Heart', short: 'Heart', color: '#43A047', day: 18 },
    { name: 'Throat', short: 'Throat', color: '#1E88E5', day: 19 },
    { name: 'Third Eye', short: 'Third Eye', color: '#3949AB', day: 20 },
    { name: 'Crown', short: 'Crown', color: '#7B1FA2', day: 21 },
];

export function LotusBloomMap({ bloomDays, totalDays = 21, dayOfPractice }: LotusBloomMapProps) {
    const progress = Math.min(Math.max(bloomDays / totalDays, 0), 1);
    const heightPercentage = `${progress * 100}%`;
    const currentDay = typeof dayOfPractice === 'number' ? dayOfPractice : 0;

    return (
        <View style={styles.container}>
            <View style={styles.lotusWrapper}>
                <Image
                    source={require('../assets/images/golden_lotus.png')}
                    style={[styles.lotusImage, styles.lotusBackground]}
                    resizeMode="contain"
                />

                <View style={[styles.maskContainer, { height: heightPercentage as any }]}>
                    <View style={styles.innerMask}>
                        <Image
                            source={require('../assets/images/golden_lotus.png')}
                            style={styles.lotusImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>

            <Text style={styles.label}>{bloomDays} / {totalDays} Bloom Petals</Text>

            {/* Chakra strip — unlocks days 15-21 in ascending order */}
            <View style={styles.chakraRow}>
                {CHAKRAS.map((c) => {
                    const unlocked = currentDay >= c.day;
                    return (
                        <View key={c.name} style={styles.chakraItem}>
                            <View
                                style={[
                                    styles.chakraDot,
                                    {
                                        backgroundColor: unlocked ? c.color : 'rgba(255,255,255,0.08)',
                                        borderColor: unlocked ? c.color : 'rgba(255,255,255,0.2)',
                                        shadowColor: unlocked ? c.color : 'transparent',
                                        shadowOpacity: unlocked ? 0.8 : 0,
                                        shadowRadius: unlocked ? 6 : 0,
                                        elevation: unlocked ? 4 : 0,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.chakraLabel,
                                    { color: unlocked ? c.color : 'rgba(255,255,255,0.35)' },
                                ]}
                            >
                                {c.short}
                            </Text>
                        </View>
                    );
                })}
            </View>
            {currentDay < 15 && (
                <Text style={styles.chakraHint}>
                    The seven chakras unlock in your final week.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    lotusWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    lotusImage: {
        width: 200,
        height: 200,
    },
    lotusBackground: {
        opacity: 0.2,
        tintColor: Colors.textSecondary,
    },
    maskContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    innerMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    label: {
        marginTop: 15,
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
    chakraRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 16,
        width: 260,
    },
    chakraItem: {
        alignItems: 'center',
        flex: 1,
    },
    chakraDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 0 },
    },
    chakraLabel: {
        marginTop: 4,
        fontSize: 8,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    chakraHint: {
        marginTop: 8,
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontStyle: 'italic',
    },
});
