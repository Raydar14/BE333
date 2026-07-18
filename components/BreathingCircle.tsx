import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Text } from 'react-native';

type BreathingCircleProps = {
    isActive: boolean;
    size?: number;
    showGuide?: boolean;
    showNature?: boolean; // New prop
    isMinuteMark?: boolean; // Trigger for the minute mark animation
};

export function BreathingCircle({ isActive, size = 400, showGuide = false, showNature = true, isMinuteMark = false }: BreathingCircleProps) {
    const lotusScale = useRef(new Animated.Value(1.0)).current;
    const glowOpacity = useRef(new Animated.Value(1)).current;

    // Y-offset specifically for the minute-mark float
    const lotusFloatY = useRef(new Animated.Value(0)).current;

    // Text Opacities
    const exhaleTextOpacity = useRef(new Animated.Value(0)).current;
    const inhaleTextOpacity = useRef(new Animated.Value(0)).current;

    // Effect to handle Minute Mark Float Animation
    useEffect(() => {
        if (isActive && isMinuteMark) {
            // Float UP and Down sequence
            Animated.sequence([
                Animated.timing(lotusFloatY, {
                    toValue: -80, // Float up 80px
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(lotusFloatY, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isMinuteMark, isActive]);

    useEffect(() => {
        if (!isActive) {
            lotusScale.setValue(1.0);
            glowOpacity.setValue(1);
            exhaleTextOpacity.setValue(0);
            inhaleTextOpacity.setValue(0);
            lotusFloatY.setValue(0);
            return;
        }

        const breathingCycle = () => {
            Animated.sequence([
                // EXHALE (6.5s)
                Animated.parallel([
                    Animated.timing(lotusScale, {
                        toValue: 0.4,
                        duration: 6500,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.5,
                        duration: 6500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    // Show Exhale Text
                    Animated.sequence([
                        Animated.timing(exhaleTextOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
                        Animated.delay(4500),
                        Animated.timing(exhaleTextOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
                    ]),
                ]),
                // Pause
                Animated.delay(500),

                // INHALE (4.0s)
                Animated.parallel([
                    Animated.timing(lotusScale, {
                        toValue: 1.0,
                        duration: 4000,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    // Show Inhale Text
                    Animated.sequence([
                        Animated.timing(inhaleTextOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                        Animated.delay(2500),
                        Animated.timing(inhaleTextOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
                    ]),
                ]),
                // Pause
                Animated.delay(500),
            ]).start(() => {
                if (isActive) breathingCycle();
            });
        };

        breathingCycle();

        return () => {
            lotusScale.stopAnimation();
            glowOpacity.stopAnimation();
            exhaleTextOpacity.stopAnimation();
            inhaleTextOpacity.stopAnimation();
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
            {/* Animated Container (Scales with Breath + Floats on minute mark) */}
            <Animated.View
                style={[
                    styles.lotusContainer,
                    {
                        width: size,
                        height: size,
                        opacity: glowOpacity,
                        transform: [
                            { scale: lotusScale },
                            { translateY: lotusFloatY } // Add vertical float transform
                        ],
                    }
                ]}
            >
                {/* Central Lotus (Always Visible) */}
                <Image
                    source={require('../assets/images/lotus_golden_detailed.png')}
                    style={[styles.lotusImage, { width: size, height: size }]}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Guide Text Overlay - Should it float too? Probably. */}
            {showGuide && (
                <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateY: lotusFloatY }] }]}>
                    <Animated.View style={[styles.textContainer, { opacity: exhaleTextOpacity }]}>
                        <Text style={styles.guideText}>Breath Out</Text>
                        <Text style={styles.guideSubText}>Shrink Your Belly</Text>
                    </Animated.View>

                    <Animated.View style={[styles.textContainer, { opacity: inhaleTextOpacity }]}>
                        <Text style={styles.guideText}>Breath In</Text>
                        <Text style={styles.guideSubText}>Expand Your Belly</Text>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusImage: {
        // dimensions set via props
    },
    textContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guideText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        marginBottom: 8,
    },
    guideSubText: {
        color: '#E0E0E0',
        fontSize: 18,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    }
});

