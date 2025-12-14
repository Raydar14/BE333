import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat, withSequence } from 'react-native-reanimated';
import { BreathingCircle } from './BreathingCircle';
import { useSettings } from '../contexts/SettingsContext';

interface BreathingBellyProps {
    isActive: boolean;
    phase: 'deep3' | 'inhale' | 'pause' | 'exhale' | 'idle';
}

export function BreathingBelly({ isActive, phase }: BreathingBellyProps) {
    const { bellyVisualGender, showBreathingLotus } = useSettings();
    const scale = useSharedValue(0.3); // Start small in the lap
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.8);

    useEffect(() => {
        if (!isActive) {
            // Idle state
            scale.value = withTiming(0.4, { duration: 1000 });
            translateY.value = withTiming(0, { duration: 1000 });
            opacity.value = withTiming(0.5, { duration: 1000 });
            return;
        }

        switch (phase) {
            case 'deep3':
                // Deep breathing (pulsing large)
                scale.value = withRepeat(
                    withSequence(
                        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
                opacity.value = withTiming(0.9, { duration: 500 });
                break;
            case 'inhale':
                // Grow out of the person (up and big)
                scale.value = withTiming(1.2, { duration: 4000, easing: Easing.out(Easing.ease) });
                translateY.value = withTiming(-50, { duration: 4000, easing: Easing.out(Easing.ease) });
                opacity.value = withTiming(1, { duration: 500 });
                break;
            case 'exhale':
                // Shrink back to base/lap
                scale.value = withTiming(0.3, { duration: 6000, easing: Easing.out(Easing.ease) });
                translateY.value = withTiming(30, { duration: 6000, easing: Easing.out(Easing.ease) });
                opacity.value = withTiming(0.7, { duration: 500 });
                break;
            case 'pause':
                // Hold state
                break;
        }
    }, [isActive, phase]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ],
            opacity: opacity.value
        };
    });

    const backgroundImage = bellyVisualGender === 'male'
        ? require('../assets/images/breathing_belly_male.png')
        : require('../assets/images/breathing_belly_female.png');

    return (
        <View style={styles.container}>
            {/* Background: User Provided Image (Male/Female) */}
            <Image
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="contain"
            />

            {/* Foreground: The Dynamic Lotus (Optional Overlay) */}
            {showBreathingLotus && (
                <View style={styles.lotusContainer}>
                    <Animated.View style={[styles.lotusWrapper, animatedStyle]}>
                        <BreathingCircle
                            isActive={isActive}
                            showGuide={false} // Just the visual
                            showNature={false} // We handle nature separately
                            size={200} // Base size
                        />
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.9,
    },
    lotusContainer: {
        position: 'absolute',
        // Position roughly at the center/core
        top: '25%', // Adjusted for pure lotus center alignment
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    lotusWrapper: {
        // Wrapper for animation transforms
    }
});
