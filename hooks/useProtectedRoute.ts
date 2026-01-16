
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
        if (loading) return;
        if (!navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inProtectedGroup = segments[0] === 'dashboard' || segments[0] === 'settings' || segments[0] === 'habit-stack';

        console.log('[useProtectedRoute] Check:', {
            hasUser: !!user,
            path: pathname,
            segment: segments[0],
            inAuth: inAuthGroup,
            inProtected: inProtectedGroup
        });

        // Prevent loops: Only redirect if we are not already at the destination conceptually
        if (!user && inProtectedGroup) {
            console.log('[useProtectedRoute] Redirecting to Login');
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // If user is logged in, they shouldn't be on auth pages
            // But check if we are already at root to avoid reload loops
            if (pathname !== '/') {
                console.log('[useProtectedRoute] Redirecting to Home');
                router.replace('/');
            }
        }
    }, [user, loading, segments, navigationState?.key, pathname]);
}
