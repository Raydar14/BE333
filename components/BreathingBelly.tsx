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
    const { showBreathingLotus, breathingPattern } = useSettings();
    const scale = useSharedValue(0.3); // Start small in the lap
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.8);

    // Sync durations with the main logic
    const inhaleDur = breathingPattern === '3-1-5' ? 3000 : 4000;
    const exhaleDur = breathingPattern === '3-1-5' ? 5000 : 6000;

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
                // RISE from Root to Crown
                scale.value = withTiming(1.0, { duration: inhaleDur, easing: Easing.inOut(Easing.quad) });
                translateY.value = withTiming(-110, { duration: inhaleDur, easing: Easing.inOut(Easing.quad) }); // Move UP to Crown (Reduced height)
                opacity.value = withTiming(1, { duration: 500 });
                break;
            case 'exhale':
                // DESCEND from Crown to Root
                scale.value = withTiming(0.3, { duration: exhaleDur, easing: Easing.inOut(Easing.quad) });
                translateY.value = withTiming(0, { duration: exhaleDur, easing: Easing.inOut(Easing.quad) }); // Move DOWN to Root
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

    return (
        <View style={styles.container}>
            {/* Background: Single Validated Image */}
            <Image
                source={require('../assets/images/breathing_belly_filled.png')}
                style={styles.backgroundImage}
                resizeMode="contain"
            />

            {/* Foreground: The Dynamic Lotus (Optional Overlay) */}
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
        // Anchor at the ROOT (Base of Spine/Lap) - 120 (Fine tuned)
        top: 120,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    lotusWrapper: {
        // Wrapper for animation transforms
    }
});
