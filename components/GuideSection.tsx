import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { Colors } from '../constants/Colors';
import { ShieldCheck, UserPlus, Copy, HeartHandshake } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { PremiumButton } from './PremiumButton';

export function GuideSection() {
    const { user } = useAuth();
    // In a real app, we'd fetch the linked guide or clients from Firestore
    // For MVP, we'll mock the "One-wav share record" UI.

    // Mock State
    const [isGuideMode, setIsGuideMode] = useState(false); // Toggle to see what a therapist sees
    const [connectedGuide, setConnectedGuide] = useState<string | null>(null);

    const myShareKey = user?.uid?.substring(0, 8).toUpperCase() || "--------";

    const handleCopyKey = () => {
        // Clipboard.setString(myShareKey); 
        Alert.alert("Link Copied", "Share this key with your therapist to view your records.");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeartHandshake color={Colors.primary} size={24} />
                    <Text style={styles.title}>Your Guide</Text>
                </View>
                {/* <Text style={{fontSize: 12, color: Colors.textSecondary}}>Therapist / Counselor</Text> */}
            </View>

            <Text style={styles.description}>
                Share your BE333 practice records with your therapist or counselor for deeper support.
            </Text>

            <View style={styles.keyContainer}>
                <Text style={styles.keyLabel}>YOUR SHARE KEY</Text>
                <TouchableOpacity style={styles.keyBox} onPress={handleCopyKey}>
                    <Text style={styles.keyValue}>{myShareKey}</Text>
                    <Copy size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.proTip}>
                <ShieldCheck size={16} color={Colors.textSecondary} />
                <Text style={styles.secureText}>One-way secure sharing enabled</Text>
            </View>

            {/* If the user WAS a therapist, below we would list their clients */}
            {/* 
            <View style={{marginTop: 20}}>
                <Text style={styles.subTitle}>My Clients</Text>
                <Text style={{color: Colors.textSecondary, fontStyle: 'italic'}}>No active client connections.</Text>
            </View> 
            */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    keyContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    keyLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        marginBottom: 5,
        letterSpacing: 1,
    },
    keyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 10,
    },
    keyValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
        fontFamily: 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 15,
    },
    proTip: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    secureText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 10,
    }
});
