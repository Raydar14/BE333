import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';

type BreathingLeavesProps = {
    isActive: boolean;
};

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function BreathingLeaves({ isActive }: BreathingLeavesProps) {
    const leaves = Array(5).fill(0).map(() => ({
        y: useRef(new Animated.Value(0)).current,
        x: useRef(new Animated.Value(0)).current,
        rotation: useRef(new Animated.Value(0)).current,
        opacity: useRef(new Animated.Value(0)).current,
    }));

    useEffect(() => {
        if (!isActive) {
            leaves.forEach(leaf => {
                leaf.y.setValue(0);
                leaf.x.setValue(0);
                leaf.rotation.setValue(0);
                leaf.opacity.setValue(0);
            });
            return;
        }

        // More dramatic swirl patterns for wind-blown effect
        const swirlPaths = [
            { phase1: 45, phase2: -35, phase3: 20 },
            { phase1: -50, phase2: 40, phase3: -15 },
            { phase1: 35, phase2: -30, phase3: 25 },
            { phase1: -45, phase2: 50, phase3: -20 },
            { phase1: 40, phase2: -40, phase3: 15 },
        ];

        leaves.forEach((leaf, index) => {
            const swirl = swirlPaths[index];

            const breathingCycle = () => {
                Animated.sequence([
                    // Fade in (0.5s)
                    Animated.timing(leaf.opacity, {
                        toValue: 0.7,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    // EXHALE: Float UP with SWIRLING motion (6.5 seconds)
                    Animated.parallel([
                        Animated.timing(leaf.y, {
                            toValue: -750,
                            duration: 6500,
                            easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
                            useNativeDriver: true,
                        }),
                        // Complex swirling X motion (3 phases for circular effect)
                        Animated.sequence([
                            Animated.timing(leaf.x, {
                                toValue: swirl.phase1,
                                duration: 2000,
                                easing: Easing.bezier(0.33, 0, 0.67, 1),
                                useNativeDriver: true,
                            }),
                            Animated.timing(leaf.x, {
                                toValue: swirl.phase2,
                                duration: 2500,
                                easing: Easing.bezier(0.33, 0, 0.67, 1),
                                useNativeDriver: true,
                            }),
                            Animated.timing(leaf.x, {
                                toValue: swirl.phase3,
                                duration: 2000,
                                easing: Easing.bezier(0.33, 0, 0.67, 1),
                                useNativeDriver: true,
                            }),
                        ]),
                        // Spinning rotation
                        Animated.timing(leaf.rotation, {
                            toValue: (index % 2 === 0) ? 360 : -360,
                            duration: 6500,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }),
                    ]),
                    // INHALE: Float DOWN with reverse swirl (3.5 seconds)
                    Animated.parallel([
                        Animated.timing(leaf.y, {
                            toValue: 0,
                            duration: 3500,
                            easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
                            useNativeDriver: true,
                        }),
                        Animated.timing(leaf.x, {
                            toValue: 0,
                            duration: 3500,
                            easing: Easing.bezier(0.33, 0, 0.67, 1),
                            useNativeDriver: true,
                        }),
                        Animated.timing(leaf.rotation, {
                            toValue: 0,
                            duration: 3500,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }),
                    ]),
                    // Fade out (0.5s)
                    Animated.timing(leaf.opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    leaf.y.setValue(0);
                    leaf.x.setValue(0);
                    leaf.rotation.setValue(0);
                    breathingCycle();
                });
            };

            // Stagger each leaf by 1.2 seconds
            setTimeout(() => breathingCycle(), index * 1200);
        });

        return () => {
            leaves.forEach(leaf => {
                leaf.y.stopAnimation();
                leaf.x.stopAnimation();
                leaf.rotation.stopAnimation();
                leaf.opacity.stopAnimation();
            });
        };
    }, [isActive]);

    if (!isActive) return null;

    const startPositions = [20, 35, 50, 65, 80];
    const sizes = [1.0, 0.85, 1.1, 0.9, 1.05];

    return (
        <View style={styles.container} pointerEvents="none">
            {leaves.map((leaf, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.leafWrapper,
                        {
                            left: `${startPositions[index]}%`,
                            opacity: leaf.opacity,
                            transform: [
                                { translateY: leaf.y },
                                { translateX: leaf.x },
                                {
                                    rotate: leaf.rotation.interpolate({
                                        inputRange: [-360, 0, 360],
                                        outputRange: ['-360deg', '0deg', '360deg']
                                    })
                                },
                                { scale: sizes[index] },
                            ],
                        },
                    ]}
                >
                    <AnimatedSvg width="40" height="50" viewBox="0 0 40 50">
                        <Defs>
                            <LinearGradient id={`leafGrad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                {/* LIGHTER greens for contrast against dark background */}
                                <Stop offset="0%" stopColor="#4A9977" stopOpacity="1" />
                                <Stop offset="50%" stopColor="#3D8866" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#2C6E52" stopOpacity="0.95" />
                            </LinearGradient>
                        </Defs>
                        {/* Organic leaf shape with lighter gradient */}
                        <Path
                            d="M20,5 Q28,12 32,25 Q30,38 20,45 Q10,38 8,25 Q12,12 20,5 Z"
                            fill={`url(#leafGrad${index})`}
                            stroke="#2C6E52"
                            strokeWidth="0.5"
                        />
                        {/* Leaf vein */}
                        <Path
                            d="M20,8 L20,42"
                            stroke="#1A4331"
                            strokeWidth="1"
                            opacity="0.5"
                        />
                        {/* Side veins */}
                        <Path
                            d="M20,15 Q15,18 12,22 M20,25 Q15,27 11,30 M20,35 Q15,36 13,38"
                            stroke="#1A4331"
                            strokeWidth="0.5"
                            opacity="0.4"
                            fill="none"
                        />
                        <Path
                            d="M20,15 Q25,18 28,22 M20,25 Q25,27 29,30 M20,35 Q25,36 27,38"
                            stroke="#1A4331"
                            strokeWidth="0.5"
                            opacity="0.4"
                            fill="none"
                        />
                    </AnimatedSvg>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    leafWrapper: {
        position: 'absolute',
        bottom: 50,
    },
});
