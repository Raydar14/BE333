
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState, usePathname } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export function useProtectedRoute() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();
    const pathname = usePathname();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inDashboard = segments[0] === 'dashboard';

        // Prevent loops: Only redirect if we are not already at the destination conceptually
        if (!user && inDashboard) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // If user is logged in, they shouldn't be on auth pages
            // But check if we are already at root to avoid reload loops
            if (pathname !== '/') {
                router.replace('/');
            }
        }
    }, [user, loading, segments, navigationState?.key, pathname]);
}
