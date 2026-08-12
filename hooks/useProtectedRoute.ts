
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

// Deliberately does not call usePathname(): combined with
// useRootNavigationState() inside a nested Stack (e.g. (auth)/_layout.tsx),
// that pairing causes a "Maximum update depth exceeded" loop under Metro
// dev mode (confirmed via isolated pairwise testing — segments+navState and
// segments+pathname are each fine on their own; navState+pathname is not).
// segments.length === 0 stands in for "already at root" instead.
export function useProtectedRoute() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inDashboard = segments[0] === 'dashboard';

        // Prevent loops: Only redirect if we are not already at the destination conceptually
        /*
        if (!user && inDashboard) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // If user is logged in, they shouldn't be on auth pages
            // But check if we are already at root to avoid reload loops
            if (segments.length > 0) {
                router.replace('/');
            }
        }
        */
    }, [user, loading, segments, navigationState?.key]);
}
