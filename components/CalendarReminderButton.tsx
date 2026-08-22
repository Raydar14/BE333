import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { buildRemindersIcs, downloadIcsWeb } from '../lib/icsReminders';

// Web-only fallback for the missing push-notification path. Reads the
// three habit-link times the user set in onboarding, generates a .ics
// calendar file with three daily recurring events (Rise / Reset / Rest),
// and triggers a download. The user then opens the file in Google
// Calendar / Apple Calendar / Outlook and those apps do the actual
// reminding — which they're much better at than a browser tab.
//
// On native, `Platform.OS !== 'web'` and this button is inert but
// visible; the native path uses expo-notifications directly.

interface CalendarReminderButtonProps {
    colors: {
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
        surface: string;
        background: string;
    };
}

type Status = 'idle' | 'success' | 'empty' | 'error' | 'native';

export function CalendarReminderButton({ colors }: CalendarReminderButtonProps) {
    const { habitLinks } = useSettings();
    const { user } = useAuth();
    const [status, setStatus] = useState<Status>('idle');

    const onPress = () => {
        if (Platform.OS !== 'web') {
            setStatus('native');
            return;
        }
        const ics = buildRemindersIcs(habitLinks, {
            calendarName: 'BE333 · Rise · Reset · Rest',
            ownerId: user?.uid,
        });
        if (!ics) {
            setStatus('empty');
            return;
        }
        const ok = downloadIcsWeb(ics);
        setStatus(ok ? 'success' : 'error');
    };

    return (
        <View>
            <TouchableOpacity
                style={[
                    styles.button,
                    { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <CalendarDays size={18} color={colors.primary} />
                <Text style={[styles.buttonLabel, { color: colors.text }]}>
                    Download calendar reminders
                </Text>
            </TouchableOpacity>

            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Adds three recurring daily events (Rise, Reset, Rest) at the times you chose to
                any calendar app that opens .ics files — Google Calendar, Apple Calendar,
                Outlook. Times follow your local wall clock, so an 8am reminder stays at 8am
                wherever you are.
            </Text>

            {status === 'success' && (
                <Text style={[styles.statusOk, { color: colors.primary }]}>
                    Downloaded. Open the file in your calendar app to add the reminders.
                </Text>
            )}
            {status === 'empty' && (
                <Text style={styles.statusWarn}>
                    No reminder times are set yet. Finish onboarding (or set them here) first.
                </Text>
            )}
            {status === 'native' && (
                <Text style={[styles.statusOk, { color: colors.textSecondary }]}>
                    On the mobile app the reminders come as push notifications instead — no
                    calendar file needed.
                </Text>
            )}
            {status === 'error' && (
                <Text style={styles.statusWarn}>
                    Couldn't generate the download. Try again in a moment.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    hint: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 8,
    },
    statusOk: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
    },
    statusWarn: {
        fontSize: 13,
        marginTop: 8,
        color: '#FF3B30',
    },
});
