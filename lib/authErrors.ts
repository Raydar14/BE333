// Friendly translations of the Firebase Auth error codes we hit in the UI.
// Firebase's raw errors look like "Firebase: Error (auth/user-not-found)."
// which is not something we want a real person to read. This maps the
// common codes to a title + message pair that says what happened in plain
// language and, when useful, hints at the next step (sign up, reset,
// retry, etc.).
//
// Note on `auth/invalid-credential`: when a project has "Email enumeration
// protection" turned on (recommended, and on for be333ag), Firebase no
// longer distinguishes user-not-found from wrong-password on sign-in — it
// returns this generic code instead so that a bot can't probe which
// emails have accounts. That's why we merge both cases into one message.

export interface FriendlyAuthError {
    title: string;
    message: string;
}

export function friendlyAuthError(err: unknown): FriendlyAuthError {
    const code = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code: unknown }).code)
        : '';
    const raw = err instanceof Error ? err.message : 'Something went wrong.';

    switch (code) {
        // --- Sign-in problems ---
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
            return {
                title: 'Sign in failed',
                message:
                    "We couldn't find an account with that email and password. " +
                    "Double-check them, or tap Sign Up below if you're new here.",
            };
        case 'auth/wrong-password':
            return {
                title: 'Wrong password',
                message:
                    "That password doesn't match this account. Try again, or " +
                    'tap "Forgot Password?" to reset it.',
            };
        case 'auth/invalid-email':
            return {
                title: 'Check that email',
                message: "That doesn't look like a valid email address.",
            };
        case 'auth/user-disabled':
            return {
                title: 'Account disabled',
                message:
                    "This account has been disabled. If you think that's a " +
                    'mistake, contact support.',
            };
        case 'auth/too-many-requests':
            return {
                title: 'Too many attempts',
                message:
                    'Too many sign-in tries in a row. Wait a minute and try ' +
                    'again, or reset your password.',
            };

        // --- Sign-up problems ---
        case 'auth/email-already-in-use':
            return {
                title: 'That email is taken',
                message:
                    'An account with this email already exists. Try signing in ' +
                    'instead, or use "Forgot Password?" if you need to reset it.',
            };
        case 'auth/weak-password':
            return {
                title: 'Password too short',
                message: 'Please use a password with at least 6 characters.',
            };

        // --- Popup / OAuth problems ---
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return {
                title: 'Sign-in canceled',
                message:
                    'The sign-in window closed before you finished. Try again ' +
                    "when you're ready.",
            };
        case 'auth/popup-blocked':
            return {
                title: 'Popup blocked',
                message:
                    'Your browser blocked the sign-in popup. Allow popups for ' +
                    'this site and try again.',
            };
        case 'auth/unauthorized-domain':
            return {
                title: "This domain isn't authorized",
                message:
                    "Sign-in isn't enabled for this URL yet. If you're the admin, " +
                    'add this domain in Firebase Console → Authentication → ' +
                    'Settings → Authorized domains.',
            };
        case 'auth/account-exists-with-different-credential':
            return {
                title: 'Different sign-in method',
                message:
                    'An account with this email already exists but was created ' +
                    'with a different sign-in method (e.g. email/password). Try ' +
                    'that method instead.',
            };

        // --- Environment / infrastructure ---
        case 'auth/network-request-failed':
            return {
                title: 'Connection lost',
                message:
                    'Network error. Check your internet connection and try again.',
            };
        case 'auth/firebase-app-check-token-is-invalid':
            return {
                title: "Couldn't verify this device",
                message:
                    'Please refresh the page and try again. If this keeps ' +
                    'happening, let support know.',
            };
        case 'auth/operation-not-allowed':
            return {
                title: 'Sign-in method disabled',
                message:
                    "This sign-in method isn't enabled for the app yet. If " +
                    "you're the admin, enable it in the Firebase console.",
            };

        default:
            // Trim the Firebase noise off the raw message so if we do have to
            // fall back to it, it reads at least a little better.
            const cleaned = raw
                .replace(/^Firebase:\s*/i, '')
                .replace(/^Error\s*/i, '')
                .replace(/\s*\(auth\/[a-z-]+\)\.?\s*$/i, '')
                .trim();
            return {
                title: 'Something went wrong',
                message: cleaned || 'Please try again.',
            };
    }
}
