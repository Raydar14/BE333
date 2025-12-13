import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface PetalAwardModalProps {
    visible: boolean;
    onClose: () => void;
    dayOfPractice: number;
    bloomDays: number;
}

export function PetalAwardModal({ visible, onClose, dayOfPractice, bloomDays }: PetalAwardModalProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>

                    <LinearGradient
                        colors={['#1A4331', '#0F291E']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Celebration Header */}
                    <Text style={styles.congratsText}>Divine Pause</Text>
                    <Text style={styles.subText}>Petal Earned!</Text>

                    {/* Lotus Container */}
                    <View style={styles.lotusContainer}>
                        {/* Glow effect */}
                        <View style={styles.glow} />

                        <Image
                            source={require('../assets/images/golden_lotus.png')}
                            style={styles.lotusImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.progressText}>
                        You have collected {bloomDays}/21 Pause Petals
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <LinearGradient
                            colors={['#FFD700', '#B8860B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.closeButtonGradient}
                        >
                            <Text style={styles.closeButtonText}>Collect Petal</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)', // Darker overlay for drama
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        overflow: 'hidden',
        // Shadow (iOS) / Elevation (Android)
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
    },
    congratsText: {
        fontSize: 32, // Larger
        fontWeight: '300', // Elegantly thin
        color: '#FFF', // Gold
        marginBottom: 5,
        fontFamily: 'System', // Use default for now, ideally custom font
        letterSpacing: 2,
    },
    subText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 30,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    lotusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FFD700',
        opacity: 0.2,
        transform: [{ scale: 1.5 }],
    },
    lotusImage: {
        width: 200,
        height: 200,
    },
    progressText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    closeButton: {
        width: '100%',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    closeButtonText: {
        color: '#1A4331', // Dark Green
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
