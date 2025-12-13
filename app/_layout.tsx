import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import { PurchaseProvider } from '../contexts/PurchaseContext';
import { BiofeedbackProvider } from '../contexts/BiofeedbackContext';


export default function RootLayout() {
    return (
        <AuthProvider>
            <PurchaseProvider>
                <SettingsProvider>
                    <ThemeProvider>
                        <BiofeedbackProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                                <Stack.Screen name="dashboard" />
                                <Stack.Screen name="settings" options={{ headerShown: false }} />
                            </Stack>
                            <StatusBar style="auto" />
                        </BiofeedbackProvider>
                    </ThemeProvider>
                </SettingsProvider>
            </PurchaseProvider>
        </AuthProvider>
    );
}
