
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors as DefaultColors } from '../constants/Colors';

type ColorScheme = typeof DefaultColors;

type ThemeContextType = {
    colors: ColorScheme;
    setPrimaryColor: (color: string) => void;
    setSecondaryColor: (color: string) => void;
    resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    colors: DefaultColors,
    setPrimaryColor: () => { },
    setSecondaryColor: () => { },
    resetTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [colors, setColors] = useState<ColorScheme>(DefaultColors);

    useEffect(() => {
        loadTheme();
    }, []);

    async function loadTheme() {
        try {
            const storedPrimary = await AsyncStorage.getItem('theme_primary');
            const storedSecondary = await AsyncStorage.getItem('theme_secondary');

            if (storedPrimary || storedSecondary) {
                setColors(prev => ({
                    ...prev,
                    primary: storedPrimary || prev.primary,
                    secondary: storedSecondary || prev.secondary,
                }));
            }
        } catch (e) {
            console.warn('Failed to load theme:', e);
        }
    }

    const setPrimaryColor = useCallback(async (color: string) => {
        setColors(prev => ({ ...prev, primary: color }));
        try {
            await AsyncStorage.setItem('theme_primary', color);
        } catch (e) {
            console.warn('Failed to save primary color:', e);
        }
    }, []);

    const setSecondaryColor = useCallback(async (color: string) => {
        setColors(prev => ({ ...prev, secondary: color }));
        try {
            await AsyncStorage.setItem('theme_secondary', color);
        } catch (e) {
            console.warn('Failed to save secondary color:', e);
        }
    }, []);

    const resetTheme = useCallback(async () => {
        setColors(DefaultColors);
        try {
            await AsyncStorage.multiRemove(['theme_primary', 'theme_secondary']);
        } catch (e) {
            console.warn('Failed to reset theme:', e);
        }
    }, []);

    const value = useMemo(
        () => ({ colors, setPrimaryColor, setSecondaryColor, resetTheme }),
        [colors, setPrimaryColor, setSecondaryColor, resetTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
