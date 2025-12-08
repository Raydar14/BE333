import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings, NotificationMethod } from '../contexts/SettingsContext';
import { Bell, MessageCircle, Mail, BellOff } from 'lucide-react-native';

const OPTIONS: { method: NotificationMethod; label: string; Icon: any }[] = [
    { method: 'push', label: 'Push', Icon: Bell },
    { method: 'sms', label: 'SMS', Icon: MessageCircle },
    { method: 'email', label: 'Email', Icon: Mail },
    { method: 'none', label: 'Off', Icon: BellOff },
];

export function NotificationPreferencesCard() {
    const { colors } = useTheme();
    const { notificationMethod, setNotificationMethod } = useSettings();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Notification Method</Text>
            <View style={styles.row}>
                {OPTIONS.map(({ method, label, Icon }) => {
                    const selected = notificationMethod === method;
                    return (
                        <TouchableOpacity
                            key={method}
                            style={[
                                styles.option,
                                { borderColor: selected ? colors.primary : colors.border },
                                selected && { backgroundColor: colors.primary + '22' }
                            ]}
                            onPress={() => setNotificationMethod(method)}
                        >
                            <Icon size={20} color={selected ? colors.primary : colors.textSecondary} />
                            <Text style={[styles.label, { color: selected ? colors.primary : colors.textSecondary }]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        justifyContent: 'space-between',
    },
    option: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        marginHorizontal: 3,
    },
    label: {
        fontSize: 11,
        marginTop: 4,
    },
});
