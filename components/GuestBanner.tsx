import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Info } from 'lucide-react-native';

export function GuestBanner() {
    return (
        <View style={styles.container}>
            <Info size={20} color={Colors.primary} style={styles.icon} />
            <View style={styles.content}>
                <Text style={styles.text}>
                    You are using BE333 as a Guest.
                </Text>
                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>Log in to track your practice!</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondaryLight, // Light Gold
        padding: 12,
        marginHorizontal: 16,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    icon: {
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    text: {
        color: Colors.text,
        fontSize: 14,
    },
    link: {
        color: Colors.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginTop: 2,
    },
});
