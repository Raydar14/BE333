
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export function useProtectedRoute() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inDashboard = segments[0] === 'dashboard';

        if (!user && inDashboard) {
            // Redirect unauthenticated users trying to access protected Dashboard
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // Redirect authenticated users away from auth screens (login/signup) to Home
            router.replace('/');
        }
    }, [user, loading, segments]);
}
