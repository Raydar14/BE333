import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ShimmerButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    textStyle?: any;
    icon?: any;
}

export function ShimmerButton({ title, loading, icon: Icon, style, textStyle, ...props }: ShimmerButtonProps) {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            disabled={loading || props.disabled}
            {...props}
        >
            {/* Gold background Gradient */}
            <View style={styles.gradientContainer}>
                <LinearGradient
                    colors={['#FFD700', '#DAA520', '#B8860B', '#DAA520']} // Multi-stop gold metal gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />

                {/* Shimmer overlay */}
                <Animated.View
                    style={[
                        styles.shimmer,
                        { transform: [{ translateX }] }
                    ]}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shimmerGradient}
                    />
                </Animated.View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator color={Colors.primary} />
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {Icon && <Icon size={20} color={Colors.primary} style={{ marginRight: 8 }} />}
                        <Text style={[styles.text, textStyle]}>{title}</Text>
                    </View>
                )}
            </View>

            {/* Gold border glow */}
            <View style={styles.goldBorder} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderRadius: 30,
        overflow: 'hidden',
        marginVertical: 12,
        shadowColor: '#DAA520', // Gold shadow
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 12, // Stronger elevation
        transform: [{ scale: 1.0 }], // Placeholder in case we want press animation later
    },
    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    shimmer: {
        position: 'absolute',
        top: -50, // Extend to cover rotation
        bottom: -50,
        width: 150, // Wider shimmer
        opacity: 0.9,
    },
    shimmerGradient: {
        flex: 1,
        backgroundColor: '#FFF', // Bright white shine
        opacity: 0.5,
        transform: [{ skewX: '-30deg' }],
    },
    content: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: '800', // Extra bold
        letterSpacing: 1,
        color: '#1A4331', // Deep green on gold
        textTransform: 'uppercase',
    },
    goldBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#FFF8DC', // Cornsilk/Light gold highlight border
        opacity: 0.5,
    },
});
