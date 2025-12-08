import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ShimmerButton } from '../../components/ShimmerButton';
import { NotificationService } from '../../services/NotificationService';
import { Leaf } from 'lucide-react-native';
import { NotificationPreferencesCard } from '../../components/NotificationPreferencesCard';
import { SnoozeControls } from '../../components/SnoozeControls';

export default function OnboardingReview() {
    const { colors } = useTheme();
    const router = useRouter();
    const { habitLinks } = useSettings();
    const [loading, setLoading] = useState(false);

    const handleFinish = async () => {
        setLoading(true);
        // 1. Request Permissions
        const granted = await NotificationService.registerForPushNotificationsAsync();

        if (!granted) {
            Alert.alert(
                "Notifications Disabled",
                "We can't send you reminders without permission. You can enable them later in settings.",
                [{ text: "OK" }]
            );
            // Don't block - proceed to home anyway
            setLoading(false);
            router.replace('/');
            return;
        }

        // 2. Schedule Notifications
        await NotificationService.cancelAllNotifications();

        const periods = ['morning', 'midday', 'evening'] as const;

        for (const p of periods) {
            const link = habitLinks[p];
            if (link.enabled && link.time) {
                const [h, m] = link.time.split(':').map(Number);
                const title = `Time to BE (${p.toUpperCase()})`;
                const body = `${link.relation === 'before' ? 'Before' : 'After'} you ${link.anchor}, take 3 minutes.`;

                await NotificationService.scheduleHabitReminder(p, title, body, h, m);
            }
        }

        Alert.alert("All Set!", "Your habit links are active.", [
            { text: "Let's BE", onPress: () => router.replace('/') }
        ]);
        setLoading(false);
    };

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.primary }]}>Review Your Links</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Here is the Plan to Pause.
                </Text>

                <View style={styles.cardContainer}>
                    {['morning', 'midday', 'evening'].map((p) => {
                        const link = habitLinks[p as keyof typeof habitLinks];
                        const displayNames: Record<string, string> = {
                            morning: '☀️ Rise',
                            midday: '🌤️ Rest',
                            evening: '🌙 Relax'
                        };
                        return (
                            <View key={p} style={[styles.card, { backgroundColor: colors.surface, borderColor: '#D4AF37' }]}>
                                <Text style={[styles.period, { color: colors.secondary }]}>
                                    {displayNames[p]}
                                </Text>
                                <Text style={[styles.link, { color: colors.text }]}>
                                    {link.relation === 'before' ? 'Before' : 'After'} I <Text style={{ fontWeight: 'bold', color: colors.primary }}>{link.anchor}</Text>
                                </Text>
                                <Text style={[styles.time, { color: colors.textSecondary }]}>
                                    @ {link.time}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <NotificationPreferencesCard />

                <SnoozeControls />

                <View style={{ flex: 1 }} />

                <ShimmerButton
                    title={loading ? "Scheduling..." : "Finish Setup"}
                    onPress={handleFinish}
                    style={{ marginBottom: 30 }}
                    disabled={loading}
                    icon={Leaf}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 50,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
    },
    cardContainer: {
        gap: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    period: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    link: {
        fontSize: 18,
    },
    time: {
        marginTop: 5,
        fontSize: 14,
    }
});
