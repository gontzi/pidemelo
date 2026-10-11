// Helpers puros de lógica de feedback.
// No dependen de Next, Clerk ni la BD: se pueden testear de forma aislada.

// Escapa texto controlado por el usuario antes de inyectarlo en el HTML del email
// (evita inyección de HTML/phishing en las notificaciones).
export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Evita la inyección de cabeceras en el asunto del email (saltos de línea)
export function sanitizeHeader(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').slice(0, 120);
}

// Hash SHA-256 en hexadecimal, compatible con Edge Runtime (Web Crypto API)
export async function sha256(value: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Detecta el tipo real de imagen por sus primeros bytes (magic bytes).
// Recibe al menos 12 bytes de la cabecera del archivo.
export function detectImageMime(bytes: readonly number[]): string | null {
    const b = bytes;
    if (b.length < 12) return null;

    // JPEG: FF D8 FF
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
    // PNG: 89 50 4E 47
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
    // WEBP: "RIFF" .... "WEBP"
    if (
        b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
    ) return 'image/webp';

    return null;
}

// Slug a partir de un texto libre (lowercase, sin acentos ni símbolos, guiones)
export function slugify(text: string): string {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

// Sufijo aleatorio para resolver colisiones de slug
export function randomSuffix(): string {
    return Math.random().toString(36).substring(2, 8);
}

// --- Resolvers de errores (código -> mensaje i18n) ---

export type SubmitError = { error?: string; seconds?: number };

export function resolveError(res: SubmitError, dict: Record<string, string>): string {
    switch (res.error) {
        case 'missing_fields':
            return dict.err_missing_fields || dict.error_fallback;
        case 'cooldown':
            return (dict.err_cooldown || dict.error_fallback).replace('{s}', String(res.seconds ?? ''));
        case 'generic':
        default:
            return dict.err_generic || dict.error_fallback;
    }
}

export type ImageUploadDict = {
    attach: string;
    uploading: string;
    error_size: string;
    error_connection: string;
    error_missing: string;
    error_format: string;
    error_board: string;
    error_upload: string;
};

export function resolveUploadError(code: string, dict: ImageUploadDict): string {
    switch (code) {
        case 'too_large':
            return dict.error_size;
        case 'bad_format':
            return dict.error_format;
        case 'board_not_found':
            return dict.error_board;
        case 'missing_data':
            return dict.error_missing;
        case 'upload_failed':
        default:
            return dict.error_upload;
    }
}