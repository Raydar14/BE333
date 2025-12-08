import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { usePurchase } from '../contexts/PurchaseContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './Button';

type PaywallModalProps = {
    visible: boolean;
    onClose: () => void;
};

export function PaywallModal({ visible, onClose }: PaywallModalProps) {
    const { offerings, purchasePackage, loading } = usePurchase();
    const { colors } = useTheme();
    const [purchasing, setPurchasing] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'user' | 'therapist'>('user');

    async function handlePurchase(packageId: string) {
        setPurchasing(true);
        try {
            await purchasePackage(packageId);
            onClose();
        } catch (e) {
            console.error('Purchase failed:', e);
        } finally {
            setPurchasing(false);
        }
    }

    if (loading || !offerings) {
        return (
            <Modal visible={visible} transparent animationType="slide">
                <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.content, { backgroundColor: colors.background }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.content, { backgroundColor: colors.background }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X size={24} color={colors.text} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[styles.title, { color: colors.text }]}>Unlock Pro Features</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Choose your plan
                        </Text>

                        {/* Tier Selector */}
                        <View style={styles.tierSelector}>
                            <TouchableOpacity
                                style={[
                                    styles.tierButton,
                                    { borderColor: colors.primary },
                                    selectedTier === 'user' && { backgroundColor: colors.primary }
                                ]}
                                onPress={() => setSelectedTier('user')}
                            >
                                <Text style={[
                                    styles.tierButtonText,
                                    { color: selectedTier === 'user' ? colors.textLight : colors.primary }
                                ]}>
                                    User
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.tierButton,
                                    { borderColor: colors.secondary },
                                    selectedTier === 'therapist' && { backgroundColor: colors.secondary }
                                ]}
                                onPress={() => setSelectedTier('therapist')}
                            >
                                <Text style={[
                                    styles.tierButtonText,
                                    { color: selectedTier === 'therapist' ? colors.primary : colors.secondary }
                                ]}>
                                    Therapist
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Features List */}
                        <View style={[styles.featuresBox, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.featureTitle, { color: colors.text }]}>Pro Features Include:</Text>
                            <Text style={[styles.feature, { color: colors.textSecondary }]}>✓ Custom timer durations</Text>
                            <Text style={[styles.feature, { color: colors.textSecondary }]}>✓ Habit stacking reminders</Text>
                            <Text style={[styles.feature, { color: colors.textSecondary }]}>✓ Custom app themes</Text>
                            <Text style={[styles.feature, { color: colors.textSecondary }]}>✓ Lifetime statistics</Text>
                            {selectedTier === 'therapist' && (
                                <Text style={[styles.feature, { color: colors.secondary }]}>✓ Therapist-specific analytics</Text>
                            )}
                        </View>

                        {/* Pricing Options */}
                        <View style={styles.pricingContainer}>
                            {selectedTier === 'user' ? (
                                <>
                                    <PricingCard
                                        title="Monthly"
                                        price="$3.33"
                                        period="/month"
                                        onPress={() => handlePurchase('user_monthly')}
                                        colors={colors}
                                        loading={purchasing}
                                    />
                                    <PricingCard
                                        title="Yearly"
                                        price="$33"
                                        period="/year"
                                        badge="Save 17%"
                                        onPress={() => handlePurchase('user_yearly')}
                                        colors={colors}
                                        loading={purchasing}
                                    />
                                    <PricingCard
                                        title="Lifetime"
                                        price="$99"
                                        period="one-time"
                                        badge="Best Value"
                                        onPress={() => handlePurchase('user_lifetime')}
                                        colors={colors}
                                        loading={purchasing}
                                    />
                                </>
                            ) : (
                                <>
                                    <PricingCard
                                        title="Monthly"
                                        price="$9.99"
                                        period="/month"
                                        onPress={() => handlePurchase('therapist_monthly')}
                                        colors={colors}
                                        loading={purchasing}
                                    />
                                    <PricingCard
                                        title="Yearly"
                                        price="$111"
                                        period="/year"
                                        badge="Save 8%"
                                        onPress={() => handlePurchase('therapist_yearly')}
                                        colors={colors}
                                        loading={purchasing}
                                    />
                                    <PricingCard
                                        title="Lifetime"
                                        price="$333"
                                        period="one-time"
                                        badge="Professional"
                                        onPress={() => handlePurchase('therapist_lifetime')}
                                        colors={colors}
                                        loading={purchasing}
                                    />
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function PricingCard({ title, price, period, badge, onPress, colors, loading }: any) {
    return (
        <TouchableOpacity
            style={[styles.pricingCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={onPress}
            disabled={loading}
        >
            {badge && (
                <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{badge}</Text>
                </View>
            )}
            <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.cardPrice, { color: colors.primary }]}>{price}</Text>
            <Text style={[styles.cardPeriod, { color: colors.textSecondary }]}>{period}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    tierSelector: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    tierButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
    },
    tierButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    featuresBox: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    feature: {
        fontSize: 14,
        marginBottom: 5,
    },
    pricingContainer: {
        gap: 15,
    },
    pricingCard: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardPrice: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    cardPeriod: {
        fontSize: 14,
    },
});
