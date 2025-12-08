
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
    timerDuration: number;
    habitCue: string;
    setTimerDuration: (seconds: number) => void;
    setHabitCue: (cue: string) => void;
};

const SettingsContext = createContext<SettingsContextType>({
    timerDuration: 180, // Default 3 mins
    habitCue: '',
    setTimerDuration: () => { },
    setHabitCue: () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [timerDuration, setTimerDurationState] = useState(180);
    const [habitCue, setHabitCueState] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const storedDuration = await AsyncStorage.getItem('settings_timerDuration');
            const storedCue = await AsyncStorage.getItem('settings_habitCue');

            if (storedDuration) setTimerDurationState(parseInt(storedDuration));
            if (storedCue) setHabitCueState(storedCue);
        } catch (e) {
            console.error('Failed to load settings', e);
        }
    }

    async function setTimerDuration(seconds: number) {
        setTimerDurationState(seconds);
        await AsyncStorage.setItem('settings_timerDuration', seconds.toString());
    }

    async function setHabitCue(cue: string) {
        setHabitCueState(cue);
        await AsyncStorage.setItem('settings_habitCue', cue);
    }

    return (
        <SettingsContext.Provider value={{ timerDuration, habitCue, setTimerDuration, setHabitCue }}>
            {children}
        </SettingsContext.Provider>
    );
}
