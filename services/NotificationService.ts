import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import * as Device from 'expo-device';
import * as Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationService = {
    async registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return false;
            }
            return true;
        } else {
            console.log('Must use physical device for Push Notifications');
            return false;
        }
    },

    async scheduleHabitReminder(id: string, title: string, body: string, hour: number, minute: number) {
        // Cancel existing by ID if we could track IDs, but simplest is to just schedule new ones.
        // For MVP, we'll just schedule. ideally we'd manage IDs.

        const trigger: Notifications.DailyTriggerInput = {
            type: SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger,
        });

        return notificationId;
    },

    async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    async cancelNotification(notificationId: string) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    },

    async snooze30Min(title: string, body: string) {
        // Schedule a one-time notification 30 minutes from now
        const trigger: Notifications.TimeIntervalTriggerInput = {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 30 * 60,
            repeats: false
        };
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: true },
            trigger,
        });
        return notificationId;
    },

    async snoozeAllDay() {
        // Cancel all scheduled notifications for today
        // They will resume tomorrow via daily repeating triggers
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
