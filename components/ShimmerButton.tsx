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
            {/* Gold background */}
            <View style={styles.gradientContainer}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#D4AF37' }]} />
                {/* Shimmer overlay */}
                <Animated.View
                    style={[
                        styles.shimmer,
                        { transform: [{ translateX }] }
                    ]}
                >
                    <View style={styles.shimmerGradient} />
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
        borderRadius: 25,
        overflow: 'hidden',
        marginVertical: 8,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 100,
    },
    shimmerGradient: {
        flex: 1,
        backgroundColor: 'rgba(255, 248, 220, 0.6)', // Lighter gold/cream shimmer
        transform: [{ skewX: '-20deg' }],
    },
    content: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: Colors.primary, // Dark green text on gold
    },
    goldBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#D4AF37',
    },
});
