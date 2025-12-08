import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

type BreathingCircleProps = {
    isActive: boolean;
};

export function BreathingCircle({ isActive }: BreathingCircleProps) {
    const lotusScale = useRef(new Animated.Value(1.0)).current;
    const glowOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isActive) {
            lotusScale.setValue(1.0);
            glowOpacity.setValue(1);
            return;
        }

        const breathingCycle = () => {
            Animated.sequence([
                // EXHALE: Lotus contracts (6.5 seconds) - breath goes OUT
                Animated.parallel([
                    Animated.timing(lotusScale, {
                        toValue: 0.4, // Small
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
                ]),
                // Pause (0.5 seconds)
                Animated.delay(500),
                // INHALE: Lotus expands (3.5 seconds) - breath comes IN, belly fills
                Animated.parallel([
                    Animated.timing(lotusScale, {
                        toValue: 1.0, // Full size
                        duration: 3500,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 1,
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
            lotusScale.stopAnimation();
            glowOpacity.stopAnimation();
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Gold lotus image - represents diaphragm/belly */}
            <Animated.View
                style={[
                    styles.lotusContainer,
                    {
                        opacity: glowOpacity,
                        transform: [{ scale: lotusScale }],
                    }
                ]}
            >
                <Image
                    source={require('../assets/images/lotus.png')}
                    style={styles.lotusImage}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusContainer: {
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusImage: {
        width: 400,
        height: 400,
    },
});
