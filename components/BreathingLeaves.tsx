import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

type BreathingLeavesProps = {
    isActive: boolean;
    phase: 'deep3' | 'inhale' | 'pause' | 'exhale' | 'idle';
};

// 21 items total: 14 leaves, 7 flowers
const ITEM_COUNT = 21;

// SVG Icons to replace PNGs and fix background artifacts
const LeafIcon = () => (
    <Svg width="35" height="35" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L12.5 2.5C12.5 2.5 17 8 17 12C17 16 14 20 12 22C10 20 7 16 7 12C7 8 11.5 2.5 11.5 2.5L12 2Z" fill="#8FBC8F" opacity="0.8" />
        <Path d="M12 22V8" stroke="#556B2F" strokeWidth="0.5" strokeLinecap="round" />
        <Path d="M12 16L9 14" stroke="#556B2F" strokeWidth="0.5" strokeLinecap="round" />
        <Path d="M12 14L15 12" stroke="#556B2F" strokeWidth="0.5" strokeLinecap="round" />
        <Path d="M12 12L9 10" stroke="#556B2F" strokeWidth="0.5" strokeLinecap="round" />
    </Svg>
);

const FlowerIcon = () => (
    <Svg width="45" height="45" viewBox="0 0 100 100" fill="none">
        {/* Back Petals - Soft Golds/Whites */}
        <Path d="M20,60 Q10,40 30,30 Q50,60 50,80 Q30,80 20,60" fill="#FFF8E0" stroke="#E1B725" strokeWidth="1" />
        <Path d="M80,60 Q90,40 70,30 Q50,60 50,80 Q70,80 80,60" fill="#FFF8E0" stroke="#E1B725" strokeWidth="1" />

        {/* Middle Petals - White with Gold Tips */}
        <Path d="M30,55 Q25,35 40,25 Q50,55 50,85" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />
        <Path d="M70,55 Q75,35 60,25 Q50,55 50,85" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />

        {/* Center Petal - Pure White with detailed tip */}
        <Path d="M50,90 Q35,60 50,10 Q65,60 50,90" fill="#FFFFFF" stroke="#E1B725" strokeWidth="1.5" />
    </Svg>
);

export function BreathingLeaves({ isActive, phase }: BreathingLeavesProps) {
    // Generate items once with fully randomized properties to avoid "lines"
    const items = useRef(Array(ITEM_COUNT).fill(0).map((_, i) => ({
        // Animation Values
        y: new Animated.Value(0),
        x: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.4 + Math.random() * 0.4), // Random size
        rotateZ: new Animated.Value(Math.random()), // Random start rotation
        rotateX: new Animated.Value(0),

        // Position & Identity
        isFlower: i % 3 === 0,
        initialLeft: Math.random() * 90 + 5, // Random 5% to 95%
        initialBottom: Math.random() * 100, // Random vertical staggered start

        // Physics randomization
        swaySpeed: 2500 + Math.random() * 2000,
        swayAmp: 15 + Math.random() * 30,
        driftDelay: Math.random() * 4000, // Large random delay to break synchronization
        driftDuration: 5000 + Math.random() * 3000, // Random travel times
    }))).current;

    // Effect 1: Handle Drifting Loops (Sway, Spin) - Runs ONCE on Active
    useEffect(() => {
        if (isActive) {
            // Start Drifting
            items.forEach(item => {
                // Horizontal Sway
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(item.x, {
                            toValue: item.swayAmp,
                            duration: item.swaySpeed,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true // Native driver supported on web for these? Yes usually.
                        }),
                        Animated.timing(item.x, {
                            toValue: -item.swayAmp,
                            duration: item.swaySpeed,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true
                        })
                    ])
                ).start();

                // Rotation
                Animated.loop(
                    Animated.timing(item.rotateZ, {
                        toValue: 1,
                        duration: item.swaySpeed * 4,
                        easing: Easing.linear,
                        useNativeDriver: true
                    })
                ).start();

                // Tumble
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(item.rotateX, {
                            toValue: 1,
                            duration: item.swaySpeed * 2,
                            easing: Easing.inOut(Easing.quad),
                            useNativeDriver: true
                        }),
                        Animated.timing(item.rotateX, {
                            toValue: 0,
                            duration: item.swaySpeed * 2,
                            easing: Easing.inOut(Easing.quad),
                            useNativeDriver: true
                        })
                    ])
                ).start();
            });
        }

        return () => {
            // Cleanup on Unmount or Inactive
            if (!isActive) {
                items.forEach(item => {
                    item.x.stopAnimation();
                    item.y.stopAnimation();
                    item.rotateZ.stopAnimation();
                    item.rotateX.stopAnimation();
                    item.scale.stopAnimation();
                    item.opacity.stopAnimation();

                    // Reset values to cleaner state
                    item.x.setValue(0);
                    item.y.setValue(0);
                    item.opacity.setValue(0);
                });
            }
        };
    }, [isActive]);

    // Effect 2: Handle Phase Transitions (Float Up / Down) - Runs on Phase Change
    useEffect(() => {
        if (!isActive) return;

        const floatUp = () => {
            items.forEach((item) => {
                // Animate Y position - One shot, not looped
                Animated.parallel([
                    Animated.timing(item.y, {
                        toValue: -height * 0.9 - (Math.random() * 100), // Go well off screen
                        duration: item.driftDuration,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                        delay: Math.random() * 500 // Small random start jitter
                    }),
                    Animated.timing(item.opacity, {
                        toValue: 0.9,
                        duration: 800,
                        useNativeDriver: true
                    })
                ]).start();
            });
        };

        const floatDown = () => {
            items.forEach((item) => {
                Animated.parallel([
                    Animated.timing(item.y, {
                        toValue: 0, // Back to bottom/start
                        duration: item.driftDuration * 0.8, // Slightly faster down?
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(item.opacity, {
                        toValue: 0.5,
                        duration: 800,
                        useNativeDriver: true
                    })
                ]).start();
            });
        };

        if (phase === 'exhale') {
            floatUp();
        } else if (phase === 'inhale') {
            floatDown();
        } else if (phase === 'deep3') {
            items.forEach(item => {
                Animated.timing(item.opacity, { toValue: 0.6, duration: 1000, useNativeDriver: true }).start();
            });
        }
    }, [isActive, phase]);

    if (!isActive) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {items.map((item, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.item,
                        {
                            left: `${item.initialLeft}%`, // Use random start pos
                            bottom: item.initialBottom, // Use random start height offset
                            opacity: item.opacity,
                            transform: [
                                { translateY: item.y },
                                { translateX: item.x },
                                {
                                    rotateZ: item.rotateZ.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg']
                                    })
                                },
                                {
                                    rotateX: item.rotateX.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '180deg']
                                    })
                                },
                                { scale: item.scale }
                            ]
                        }
                    ]}
                >
                    {item.isFlower ? <FlowerIcon /> : <LeafIcon />}
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 5,
    },
    item: {
        position: 'absolute',
    }
});
