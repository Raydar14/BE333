import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Svg, Circle, Path, G } from 'react-native-svg';

interface LotusBloomMapProps {
    bloomDays: number; // 0 to 21
    totalDays?: number;
}

export function LotusBloomMap({ bloomDays, totalDays = 21 }: LotusBloomMapProps) {
    // Calculate fill percentage based on bloomDays (0 to 21)
    // We want it to fill up.
    // Ensure we don't exceed 100% or go below 0%
    const progress = Math.min(Math.max(bloomDays / totalDays, 0), 1);
    const heightPercentage = `${progress * 100}%`;

    return (
        <View style={styles.container}>
            <View style={styles.lotusWrapper}>
                {/* Background (Inactive/Empty State) - Dimmed/Grayscale */}
                <Image
                    source={require('../assets/images/golden_lotus.png')}
                    style={[styles.lotusImage, styles.lotusBackground]}
                    resizeMode="contain"
                />

                {/* Foreground (Active/Filled State) - Masked by height */}
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

            <Text style={styles.label}>{bloomDays} / {totalDays} Pause Petals</Text>
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
        height: 200, // Fixed height for calculation
        justifyContent: 'flex-end', // Align mask from bottom? No, masked view needs absolute positioning usually
        position: 'relative',
    },
    lotusImage: {
        width: 200,
        height: 200,
    },
    lotusBackground: {
        opacity: 0.2, // Dimmed for empty state
        tintColor: Colors.textSecondary, // Optional: make it grayscale-ish if tintColor supported (works on some non-svg images, mostly icons) or just low opacity
        // If tintColor doesn't look good on the png, just use opacity: 0.15
    },
    maskContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden', // This cuts off the top of the image
        // height is set dynamically inline
    },
    innerMask: {
        position: 'absolute',
        bottom: 0, // Align image to bottom of mask container so it simply gets revealed
        left: 0,
    },
    label: {
        marginTop: 15,
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    }
});
