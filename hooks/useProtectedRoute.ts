
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export function useProtectedRoute() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        // Ensure segments are available before making decisions
        if (!segments || segments.length === 0 && segments[0] !== '(auth)') {
            // If segments is empty, we are likely at root '/' or initializing.
            // We can check user status but usually root is public or handles its own logic.
            // However, to be safe, we guard against undefined segments.
        }

        const inAuthGroup = segments[0] === '(auth)';
        const inDashboard = segments[0] === 'dashboard';

        // console.log('[ProtectedRoute] Check:', { user: !!user, segments, inAuthGroup, inDashboard });

        if (!user && inDashboard) {
            // Redirect unauthenticated users trying to access protected Dashboard
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // Redirect authenticated users away from auth screens (login/signup) to Home
            router.replace('/');
        }
    }, [user, loading, segments, navigationState?.key]);
}
