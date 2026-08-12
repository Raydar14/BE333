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
        return 'La contraseña no cumple con la política de seguridad. Revisá los requisitos debajo del campo.';
    }
    const items = match[1].split(',').map((s) => s.trim());
    const translated = items.map((item) => {
        const lower = item.toLowerCase();
        if (lower.includes('upper case')) return 'falta al menos una letra mayúscula';
        if (lower.includes('lower case')) return 'falta al menos una letra minúscula';
        if (lower.includes('numeric')) return 'falta al menos un número';
        if (lower.includes('non-alphanumeric') || lower.includes('special')) return 'falta al menos un carácter especial';
        if (lower.includes('at least') && lower.includes('character')) return 'debe tener al menos 6 caracteres';
        if ((lower.includes('at most') || lower.includes('no more than')) && lower.includes('character')) return 'excede la longitud máxima permitida';
        return item;
    });
    return `La contraseña no cumple los requisitos: ${translated.join('; ')}.`;
}

export function friendlyAuthError(err: unknown): FriendlyAuthError {
    const code = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code: unknown }).code)
        : '';
    const raw = err instanceof Error ? err.message : 'Ocurrió un error.';

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
                title: 'No pudimos iniciar tu sesión',
                message:
                    'El correo y la contraseña no coinciden con ninguna cuenta. ' +
                    'Si te registraste con Google, usá el botón "Continuar con ' +
                    'Google" en vez del formulario. Si no, revisá tu contraseña o ' +
                    'restablecela con "¿Olvidaste tu contraseña?".',
            };
        case 'auth/invalid-email':
            return {
                title: 'Revisá el correo',
                message: 'Ese correo no tiene un formato válido.',
            };
        case 'auth/user-disabled':
            return {
                title: 'Cuenta deshabilitada',
                message: 'Esta cuenta fue deshabilitada. Si te parece un error, contactanos.',
            };
        case 'auth/too-many-requests':
            return {
                title: 'Demasiados intentos',
                message:
                    'Hubo demasiados intentos de inicio de sesión seguidos. Esperá ' +
                    'un minuto e intentá de nuevo, o restablecé tu contraseña.',
            };

        // --- Registro ---
        case 'auth/email-already-in-use':
            return {
                title: 'Ese correo ya está registrado',
                message:
                    'Ya existe una cuenta con este correo. Probá iniciar sesión. Si ' +
                    'te registraste con Google, usá el botón "Continuar con Google".',
            };
        case 'auth/weak-password':
            return {
                title: 'Contraseña muy corta',
                message: 'Usá una contraseña de al menos 6 caracteres.',
            };
        case 'auth/password-does-not-meet-requirements':
            return {
                title: 'La contraseña no cumple los requisitos',
                message: parsePasswordRequirements(raw),
            };

        // --- Popup / OAuth ---
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return {
                title: 'Inicio de sesión cancelado',
                message: 'Cerraste la ventana antes de terminar. Intentá de nuevo cuando quieras.',
            };
        case 'auth/popup-blocked':
            return {
                title: 'Ventana emergente bloqueada',
                message:
                    'Tu navegador bloqueó la ventana de inicio de sesión. Permití ' +
                    'pop-ups para este sitio e intentá de nuevo.',
            };
        case 'auth/unauthorized-domain':
            return {
                title: 'Dominio no autorizado',
                message:
                    'El inicio de sesión no está habilitado todavía para esta URL. ' +
                    'Si sos admin, agregá este dominio en Firebase Console → ' +
                    'Authentication → Settings → Authorized domains.',
            };
        case 'auth/account-exists-with-different-credential':
            return {
                title: 'Otro método de inicio de sesión',
                message:
                    'Ya existe una cuenta con este correo, pero se creó con otro ' +
                    'método (por ejemplo, email y contraseña). Probá con ese método.',
            };

        // --- Entorno / infraestructura ---
        case 'auth/network-request-failed':
            return {
                title: 'Se perdió la conexión',
                message: 'Error de red. Revisá tu conexión a internet e intentá de nuevo.',
            };
        case 'auth/firebase-app-check-token-is-invalid':
            return {
                title: 'No pudimos verificar el dispositivo',
                message: 'Actualizá la página e intentá de nuevo. Si sigue pasando, avisanos.',
            };
        case 'auth/operation-not-allowed':
            return {
                title: 'Método de inicio de sesión deshabilitado',
                message:
                    'Este método de inicio de sesión no está habilitado todavía. Si ' +
                    'sos admin, habilitalo en la consola de Firebase.',
            };

        default:
            // Fallback para cualquier código no contemplado — incluye el
            // código crudo para poder diagnosticar.
            return {
                title: 'Ocurrió un error inesperado',
                message: code
                    ? `Intentá de nuevo. Si el problema sigue, contanos este código: ${code}.`
                    : `Intentá de nuevo. Detalle: ${raw}`,
            };
    }
}
