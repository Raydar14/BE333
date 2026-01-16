import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { SvgXml } from 'react-native-svg';

const lotusXml = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="petalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F0F0F0" />
    </linearGradient>
    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#66BB6A" />
      <stop offset="100%" stop-color="#2E7D32" />
    </linearGradient>
  </defs>
  
  <path fill="url(#leafGradient)" d="M10,80 Q30,90 50,85 Q70,90 90,80 Q80,100 50,95 Q20,100 10,80 Z" />
  <path fill="url(#leafGradient)" d="M20,70 Q10,60 15,50 Q30,65 40,75 Z" />
  <path fill="url(#leafGradient)" d="M80,70 Q90,60 85,50 Q70,65 60,75 Z" />

  <g fill="url(#petalGradient)" stroke="#E0E0E0" stroke-width="0.5">
    <path d="M30,75 Q20,50 35,35 Q50,55 50,75 Z" transform="rotate(-30, 50, 75)" />
    <path d="M70,75 Q80,50 65,35 Q50,55 50,75 Z" transform="rotate(30, 50, 75)" />
    <path d="M25,65 Q15,40 30,30 Q45,50 45,70 Z" transform="rotate(-50, 50, 75)" />
    <path d="M75,65 Q85,40 70,30 Q55,50 55,70 Z" transform="rotate(50, 50, 75)" />
  </g>

  <g fill="#FFFFFF" stroke="#D0D0D0" stroke-width="0.5">
    <path d="M50,80 Q35,50 50,20 Q65,50 50,80 Z" />
    <path d="M50,80 Q30,55 40,30 Q55,60 50,80 Z" transform="rotate(-15, 50, 80)" />
    <path d="M50,80 Q70,55 60,30 Q45,60 50,80 Z" transform="rotate(15, 50, 80)" />
  </g>
  
  <circle cx="50" cy="70" r="5" fill="#FFD700" />
</svg>
`;

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
                <View style={[styles.lotusImage, styles.lotusBackground]}>
                    <SvgXml xml={lotusXml} width="100%" height="100%" />
                </View>

                {/* Foreground (Active/Filled State) - Masked by height */}
                <View style={[styles.maskContainer, { height: heightPercentage as any }]}>
                    <View style={styles.innerMask}>
                        <View style={styles.lotusImage}>
                            <SvgXml xml={lotusXml} width="100%" height="100%" />
                        </View>
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
