import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="morning" />
            <Stack.Screen name="midday" />
            <Stack.Screen name="evening" />
            <Stack.Screen name="review" />
        </Stack>
    );
}
