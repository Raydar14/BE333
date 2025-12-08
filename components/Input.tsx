import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { LucideIcon } from 'lucide-react-native';

interface InputProps extends TextInputProps {
    icon?: LucideIcon;
}

export function Input({ icon: Icon, style, ...props }: InputProps) {
    return (
        <View style={styles.container}>
            {Icon && <Icon size={20} color={Colors.primary} style={styles.icon} />}
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={Colors.textSecondary}
                cursorColor={Colors.primary}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        marginVertical: 8,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: Colors.text,
    },
});
