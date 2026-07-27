import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useGuideLink } from './useBeGuide';

// Pre-signup invite handoff.
//
// Guides share deep links like https://be333.app/signup?invite=AB2CDE9F.
// Signup pages call stashPendingInvite() as soon as they mount so the code
// survives the auth handoff. After the new user lands on Home, usePendingInviteConsumer()
// finds the stashed code, redeems it via linkGuideByCode, and clears the flag.
//
// The flag is stored plaintext (AsyncStorage) — invite codes are not secrets
// once shared; the guide who created the code can revoke it any time.

const PENDING_KEY = 'pendingInviteCode';

export async function stashPendingInvite(code: string | undefined | null): Promise<void> {
    const clean = (code || '').trim().toUpperCase();
    if (!clean) return;
    try {
        await AsyncStorage.setItem(PENDING_KEY, clean);
    } catch (e) {
        console.warn('stashPendingInvite failed:', e);
    }
}

export async function readPendingInvite(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(PENDING_KEY);
    } catch {
        return null;
    }
}

export async function clearPendingInvite(): Promise<void> {
    try {
        await AsyncStorage.removeItem(PENDING_KEY);
    } catch { /* best-effort */ }
}

// Hook: on first authenticated mount, if a pending invite code is stashed,
// redeem it. Uses useGuideLink().linkGuideByCode so capacity/tier checks
// still run. Cleared on success OR on "invalid code" style errors so it
// doesn't keep retrying an unusable code every app open.
export function usePendingInviteConsumer() {
    const { user } = useAuth();
    const { linkGuideByCode, linkedGuideUid } = useGuideLink();

    useEffect(() => {
        if (!user) return;
        // If the client is already linked to a guide, don't overwrite that link.
        if (linkedGuideUid) {
            clearPendingInvite();
            return;
        }
        let cancelled = false;
        (async () => {
            const code = await readPendingInvite();
            if (!code) return;
            const result = await linkGuideByCode(code);
            if (cancelled) return;
            // Clear on success or definite failure — retrying every open helps nothing.
            await clearPendingInvite();
            if (result.ok) {
                Alert.alert('Linked with your BE Guide', result.message);
            } else {
                // Silent on failure — user may have redeemed the code some
                // other way, or the guide revoked it. Not worth an alert
                // during first-launch confusion.
                console.log('[pendingInvite] not consumed:', result.message);
            }
        })();
        return () => { cancelled = true; };
    }, [user, linkedGuideUid, linkGuideByCode]);
}
