import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    textStyle?: any;
    icon?: any; // LucideIcon
}

export function Button({ title, variant = 'primary', loading, icon: Icon, style, textStyle, ...props }: ButtonProps) {
    const getBackgroundColor = () => {
        if (props.disabled) return '#ccc';
        switch (variant) {
            case 'primary': return Colors.primary;
            case 'secondary': return Colors.secondary;
            case 'outline': return 'transparent';
            default: return Colors.primary;
        }
    };

    const getTextColor = () => {
        if (props.disabled) return '#666';
        switch (variant) {
            case 'primary': return '#fff';
            case 'secondary': return Colors.primary; // Dark green text on gold button
            case 'outline': return Colors.primary;
            default: return '#fff';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outline,
                style,
            ]}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {Icon && <Icon size={20} color={getTextColor()} style={{ marginRight: 8 }} />}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 25, // Rounded for a softer look (Logo is a lotus)
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    outline: {
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
