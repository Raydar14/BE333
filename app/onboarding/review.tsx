import React, { useState, Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShimmerButton } from '../../components/ShimmerButton';
import { NotificationService } from '../../services/NotificationService';
import { NOTIFICATION_COPY, bodyFor } from '../../content/notifications';
import { Leaf } from 'lucide-react-native';
import { NotificationPreferencesCard } from '../../components/NotificationPreferencesCard';
import { SnoozeControls } from '../../components/SnoozeControls';
import { buildRemindersIcs, downloadIcsWeb } from '../../lib/icsReminders';

export default function OnboardingReview() {
    const { colors } = useTheme();
    const router = useRouter();
    const { habitLinks } = useSettings();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleFinish = async () => {
        setLoading(true);
        // 1. Request Permissions
        const granted = await NotificationService.registerForPushNotificationsAsync();

        if (!granted) {
            // Web fallback: expo-notifications on the web only fires while
            // the tab is open, so pushing reminders that way is a dead end.
            // Instead, auto-download a .ics file the user can import into
            // Google / Apple / Outlook Calendar — those apps do the actual
            // reminding. On native without permission we keep the classic
            // "enable later in settings" alert.
            if (Platform.OS === 'web') {
                const ics = buildRemindersIcs(habitLinks, {
                    calendarName: 'BE333 · Rise · Reset · Rest',
                    ownerId: user?.uid,
                });
                if (ics) downloadIcsWeb(ics);
            } else {
                Alert.alert(
                    "Notifications Disabled",
                    "We can't send you reminders without permission. You can enable them later in settings.",
                    [{ text: "OK" }]
                );
            }
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
                const title = NOTIFICATION_COPY[p].title;
                const body = bodyFor(p, link.relation, link.anchor);

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

                <View style={[styles.ladderCard, { backgroundColor: colors.surface, borderColor: '#D4AF37' }]}>
                    <Text style={[styles.ladderTitle, { color: colors.secondary }]}>
                        The 21-day ladder
                    </Text>
                    <Text style={[styles.ladderSubtitle, { color: colors.textSecondary }]}>
                        You start here. When each Practice is steady, the next stage opens.
                    </Text>
                    <View style={styles.ladderRow}>
                        {[
                            { key: '333', label: '3 min × 3', hint: 'Start here' },
                            { key: '666', label: '6 min × 3', hint: 'After 21 days' },
                            { key: '999', label: '9 min × 3', hint: 'When ready' },
                        ].map((tier, i) => (
                            <React.Fragment key={tier.key}>
                                {i > 0 && (
                                    <Text style={[styles.ladderArrow, { color: colors.textSecondary }]}>›</Text>
                                )}
                                <View style={[styles.ladderTier, i === 0 && {
                                    borderColor: '#FFD700',
                                    backgroundColor: 'rgba(255,215,0,0.1)',
                                }]}>
                                    <Text style={[styles.ladderNum, { color: i === 0 ? '#FFD700' : colors.text }]}>
                                        {tier.key}
                                    </Text>
                                    <Text style={[styles.ladderLabel, { color: colors.textSecondary }]}>
                                        {tier.label}
                                    </Text>
                                    <Text style={[styles.ladderHint, { color: i === 0 ? '#FFD700' : colors.textSecondary }]}>
                                        {tier.hint}
                                    </Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
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
    },
    ladderCard: {
        marginTop: 20,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    ladderTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    ladderSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    ladderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
    },
    ladderTier: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
    },
    ladderNum: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    ladderLabel: {
        fontSize: 10,
        marginTop: 2,
        fontWeight: '600',
    },
    ladderHint: {
        fontSize: 10,
        marginTop: 4,
        fontStyle: 'italic',
    },
    ladderArrow: {
        fontSize: 18,
        fontWeight: '700',
        opacity: 0.6,
    },
});
