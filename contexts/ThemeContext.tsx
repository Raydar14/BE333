
import React, { createContext, useContext, useState, useEffect } from 'react';
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
            console.error('Failed to load theme', e);
        }
    }

    async function setPrimaryColor(color: string) {
        const newColors = { ...colors, primary: color };
        setColors(newColors);
        await AsyncStorage.setItem('theme_primary', color);
    }

    async function setSecondaryColor(color: string) {
        const newColors = { ...colors, secondary: color };
        setColors(newColors);
        await AsyncStorage.setItem('theme_secondary', color);
    }

    async function resetTheme() {
        setColors(DefaultColors);
        await AsyncStorage.multiRemove(['theme_primary', 'theme_secondary']);
    }

    return (
        <ThemeContext.Provider value={{ colors, setPrimaryColor, setSecondaryColor, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
