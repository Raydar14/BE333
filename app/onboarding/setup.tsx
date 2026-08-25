import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings, HabitLinkConfig } from '../../contexts/SettingsContext';
import { ShimmerButton } from '../../components/ShimmerButton';
import { BE333Logo } from '../../components/BE333Logo';
import { Leaf, Clock, Sun, Moon, Coffee } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NotificationService } from '../../services/NotificationService';
import { NOTIFICATION_COPY, bodyFor } from '../../content/notifications';
import { useAuth } from '../../contexts/AuthContext';
import { buildRemindersIcs, downloadIcsWeb } from '../../lib/icsReminders';

export default function OnboardingSetup() {
    const { colors } = useTheme();
    const router = useRouter();
    const { habitLinks, updateHabitLink, notificationMethod, snoozeUntil } = useSettings();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // DatePicker State
    const [showPicker, setShowPicker] = useState<string | null>(null); // 'morning', 'midday', 'evening' or null

    // Helper to format Date to 12h string (e.g. "9:30 AM")
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
        return strTime;
    };

    // Helper to parse string to Date
    const parseTime = (timeStr: string) => {
        const d = new Date();
        if (!timeStr) return d;

        // Handle legacy 24h "14:30"
        if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
            const [h, m] = timeStr.split(':').map(Number);
            d.setHours(h || 0);
            d.setMinutes(m || 0);
            return d;
        }

        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        d.setHours(hours);
        d.setMinutes(minutes);
        return d;
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        const currentField = showPicker;
        if (Platform.OS === 'android') {
            setShowPicker(null);
        }

        if (currentField && selectedDate) {
            updateHabitLink(currentField as any, {
                ...habitLinks[currentField as keyof typeof habitLinks],
                time: formatTime(selectedDate),
                enabled: true
            });
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // 1. Request Permissions
            const granted = await NotificationService.registerForPushNotificationsAsync();

            if (!granted) {
                // Notifications didn't get scheduled — either the user
                // denied permission on native, or we're on the web build
                // where expo-notifications is a no-op. On web we can at
                // least hand the user a calendar file with their three
                // daily reminders in it; the browser downloads it and
                // any calendar app they import it into will do the
                // reminding for them.
                //
                // Respect the user's explicit choice: if they set
                // notificationMethod === 'none', don't force a download.
                // The button in Settings → Reminders is always there.
                // Only offer the calendar-file fallback when the user
                // actually picked push notifications. Selecting SMS or
                // Email should not silently switch them to a calendar
                // download; those are their own TODOs (see 'Meditation
                // reminders' in TODO.md).
                if (Platform.OS === 'web' && notificationMethod === 'push') {
                    const ics = buildRemindersIcs(habitLinks, {
                        calendarName: 'BE333 · Rise · Reset · Rest',
                        ownerId: user?.uid,
                        snoozeUntilMs: snoozeUntil,
                    });
                    if (ics && downloadIcsWeb(ics)) {
                        // react-native-web's Alert.alert is a no-op on
                        // the web, so use the browser's native alert to
                        // explain the required import step. Without this
                        // the user could leave onboarding thinking
                        // reminders are active when only a file was
                        // saved to their Downloads folder.
                        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
                            window.alert(
                                "We downloaded a 'be333-reminders.ics' file to your device.\n\n" +
                                'Open it in your calendar app (Google Calendar, Apple ' +
                                "Calendar, Outlook, etc.) and confirm the import — that's " +
                                'what actually schedules the reminders. Nothing is on your ' +
                                'calendar until you do that step.\n\n' +
                                'You can re-download this file anytime from Settings → Reminders.'
                            );
                        }
                    }
                }
                finishRouting(); // Navigate anyway
            } else {
                // 2. Schedule Notifications
                const periods = ['morning', 'midday', 'evening'] as const;
                await NotificationService.cancelAllNotifications();

                for (const p of periods) {
                    const link = habitLinks[p];
                    if (link.enabled && link.time) {
                        const dateObj = parseTime(link.time);
                        const h = dateObj.getHours();
                        const m = dateObj.getMinutes();
                        const title = NOTIFICATION_COPY[p].title;
                        const body = bodyFor(p, link.relation, link.anchor);

                        await NotificationService.scheduleHabitReminder(p, title, body, h, m);
                    }
                }
                finishRouting();
            }
        } catch (error) {
            console.error("Setup Error:", error);
            Alert.alert("Error", "There was a problem saving your routine. Please try again.");
            setLoading(false);
        }
    };

    const finishRouting = () => {
        setLoading(false);
        router.replace('/');
    }

    const renderSection = (period: 'morning' | 'midday' | 'evening', title: string, icon: any, defaultAnchor: string, iconColor: string) => {
        const link = habitLinks[period];

        return (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {React.createElement(icon, { size: 24, color: iconColor })}
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    {/* Anchor Input */}
                    <Text style={[styles.label, { color: colors.textSecondary }]}>My Root Habit:</Text>
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                        value={link.anchor}
                        onChangeText={(text) => updateHabitLink(period, { ...link, anchor: text, enabled: true })}
                        placeholder={`e.g. ${defaultAnchor}`}
                        placeholderTextColor={colors.textSecondary}
                    />

                    {/* Relation Toggle */}
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[
                                styles.toggleBtn,
                                link.relation === 'before' && { backgroundColor: colors.primary }
                            ]}
                            onPress={() => updateHabitLink(period, { ...link, relation: 'before' })}
                        >
                            <Text style={[styles.toggleText, { color: link.relation === 'before' ? '#fff' : colors.text }]}>Before</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.toggleBtn,
                                link.relation === 'after' && { backgroundColor: colors.primary }
                            ]}
                            onPress={() => updateHabitLink(period, { ...link, relation: 'after' })}
                        >
                            <Text style={[styles.toggleText, { color: link.relation === 'after' ? '#fff' : colors.text }]}>After</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Time Picker Trigger */}
                    <TouchableOpacity
                        style={[styles.timeButton, { borderColor: colors.border }]}
                        onPress={() => setShowPicker(period)}
                    >
                        <Clock size={16} color={colors.textSecondary} />
                        <Text style={{ color: colors.text, fontSize: 16 }}>
                            {/* Display normalized 12h time even if stored as 24h legacy */}
                            {formatTime(parseTime(link.time))}
                        </Text>
                    </TouchableOpacity>

                    {/* Inline Picker for iOS, Dialog for Android (handled by showPicker state check below loop if centralized, or here) */}
                    {showPicker === period && Platform.OS === 'ios' && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={parseTime(link.time)}
                            mode="time"
                            is24Hour={false} // Force 12h
                            display="spinner"
                            onChange={handleTimeChange}
                        />
                    )}
                    {showPicker === period && Platform.OS === 'ios' && (
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={{ alignSelf: 'flex-end', padding: 5 }}>
                            <Text style={{ color: colors.primary }}>Done</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <BE333Logo width={180} height={180} style={styles.logo} />
                </View>

                <Text style={[styles.headerTitle, { color: colors.primary }]}>Design Your Rituals</Text>
                <Text style={[styles.headerDesc, { color: colors.textSecondary }]}>
                    Choose a habit that's already part of your day.
                </Text>

                <View style={styles.ideasContainer}>
                    <Text style={[styles.ideaItem, { color: colors.textSecondary }]}>get out of bed • brush teeth • shower</Text>
                    <Text style={[styles.ideaItem, { color: colors.textSecondary }]}>get dressed • make coffee • start commute</Text>
                    <Text style={[styles.ideaItem, { color: colors.textSecondary }]}>11:11 • check email • lunch break</Text>
                    <Text style={[styles.ideaItem, { color: colors.textSecondary }]}>3:33 • school pickup • unlock door</Text>
                    <Text style={[styles.ideaItem, { color: colors.textSecondary }]}>feed pets • do dishes • pour wine</Text>
                    <Text style={[styles.ideaItem, { color: colors.textSecondary }]}>charge phone • wash face</Text>
                </View>

                <View style={styles.sectionsContainer}>
                    {renderSection('morning', 'Rise', Sun, 'Coffee', '#FFA500')} {/* Orange Sun */}
                    {renderSection('midday', 'Reset', Coffee, 'Lunch', '#FF8C00')} {/* Orange Coffee */}
                    {renderSection('evening', 'Rest', Moon, 'Dinner', '#FFD700')} {/* Yellow Moon */}
                </View>

                <ShimmerButton
                    title={loading ? "Saving..." : "Start Journey"}
                    onPress={handleFinish}
                    style={styles.btn}
                    icon={Leaf}
                />

                {/* Android Picker Logic */}
                {showPicker && Platform.OS !== 'ios' && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={parseTime(habitLinks[showPicker as 'morning' | 'midday' | 'evening'].time)}
                        mode="time"
                        is24Hour={false} // Force 12h
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}

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
        padding: 20,
        paddingTop: 0,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: -40,
    },
    logo: {
        width: 250,
        height: 180,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    headerDesc: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    ideasContainer: {
        marginBottom: 20,
        alignItems: 'center',
        gap: 4,
    },
    ideaItem: {
        fontSize: 12,
        fontStyle: 'italic',
        opacity: 0.8,
    },
    sectionsContainer: {
        gap: 20,
        marginBottom: 30,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardBody: {
        marginTop: 10,
        gap: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    input: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        padding: 4,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    toggleText: {
        fontWeight: '600',
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
    },
    btn: {
        marginBottom: 40,
    }
});
