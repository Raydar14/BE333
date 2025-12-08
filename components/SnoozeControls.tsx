import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { NotificationService } from '../services/NotificationService';
import { Clock, Moon } from 'lucide-react-native';

export function SnoozeControls() {
    const { colors } = useTheme();
    const { isSnoozed, snoozeUntil, setSnoozeUntil } = useSettings();

    const handleSnooze30 = async () => {
        const until = Date.now() + 30 * 60 * 1000;
        await setSnoozeUntil(until);
        await NotificationService.snooze30Min('BE Reminder', 'Time to take your pause.');
        Alert.alert('Snoozed', 'Reminders paused for 30 minutes.');
    };

    const handleSnoozeAllDay = async () => {
        // Set snooze until midnight tonight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        await setSnoozeUntil(midnight.getTime());
        await NotificationService.snoozeAllDay();
        Alert.alert('Snoozed', 'All reminders paused until tomorrow.');
    };

    const handleClearSnooze = async () => {
        await setSnoozeUntil(null);
        Alert.alert('Snooze Cleared', 'Reminders are active again.');
    };

    const formatSnoozeTime = () => {
        if (!snoozeUntil) return '';
        const d = new Date(snoozeUntil);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Snooze Reminders</Text>

            {isSnoozed ? (
                <View>
                    <Text style={[styles.status, { color: colors.textSecondary }]}>
                        Snoozed until {formatSnoozeTime()}
                    </Text>
                    <TouchableOpacity
                        style={[styles.clearBtn, { borderColor: colors.primary }]}
                        onPress={handleClearSnooze}
                    >
                        <Text style={{ color: colors.primary }}>Clear Snooze</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.btn, { borderColor: colors.secondary }]}
                        onPress={handleSnooze30}
                    >
                        <Clock size={18} color={colors.secondary} />
                        <Text style={[styles.btnText, { color: colors.text }]}>30 min</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, { borderColor: colors.secondary }]}
                        onPress={handleSnoozeAllDay}
                    >
                        <Moon size={18} color={colors.secondary} />
                        <Text style={[styles.btnText, { color: colors.text }]}>All Day</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '500',
    },
    status: {
        textAlign: 'center',
        marginBottom: 10,
    },
    clearBtn: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
});
