import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';

type BreathingLeavesProps = {
    isActive: boolean;
};

export function BreathingLeaves({ isActive }: BreathingLeavesProps) {
    const leaves = Array(5).fill(0).map(() => ({
        y: useRef(new Animated.Value(0)).current,
        x: useRef(new Animated.Value(0)).current,
        rotation: useRef(new Animated.Value(0)).current,
        opacity: useRef(new Animated.Value(0)).current,
        scale: useRef(new Animated.Value(0.8)).current,
    }));

    // Track timeouts to clear them on unmount/inactive
    const timeouts = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        if (!isActive) {
            // Reset everything
            leaves.forEach(leaf => {
                leaf.y.setValue(0);
                leaf.x.setValue(0);
                leaf.rotation.setValue(0);
                leaf.opacity.setValue(0);
                leaf.scale.setValue(0.8);
            });
            // Clear any pending timeouts
            timeouts.current.forEach(t => clearTimeout(t));
            timeouts.current = [];
            return;
        }

        // More dramatic swirl patterns 
        const swirlPaths = [
            { phase1: 65, phase2: -45, phase3: 30 },
            { phase1: -70, phase2: 50, phase3: -25 },
            { phase1: 55, phase2: -40, phase3: 35 },
            { phase1: -65, phase2: 60, phase3: -30 },
            { phase1: 50, phase2: -50, phase3: 25 },
        ];

        leaves.forEach((leaf, index) => {
            const swirl = swirlPaths[index];
            const BREATH_CYCLE_MS = 11500; // ~11.5s per breath
            const EVERY_3RD_BREATH_DELAY = BREATH_CYCLE_MS * 2;

            const breathingCycle = () => {
                Animated.sequence([
                    // Fade in (0.5s)
                    Animated.timing(leaf.opacity, {
                        toValue: 0.9,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    // EXHALE: Float UP with SWIRLING motion and SHRINK (6.5 seconds)
                    Animated.parallel([
                        Animated.timing(leaf.y, {
                            toValue: -750,
                            duration: 6500,
                            easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
                            useNativeDriver: true,
                        }),
                        Animated.sequence([
                            Animated.timing(leaf.x, {
                                toValue: swirl.phase1,
                                duration: 2000,
                                easing: Easing.linear,
                                useNativeDriver: true,
                            }),
                            Animated.timing(leaf.x, {
                                toValue: swirl.phase2,
                                duration: 2500,
                                easing: Easing.linear,
                                useNativeDriver: true,
                            }),
                            Animated.timing(leaf.x, {
                                toValue: swirl.phase3,
                                duration: 2000,
                                easing: Easing.linear,
                                useNativeDriver: true,
                            }),
                        ]),
                        // Gentle rocking rotation
                        Animated.timing(leaf.rotation, {
                            toValue: (index % 2 === 0) ? 15 : -15,
                            duration: 6500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(leaf.scale, {
                            toValue: 0.5,
                            duration: 6500,
                            easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
                            useNativeDriver: true,
                        }),
                    ]),
                    // INHALE: Float DOWN with reverse swirl and GROW (4.0 seconds)
                    Animated.parallel([
                        Animated.timing(leaf.y, {
                            toValue: 0,
                            duration: 4000,
                            easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
                            useNativeDriver: true,
                        }),
                        Animated.timing(leaf.x, {
                            toValue: 0,
                            duration: 4000,
                            easing: Easing.bezier(0.33, 0, 0.67, 1),
                            useNativeDriver: true,
                        }),
                        Animated.timing(leaf.rotation, {
                            toValue: 0,
                            duration: 4000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(leaf.scale, {
                            toValue: 0.8,
                            duration: 4000,
                            easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
                            useNativeDriver: true,
                        }),
                    ]),
                    // Fade out (0.5s)
                    Animated.timing(leaf.opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    // WAIT for 2 full breath cycles before reappearing
                    Animated.delay(EVERY_3RD_BREATH_DELAY)
                ]).start((finished) => {
                    if (finished.finished) {
                        leaf.y.setValue(0);
                        leaf.x.setValue(0);
                        leaf.rotation.setValue(0);
                        leaf.scale.setValue(0.8);
                        breathingCycle();
                    }
                });
            };

            // Start delay only on first run to stagger
            const timer = setTimeout(() => breathingCycle(), index * 800);
            timeouts.current.push(timer);
        });

        return () => {
            // Stop all animations
            leaves.forEach(leaf => {
                leaf.y.stopAnimation();
                leaf.x.stopAnimation();
                leaf.rotation.stopAnimation();
                leaf.opacity.stopAnimation();
                leaf.scale.stopAnimation();
            });
            // Clear timeouts
            timeouts.current.forEach(t => clearTimeout(t));
            timeouts.current = [];
        };
    }, [isActive]);

    if (!isActive) return null;

    const startPositions = [15, 30, 50, 70, 85];
    const imageSizes = [60, 50, 70, 55, 65];
    const images = [
        require('../assets/images/flower_floating_1.png'),
        require('../assets/images/flower_floating_2.png'),
        require('../assets/images/flower_floating_1.png'),
        require('../assets/images/flower_floating_2.png'),
        require('../assets/images/flower_floating_1.png'),
    ];

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
                                { scale: leaf.scale },
                            ],
                        },
                    ]}
                >
                    <Image
                        source={images[index]}
                        style={{
                            width: imageSizes[index],
                            height: imageSizes[index],
                            opacity: 0.9,
                            // Removed tintColor to ensure visibility if images are already colored/gold.
                        }}
                        resizeMode="contain"
                    />
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
        bottom: 80,
    },
});
