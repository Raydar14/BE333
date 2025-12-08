import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Lock } from 'lucide-react-native';
import { usePurchase } from '../contexts/PurchaseContext';
import { PaywallModal } from './PaywallModal';

interface ProFeatureLockProps {
    children: React.ReactNode;
    label?: string;
}

export function ProFeatureLock({ children, label = "Pro Feature" }: ProFeatureLockProps) {
    const { isPro } = usePurchase();
    const [showPaywall, setShowPaywall] = useState(false);

    // If user is already pro, just show the content
    if (isPro) {
        return <>{children}</>;
    }

    // Otherwise show locked overlay
    return (
        <>
            <View style={styles.container}>
                <View style={styles.contentOpacified}>
                    {children}
                </View>
                <TouchableOpacity style={styles.overlay} onPress={() => setShowPaywall(true)}>
                    <Lock size={24} color={Colors.secondary} />
                    <Text style={styles.text}>{label}</Text>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Unlock Pro Features</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 12,
    },
    contentOpacified: {
        opacity: 0.3, // Blur/fade the content behind
        pointerEvents: 'none', // Prevent interaction
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginTop: 8,
        marginBottom: 8,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    }
});
