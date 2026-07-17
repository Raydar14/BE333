import React, { useEffect, useRef, useMemo } from 'react';
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

interface Milestone {
    title: string;
    subtitle: string;
    ctaLabel: string;
}

// Milestone lines per Master Manual — Day 1, Day 3, Week 1, Halfway, Day 19,
// Day 21 Completion, plus acceptance/self-kindness lines. Keep 10-14 words max.
function getMilestone(day: number): Milestone {
    if (day >= 21) {
        return {
            title: 'You Bloomed',
            subtitle: 'Twenty-one days. You built something real, petal by petal.',
            ctaLabel: 'Celebrate',
        };
    }
    if (day >= 19) {
        return {
            title: 'Almost Bloomed',
            subtitle: 'Two petals away. The final week is yours.',
            ctaLabel: 'Keep Going',
        };
    }
    if (day >= 14) {
        return {
            title: 'Two Weeks Steady',
            subtitle: 'Fourteen days. Your practice has real roots now.',
            ctaLabel: 'Collect Petal',
        };
    }
    if (day >= 11) {
        return {
            title: 'Halfway There',
            subtitle: 'You are already halfway home. Keep going, gently.',
            ctaLabel: 'Collect Petal',
        };
    }
    if (day >= 7) {
        return {
            title: 'One Week Down',
            subtitle: 'Seven days. Your body is learning to breathe soft.',
            ctaLabel: 'Collect Petal',
        };
    }
    if (day >= 3) {
        return {
            title: 'A Routine Begins',
            subtitle: 'Three days of showing up. This is how habits grow.',
            ctaLabel: 'Collect Petal',
        };
    }
    if (day >= 1) {
        return {
            title: 'First Petal Opened',
            subtitle: 'You began. That is the whole start.',
            ctaLabel: 'Collect Petal',
        };
    }
    return {
        title: 'Divine Pause',
        subtitle: 'Petal Earned',
        ctaLabel: 'Collect Petal',
    };
}

export function PetalAwardModal({ visible, onClose, dayOfPractice, bloomDays }: PetalAwardModalProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const milestone = useMemo(() => getMilestone(dayOfPractice), [dayOfPractice]);

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

                    {/* Milestone Header */}
                    <Text style={styles.congratsText}>{milestone.title}</Text>
                    <Text style={styles.subText}>{milestone.subtitle}</Text>

                    {/* Lotus Container */}
                    <View style={styles.lotusContainer}>
                        <View style={styles.glow} />

                        <Image
                            source={require('../assets/images/golden_lotus.png')}
                            style={styles.lotusImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.progressText}>
                        Day {dayOfPractice} of 21 · {bloomDays} Bloom Petals
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <LinearGradient
                            colors={['#FFD700', '#B8860B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.closeButtonGradient}
                        >
                            <Text style={styles.closeButtonText}>{milestone.ctaLabel}</Text>
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
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
    },
    congratsText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#FFD700',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },
    subText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 24,
        textAlign: 'center',
        paddingHorizontal: 10,
        lineHeight: 22,
    },
    lotusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
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
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
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
        color: '#1A4331',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
