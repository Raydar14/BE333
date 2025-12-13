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
        if (Platform.OS === 'web') {
            console.log('Push notifications behavior on web varies by browser/PWA status.');
            // On web, we might check Notification.permission directly or let expo handle it.
            // But often expo-notifications requires a service worker. 
            // Return false for now to avoid crashes if web setup isn't complete.
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            try {
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
            } catch (error) {
                console.error("Error registering for push notifications:", error);
                return false;
            }
        } else {
            console.log('Must use physical device for Push Notifications');
            return false;
        }
    },

    async scheduleHabitReminder(id: string, title: string, body: string, hour: number, minute: number) {
        try {
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
        } catch (error) {
            console.log("Error scheduling notification:", error);
            return null;
        }
    },

    async cancelAllNotifications() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.log("Error canceling notifications:", error);
        }
    },

    async cancelNotification(notificationId: string) {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            console.log("Error canceling notification:", error);
        }
    },

    async snooze30Min(title: string, body: string) {
        try {
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
        } catch (error) {
            console.log("Error snoozing:", error);
            return null;
        }
    },

    async snoozeAllDay() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.log("Error snoozing all day:", error);
        }
    }
};
