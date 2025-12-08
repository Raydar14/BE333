import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// [NEW] Habit Linking Interfaces
export interface HabitLinkConfig {
    anchor: string;
    relation: 'before' | 'after';
    time: string; // HH:mm
    enabled: boolean;
}

export interface HabitLinks {
    morning: HabitLinkConfig;
    midday: HabitLinkConfig;
    evening: HabitLinkConfig;
}

export type NotificationMethod = 'push' | 'sms' | 'email' | 'none';

type SettingsContextType = {
    timerDuration: number;
    setTimerDuration: (duration: number) => void;
    habitCue: string;
    setHabitCue: (cue: string) => void;

    // Habit Links
    habitLinks: HabitLinks;
    updateHabitLink: (period: keyof HabitLinks, link: HabitLinkConfig) => void;

    // Notification preferences
    notificationMethod: NotificationMethod;
    setNotificationMethod: (method: NotificationMethod) => void;

    // Snooze
    snoozeUntil: number | null; // Unix timestamp when snooze expires, or null
    isSnoozed: boolean;
    setSnoozeUntil: (until: number | null) => void;
};

const defaultHabitLinks: HabitLinks = {
    morning: { anchor: 'Coffee', relation: 'before', time: '08:00', enabled: true },
    midday: { anchor: 'Lunch', relation: 'after', time: '13:00', enabled: true },
    evening: { anchor: 'Dinner', relation: 'after', time: '20:00', enabled: true },
};

const SettingsContext = createContext<SettingsContextType>({
    timerDuration: 180,
    setTimerDuration: () => { },
    habitCue: '',
    setHabitCue: () => { },
    habitLinks: defaultHabitLinks,
    updateHabitLink: () => { },
    notificationMethod: 'push',
    setNotificationMethod: () => { },
    snoozeUntil: null,
    isSnoozed: false,
    setSnoozeUntil: () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [timerDuration, setTimerDurationState] = useState(180);
    const [habitCue, setHabitCueState] = useState('');
    const [habitLinks, setHabitLinks] = useState<HabitLinks>(defaultHabitLinks);
    const [notificationMethod, setNotificationMethodState] = useState<NotificationMethod>('push');
    const [snoozeUntil, setSnoozeUntilState] = useState<number | null>(null);

    // Computed: are we currently snoozed?
    const isSnoozed = snoozeUntil !== null && Date.now() < snoozeUntil;

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedDuration = await AsyncStorage.getItem('timerDuration');
            if (savedDuration) setTimerDurationState(parseInt(savedDuration));

            const savedCue = await AsyncStorage.getItem('habitCue');
            if (savedCue) setHabitCueState(savedCue);

            // Load HabitLinks
            const savedLinks = await AsyncStorage.getItem('habitLinks');
            if (savedLinks) setHabitLinks(JSON.parse(savedLinks));

            // Load notification method
            const savedMethod = await AsyncStorage.getItem('notificationMethod');
            if (savedMethod) setNotificationMethodState(savedMethod as NotificationMethod);

            // Load snooze
            const savedSnooze = await AsyncStorage.getItem('snoozeUntil');
            if (savedSnooze) {
                const val = parseInt(savedSnooze);
                // Only restore if still valid
                if (val > Date.now()) setSnoozeUntilState(val);
                else await AsyncStorage.removeItem('snoozeUntil');
            }

        } catch (e) {
            console.error('Failed to load settings', e);
        }
    };

    const setTimerDuration = async (duration: number) => {
        setTimerDurationState(duration);
        await AsyncStorage.setItem('timerDuration', duration.toString());
    };

    const setHabitCue = async (cue: string) => {
        setHabitCueState(cue);
        await AsyncStorage.setItem('habitCue', cue);
    };

    const updateHabitLink = async (period: keyof HabitLinks, link: HabitLinkConfig) => {
        const newLinks = { ...habitLinks, [period]: link };
        setHabitLinks(newLinks);
        await AsyncStorage.setItem('habitLinks', JSON.stringify(newLinks));
    };

    const setNotificationMethod = async (method: NotificationMethod) => {
        setNotificationMethodState(method);
        await AsyncStorage.setItem('notificationMethod', method);
    };

    const setSnoozeUntil = async (until: number | null) => {
        setSnoozeUntilState(until);
        if (until) {
            await AsyncStorage.setItem('snoozeUntil', until.toString());
        } else {
            await AsyncStorage.removeItem('snoozeUntil');
        }
    };

    return (
        <SettingsContext.Provider value={{
            timerDuration,
            setTimerDuration,
            habitCue,
            setHabitCue,
            habitLinks,
            updateHabitLink,
            notificationMethod,
            setNotificationMethod,
            snoozeUntil,
            isSnoozed,
            setSnoozeUntil
        }}>
            {children}
        </SettingsContext.Provider>
    );
}
