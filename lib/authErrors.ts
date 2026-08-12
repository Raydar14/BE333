// Traducciones al español de los códigos de error de Firebase Auth que
// usamos en la UI. Firebase tira mensajes crudos como
// "Firebase: Error (auth/user-not-found)." que no queremos mostrarle a un
// usuario real. Este archivo centraliza el mapeo código -> texto en
// español para no duplicar esta lógica entre login.tsx y signup.tsx.
//
// Nota sobre `auth/invalid-credential`: con "Email enumeration protection"
// activada (recomendado, y activo en be333ag), Firebase ya no distingue
// cuenta-inexistente de contraseña-incorrecta al iniciar sesión — devuelve
// este código genérico para que nadie pueda usarlo para averiguar qué
// emails tienen cuenta. Por el mismo motivo, `fetchSignInMethodsForEmail`
// siempre devuelve un array vacío en este proyecto: no sirve para
// detectar que una cuenta se registró con Google. El mensaje de abajo
// cubre esa posibilidad de forma genérica, sin confirmar ni negar nada.

export interface FriendlyAuthError {
    title: string;
    message: string;
}

// El error de contraseña trae del servidor algo como:
// "Firebase: Missing password requirements: [Password must contain an
// upper case character] (auth/password-does-not-meet-requirements)."
// Extraemos la lista entre corchetes y traducimos cada requisito conocido.
// Los desconocidos se muestran tal cual — no los inventamos.
function parsePasswordRequirements(raw: string): string {
    const match = raw.match(/\[([^\]]+)\]/);
    if (!match) {
        return "Your password doesn't meet the security requirements. Check the requirements below the field.";
    }
    const items = match[1].split(',').map((s) => s.trim());
    const translated = items.map((item) => {
        const lower = item.toLowerCase();
        if (lower.includes('upper case')) return 'needs at least one uppercase letter';
        if (lower.includes('lower case')) return 'needs at least one lowercase letter';
        if (lower.includes('numeric')) return 'needs at least one number';
        if (lower.includes('non-alphanumeric') || lower.includes('special')) return 'needs at least one special character';
        if (lower.includes('at least') && lower.includes('character')) return 'must be at least 6 characters';
        if ((lower.includes('at most') || lower.includes('no more than')) && lower.includes('character')) return 'is too long';
        return item;
    });
    return `Your password doesn't meet the requirements: ${translated.join('; ')}.`;
}

export function friendlyAuthError(err: unknown): FriendlyAuthError {
    const code = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code: unknown }).code)
        : '';
    const raw = err instanceof Error ? err.message : 'An error occurred.';

    switch (code) {
        // --- Inicio de sesión ---
        // user-not-found, invalid-credential y wrong-password se muestran
        // con el mismo mensaje ambiguo a propósito: con Email Enumeration
        // Protection activa, Firebase ya los colapsa en invalid-credential,
        // así que distinguirlos acá daría una falsa sensación de certeza.
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
            return {
                title: "We couldn't sign you in",
                message:
                    'If you signed up with Google, use the "Sign in with Google" ' +
                    "button instead of the form below. Otherwise, double-check your " +
                    'email and password, or reset your password with "Forgot Password?".',
            };
        case 'auth/invalid-email':
            return {
                title: 'Check your email',
                message: "That email address doesn't look right.",
            };
        case 'auth/user-disabled':
            return {
                title: 'Account disabled',
                message: "This account has been disabled. If that seems wrong, contact us.",
            };
        case 'auth/too-many-requests':
            return {
                title: 'Too many attempts',
                message:
                    'There have been too many sign-in attempts in a row. Wait a ' +
                    'minute and try again, or reset your password.',
            };

        // --- Registro ---
        case 'auth/email-already-in-use':
            return {
                title: 'That email is already registered',
                message:
                    'An account with this email already exists. Try signing in ' +
                    'instead. If you signed up with Google, use the "Sign in with ' +
                    'Google" button.',
            };
        case 'auth/weak-password':
            return {
                title: 'Password too short',
                message: 'Use a password with at least 6 characters.',
            };
        case 'auth/password-does-not-meet-requirements':
            return {
                title: "Password doesn't meet the requirements",
                message: parsePasswordRequirements(raw),
            };

        // --- Popup / OAuth ---
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return {
                title: 'Sign-in cancelled',
                message: "You closed the window before finishing. Try again whenever you're ready.",
            };
        case 'auth/popup-blocked':
            return {
                title: 'Pop-up blocked',
                message:
                    'Your browser blocked the sign-in window. Allow pop-ups for ' +
                    'this site and try again.',
            };
        case 'auth/unauthorized-domain':
            return {
                title: 'Domain not authorized',
                message:
                    "Sign-in isn't enabled yet for this URL. If you're an admin, " +
                    'add this domain in Firebase Console → Authentication → ' +
                    'Settings → Authorized domains.',
            };
        case 'auth/account-exists-with-different-credential':
            return {
                title: 'Different sign-in method',
                message:
                    'An account with this email already exists, but it was created ' +
                    'with a different method (for example, email and password). Try ' +
                    'that method instead.',
            };

        // --- Entorno / infraestructura ---
        case 'auth/network-request-failed':
            return {
                title: 'Connection lost',
                message: 'Network error. Check your internet connection and try again.',
            };
        case 'auth/firebase-app-check-token-is-invalid':
            return {
                title: "We couldn't verify your device",
                message: 'Refresh the page and try again. If this keeps happening, let us know.',
            };
        case 'auth/operation-not-allowed':
            return {
                title: 'Sign-in method disabled',
                message:
                    "This sign-in method isn't enabled yet. If you're an admin, " +
                    'enable it in the Firebase console.',
            };

        default:
            // Fallback para cualquier código no contemplado — incluye el
            // código crudo para poder diagnosticar.
            return {
                title: 'Something went wrong',
                message: code
                    ? `Try again. If the problem continues, let us know this code: ${code}.`
                    : `Try again. Details: ${raw}`,
            };
    }
}
