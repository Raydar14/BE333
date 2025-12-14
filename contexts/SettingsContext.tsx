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

    // Habit Links
    habitLinks: HabitLinks;
    updateHabitLink: (period: keyof HabitLinks, link: HabitLinkConfig) => void;

    // Notification preferences
    notificationMethod: NotificationMethod;
    setNotificationMethod: (method: NotificationMethod) => void;

    // Snooze
    snoozeUntil: number | null;
    isSnoozed: boolean;
    setSnoozeUntil: (until: number | null) => void;

    // Breathing Guide
    showBreathingGuide: boolean;
    setShowBreathingGuide: (show: boolean) => void;

    // Nature/Flower Visuals
    showNatureVisuals: boolean; // Controls the Lotus + Flowers
    setShowNatureVisuals: (show: boolean) => void;

    // Social Links
    socialLinks: SocialLinks;
    updateSocialLink: (platform: keyof SocialLinks, handle: string) => void;

    // Breathing Pattern
    breathingPattern: '4-1-6' | '3-1-5';
    setBreathingPattern: (pattern: '4-1-6' | '3-1-5') => void;

    // DEEP3 Start
    deep3Enabled: boolean;
    setDeep3Enabled: (enabled: boolean) => void;
    deep3Duration: number; // 15 or 20
    setDeep3Duration: (duration: number) => void;

    // Visual Options
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

            // Load Breathing Guide
            const savedGuide = await AsyncStorage.getItem('showBreathingGuide');
            if (savedGuide !== null) setShowBreathingGuideState(JSON.parse(savedGuide));

            // Load Nature Visuals
            const savedNature = await AsyncStorage.getItem('showNatureVisuals');
            if (savedNature !== null) setShowNatureVisualsState(JSON.parse(savedNature));

            const savedStacking = await AsyncStorage.getItem('showHabitStacking');
            if (savedStacking !== null) setShowHabitStackingState(JSON.parse(savedStacking));

            const savedTimerMode = await AsyncStorage.getItem('timerMode');
            if (savedTimerMode) setTimerModeState(savedTimerMode as 'countdown' | 'open');

            // Load Social Links
            const savedSocials = await AsyncStorage.getItem('socialLinks');
            if (savedSocials) setSocialLinks(JSON.parse(savedSocials));

            // Load Breathing Settings
            const savedPattern = await AsyncStorage.getItem('breathingPattern');
            if (savedPattern) setBreathingPatternState(savedPattern as '4-1-6' | '3-1-5');

            const savedDeep3 = await AsyncStorage.getItem('deep3Enabled');
            if (savedDeep3 !== null) setDeep3EnabledState(JSON.parse(savedDeep3));

            const savedDeep3Dur = await AsyncStorage.getItem('deep3Duration');
            if (savedDeep3Dur) setDeep3DurationState(parseInt(savedDeep3Dur));

            // Load Visual Options
            const savedLotus = await AsyncStorage.getItem('showBreathingLotus');
            if (savedLotus !== null) setShowBreathingLotusState(JSON.parse(savedLotus));

            const savedGender = await AsyncStorage.getItem('bellyVisualGender');
            if (savedGender) setBellyVisualGenderState(savedGender as 'male' | 'female');

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

    const setShowBreathingGuide = async (show: boolean) => {
        setShowBreathingGuideState(show);
        await AsyncStorage.setItem('showBreathingGuide', JSON.stringify(show));
    };

    const setShowNatureVisuals = async (show: boolean) => {
        setShowNatureVisualsState(show);
        await AsyncStorage.setItem('showNatureVisuals', JSON.stringify(show));
    };

    const setShowHabitStacking = async (show: boolean) => {
        setShowHabitStackingState(show);
        await AsyncStorage.setItem('showHabitStacking', JSON.stringify(show));
    };

    const setTimerMode = async (mode: 'countdown' | 'open') => {
        setTimerModeState(mode);
        await AsyncStorage.setItem('timerMode', mode);
    };

    const updateSocialLink = async (platform: keyof SocialLinks, handle: string) => {
        const newLinks = { ...socialLinks, [platform]: handle };
        setSocialLinks(newLinks);
        await AsyncStorage.setItem('socialLinks', JSON.stringify(newLinks));
    };

    const setBreathingPattern = async (pattern: '4-1-6' | '3-1-5') => {
        setBreathingPatternState(pattern);
        await AsyncStorage.setItem('breathingPattern', pattern);
    };

    const setDeep3Enabled = async (enabled: boolean) => {
        setDeep3EnabledState(enabled);
        await AsyncStorage.setItem('deep3Enabled', JSON.stringify(enabled));
    };

    const setDeep3Duration = async (duration: number) => {
        setDeep3DurationState(duration);
        await AsyncStorage.setItem('deep3Duration', duration.toString());
    };

    const setShowBreathingLotus = async (show: boolean) => {
        setShowBreathingLotusState(show);
        await AsyncStorage.setItem('showBreathingLotus', JSON.stringify(show));
    };

    const setBellyVisualGender = async (gender: 'male' | 'female') => {
        setBellyVisualGenderState(gender);
        await AsyncStorage.setItem('bellyVisualGender', gender);
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
            setSnoozeUntil,
            showBreathingGuide,
            setShowBreathingGuide,
            showNatureVisuals,
            setShowNatureVisuals,
            showHabitStacking,
            setShowHabitStacking,
            timerMode,
            setTimerMode,
            socialLinks,
            updateSocialLink,
            breathingPattern,
            setBreathingPattern,
            deep3Enabled,
            setDeep3Enabled,
            deep3Duration,
            setDeep3Duration,
            showBreathingLotus,
            setShowBreathingLotus,
            bellyVisualGender,
            setBellyVisualGender
        }}>
            {children}
        </SettingsContext.Provider>
    );
}
