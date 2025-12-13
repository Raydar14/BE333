import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'gold';
    loading?: boolean;
    textStyle?: any;
    icon?: any; // LucideIcon
}

export function PremiumButton({ title, variant = 'primary', loading, icon: Icon, style, textStyle, ...props }: PremiumButtonProps) {
    const getGradientColors = () => {
        if (props.disabled) return ['#CCCCCC', '#999999'];
        switch (variant) {
            case 'primary':
                // Rich Teal/Green Gradient
                return ['#4A9977', '#3D8866', '#2C6E52'];
            case 'secondary':
                // Gold Gradient
                return ['#F4E285', '#D4AF37', '#AA8C2C'];
            case 'gold':
                // Richer Gold for prominent actions
                return ['#FFD700', '#DAA520', '#B8860B'];
            case 'outline':
                return ['transparent', 'transparent'];
            default:
                return ['#4A9977', '#2C6E52'];
        }
    };

    const getTextColor = () => {
        if (props.disabled) return '#666';
        switch (variant) {
            case 'primary': return '#fff';
            case 'secondary': return '#1A4331'; // Dark green on gold
            case 'gold': return '#1A4331';
            case 'outline': return Colors.primary;
            default: return '#fff';
        }
    };

    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                styles.shadow,
                isOutline && styles.outlineContainer, // Handle outline shape if needed
                style,
            ]}
            disabled={loading || props.disabled}
            activeOpacity={0.8}
            {...props}
        >
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }} // Vertical gradient for 3D depth
                style={[
                    styles.gradient,
                    isOutline && styles.outlineGradient, // might need adjustments for border gradient
                ]}
            >
                {/* Inner Bevel Highlight for 3D feel */}
                {!isOutline && <View style={styles.bevelHighlight} />}

                <View style={styles.contentContainer}>
                    {loading ? (
                        <ActivityIndicator color={getTextColor()} />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {Icon && <Icon size={20} color={getTextColor()} style={{ marginRight: 8 }} />}
                            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        marginVertical: 8,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    gradient: {
        borderRadius: 30,
        padding: 1, // For potential border effects
        minHeight: 56,
        justifyContent: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    outlineContainer: {
        borderColor: Colors.primary,
        borderWidth: 1, // Fallback if gradient border complicated
        backgroundColor: 'transparent',
    },
    outlineGradient: {
        // Transparent background for outline usually
    },
    bevelHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)', // Top highlight
    },
    text: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase', // Premium buttons often uppercase
    },
});
