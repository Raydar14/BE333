import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

type BreathingCircleProps = {
    isActive: boolean;
};

export function BreathingCircle({ isActive }: BreathingCircleProps) {
    const scale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isActive) {
            scale.setValue(1);
            glowOpacity.setValue(0);
            return;
        }

        const breathingCycle = () => {
            Animated.sequence([
                // EXHALE: Circle SHRINKS dramatically (6.5 seconds) - Breathe OUT, leaves rise
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 0.75, // 25% SMALLER - dramatic contraction
                        duration: 6500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.9, // STRONG glow
                        duration: 6500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                // Pause (0.5 seconds)
                Animated.delay(500),
                // INHALE: Circle EXPANDS dramatically (3.5 seconds) - Breathe IN, leaves fall
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.30, // 30% BIGGER - dramatic expansion
                        duration: 3500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.5, // Softer glow during inhale
                        duration: 3500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                // Pause (0.5 seconds)
                Animated.delay(500),
            ]).start(() => breathingCycle());
        };

        breathingCycle();

        return () => {
            scale.stopAnimation();
            glowOpacity.stopAnimation();
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Outer glowing circle - slightly bigger, moves with breathing */}
            <Animated.View
                style={[
                    styles.outerCircle,
                    {
                        opacity: glowOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.6],
                        }),
                        transform: [{
                            scale: scale.interpolate({
                                inputRange: [0.75, 1.30],
                                outputRange: [0.78, 1.35], // Slightly bigger than main circle
                            })
                        }],
                        shadowColor: '#4A9977',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 40,
                        elevation: 15,
                    },
                ]}
            />

            {/* Main breathing circle */}
            <Animated.View
                style={[
                    styles.breathingCircle,
                    {
                        opacity: glowOpacity,
                        transform: [{ scale }],
                        shadowColor: '#4A9977',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: glowOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.8],
                        }),
                        shadowRadius: scale.interpolate({
                            inputRange: [0.75, 1.30],
                            outputRange: [20, 50], // MUCH more dramatic glow range
                        }),
                        elevation: 20,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 280,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
    },
    breathingCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 3,
        borderColor: '#4A9977',
    },
    outerCircle: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 2,
        borderColor: '#4A9977',
    },
});
