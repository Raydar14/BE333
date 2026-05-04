import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export interface SocialLinks {
    tiktok?: string;
    facebook?: string;
    instagram?: string;
}

export type NotificationMethod = 'push' | 'sms' | 'email' | 'none';

type SettingsContextType = {
    timerDuration: number;
    setTimerDuration: (duration: number) => void;
    habitCue: string;
    setHabitCue: (cue: string) => void;
    showHabitStacking: boolean;
    setShowHabitStacking: (show: boolean) => void;
    timerMode: 'countdown' | 'open';
    setTimerMode: (mode: 'countdown' | 'open') => void;
    habitLinks: HabitLinks;
    updateHabitLink: (period: keyof HabitLinks, link: HabitLinkConfig) => void;
    notificationMethod: NotificationMethod;
    setNotificationMethod: (method: NotificationMethod) => void;
    snoozeUntil: number | null;
    isSnoozed: boolean;
    setSnoozeUntil: (until: number | null) => void;
    showBreathingGuide: boolean;
    setShowBreathingGuide: (show: boolean) => void;
    showNatureVisuals: boolean;
    setShowNatureVisuals: (show: boolean) => void;
    socialLinks: SocialLinks;
    updateSocialLink: (platform: keyof SocialLinks, handle: string) => void;
    breathingPattern: '4-1-6' | '3-1-5';
    setBreathingPattern: (pattern: '4-1-6' | '3-1-5') => void;
    deep3Enabled: boolean;
    setDeep3Enabled: (enabled: boolean) => void;
    deep3Duration: number;
    setDeep3Duration: (duration: number) => void;
    showBreathingLotus: boolean;
    setShowBreathingLotus: (show: boolean) => void;
    bellyVisualGender: 'male' | 'female';
    setBellyVisualGender: (gender: 'male' | 'female') => void;
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
    showBreathingGuide: true,
    setShowBreathingGuide: () => { },
    showNatureVisuals: true,
    setShowNatureVisuals: () => { },
    showHabitStacking: true,
    setShowHabitStacking: () => { },
    timerMode: 'countdown',
    setTimerMode: () => { },
    socialLinks: {},
    updateSocialLink: () => { },
    breathingPattern: '4-1-6',
    setBreathingPattern: () => { },
    deep3Enabled: true,
    setDeep3Enabled: () => { },
    deep3Duration: 15,
    setDeep3Duration: () => { },
    showBreathingLotus: false,
    setShowBreathingLotus: () => { },
    bellyVisualGender: 'female',
    setBellyVisualGender: () => { },
});

export const useSettings = () => useContext(SettingsContext);

async function persist(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.warn(`Failed to persist setting "${key}":`, e);
    }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [timerDuration, setTimerDurationState] = useState(180);
    const [habitCue, setHabitCueState] = useState('');
    const [habitLinks, setHabitLinks] = useState<HabitLinks>(defaultHabitLinks);
    const [notificationMethod, setNotificationMethodState] = useState<NotificationMethod>('push');
    const [snoozeUntil, setSnoozeUntilState] = useState<number | null>(null);
    const [showBreathingGuide, setShowBreathingGuideState] = useState(true);
    const [showNatureVisuals, setShowNatureVisualsState] = useState(true);
    const [showHabitStacking, setShowHabitStackingState] = useState(true);
    const [timerMode, setTimerModeState] = useState<'countdown' | 'open'>('countdown');
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
    const [breathingPattern, setBreathingPatternState] = useState<'4-1-6' | '3-1-5'>('4-1-6');
    const [deep3Enabled, setDeep3EnabledState] = useState(true);
    const [deep3Duration, setDeep3DurationState] = useState(15);
    const [showBreathingLotus, setShowBreathingLotusState] = useState(false);
    const [bellyVisualGender, setBellyVisualGenderState] = useState<'male' | 'female'>('female');

    const isSnoozed = snoozeUntil !== null && Date.now() < snoozeUntil;

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const keys = [
                'timerDuration', 'habitCue', 'habitLinks', 'notificationMethod',
                'snoozeUntil', 'showBreathingGuide', 'showNatureVisuals', 'showHabitStacking',
                'timerMode', 'socialLinks', 'breathingPattern', 'deep3Enabled',
                'deep3Duration', 'showBreathingLotus', 'bellyVisualGender',
            ] as const;

            const values = await AsyncStorage.multiGet(keys);
            const map = Object.fromEntries(values.map(([k, v]) => [k, v]));

            if (map.timerDuration) setTimerDurationState(parseInt(map.timerDuration, 10));
            if (map.habitCue) setHabitCueState(map.habitCue);
            if (map.habitLinks) setHabitLinks(JSON.parse(map.habitLinks));
            if (map.notificationMethod) setNotificationMethodState(map.notificationMethod as NotificationMethod);
            if (map.snoozeUntil) {
                const val = parseInt(map.snoozeUntil, 10);
                if (val > Date.now()) setSnoozeUntilState(val);
                else AsyncStorage.removeItem('snoozeUntil').catch(() => { });
            }
            if (map.showBreathingGuide !== null) setShowBreathingGuideState(JSON.parse(map.showBreathingGuide!));
            if (map.showNatureVisuals !== null) setShowNatureVisualsState(JSON.parse(map.showNatureVisuals!));
            if (map.showHabitStacking !== null) setShowHabitStackingState(JSON.parse(map.showHabitStacking!));
            if (map.timerMode) setTimerModeState(map.timerMode as 'countdown' | 'open');
            if (map.socialLinks) setSocialLinks(JSON.parse(map.socialLinks));
            if (map.breathingPattern) setBreathingPatternState(map.breathingPattern as '4-1-6' | '3-1-5');
            if (map.deep3Enabled !== null) setDeep3EnabledState(JSON.parse(map.deep3Enabled!));
            if (map.deep3Duration) setDeep3DurationState(parseInt(map.deep3Duration, 10));
            if (map.showBreathingLotus !== null) setShowBreathingLotusState(JSON.parse(map.showBreathingLotus!));
            if (map.bellyVisualGender) setBellyVisualGenderState(map.bellyVisualGender as 'male' | 'female');
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    };

    const setTimerDuration = useCallback((duration: number) => {
        setTimerDurationState(duration);
        persist('timerDuration', duration.toString());
    }, []);

    const setHabitCue = useCallback((cue: string) => {
        setHabitCueState(cue);
        persist('habitCue', cue);
    }, []);

    const updateHabitLink = useCallback((period: keyof HabitLinks, link: HabitLinkConfig) => {
        setHabitLinks(prev => {
            const newLinks = { ...prev, [period]: link };
            persist('habitLinks', JSON.stringify(newLinks));
            return newLinks;
        });
    }, []);

    const setNotificationMethod = useCallback((method: NotificationMethod) => {
        setNotificationMethodState(method);
        persist('notificationMethod', method);
    }, []);

    const setSnoozeUntil = useCallback((until: number | null) => {
        setSnoozeUntilState(until);
        if (until) {
            persist('snoozeUntil', until.toString());
        } else {
            AsyncStorage.removeItem('snoozeUntil').catch(e => console.warn('Failed to clear snooze:', e));
        }
    }, []);

    const setShowBreathingGuide = useCallback((show: boolean) => {
        setShowBreathingGuideState(show);
        persist('showBreathingGuide', JSON.stringify(show));
    }, []);

    const setShowNatureVisuals = useCallback((show: boolean) => {
        setShowNatureVisualsState(show);
        persist('showNatureVisuals', JSON.stringify(show));
    }, []);

    const setShowHabitStacking = useCallback((show: boolean) => {
        setShowHabitStackingState(show);
        persist('showHabitStacking', JSON.stringify(show));
    }, []);

    const setTimerMode = useCallback((mode: 'countdown' | 'open') => {
        setTimerModeState(mode);
        persist('timerMode', mode);
    }, []);

    const updateSocialLink = useCallback((platform: keyof SocialLinks, handle: string) => {
        setSocialLinks(prev => {
            const newLinks = { ...prev, [platform]: handle };
            persist('socialLinks', JSON.stringify(newLinks));
            return newLinks;
        });
    }, []);

    const setBreathingPattern = useCallback((pattern: '4-1-6' | '3-1-5') => {
        setBreathingPatternState(pattern);
        persist('breathingPattern', pattern);
    }, []);

    const setDeep3Enabled = useCallback((enabled: boolean) => {
        setDeep3EnabledState(enabled);
        persist('deep3Enabled', JSON.stringify(enabled));
    }, []);

    const setDeep3Duration = useCallback((duration: number) => {
        setDeep3DurationState(duration);
        persist('deep3Duration', duration.toString());
    }, []);

    const setShowBreathingLotus = useCallback((show: boolean) => {
        setShowBreathingLotusState(show);
        persist('showBreathingLotus', JSON.stringify(show));
    }, []);

    const setBellyVisualGender = useCallback((gender: 'male' | 'female') => {
        setBellyVisualGenderState(gender);
        persist('bellyVisualGender', gender);
    }, []);

    const value = useMemo(() => ({
        timerDuration, setTimerDuration,
        habitCue, setHabitCue,
        habitLinks, updateHabitLink,
        notificationMethod, setNotificationMethod,
        snoozeUntil, isSnoozed, setSnoozeUntil,
        showBreathingGuide, setShowBreathingGuide,
        showNatureVisuals, setShowNatureVisuals,
        showHabitStacking, setShowHabitStacking,
        timerMode, setTimerMode,
        socialLinks, updateSocialLink,
        breathingPattern, setBreathingPattern,
        deep3Enabled, setDeep3Enabled,
        deep3Duration, setDeep3Duration,
        showBreathingLotus, setShowBreathingLotus,
        bellyVisualGender, setBellyVisualGender,
    }), [
        timerDuration, habitCue, habitLinks, notificationMethod,
        snoozeUntil, isSnoozed, showBreathingGuide, showNatureVisuals,
        showHabitStacking, timerMode, socialLinks, breathingPattern,
        deep3Enabled, deep3Duration, showBreathingLotus, bellyVisualGender,
        setTimerDuration, setHabitCue, updateHabitLink, setNotificationMethod,
        setSnoozeUntil, setShowBreathingGuide, setShowNatureVisuals, setShowHabitStacking,
        setTimerMode, updateSocialLink, setBreathingPattern, setDeep3Enabled,
        setDeep3Duration, setShowBreathingLotus, setBellyVisualGender,
    ]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
