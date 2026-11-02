// Tema de los widgets embebidos a partir de los parámetros de la URL.
// El color de marca se inyecta como tokens CSS (--primary, --ring…) en :root
// para que todo (también diálogos en portal) lo herede sin props. El modo
// oscuro reutiliza los tokens `.dark` de globals.css vía la clase `widget-dark`.
import { readableTextColor } from './utils';

export type WidgetSearchParams = {
    color?: string;
    textColor?: string;
    darkMode?: string;
    lang?: string;
    version?: string;
};

export type WidgetTheme = {
    lang: 'es' | 'en';
    version: 'normal' | 'lite';
    isDarkMode: boolean;
    // Regla CSS a renderizar en un <style>. Solo contiene tripletes HSL calculados.
    css: string;
};

const DEFAULT_ACCENT = '#FF5C00';
const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

// Normaliza a "#rrggbb" o devuelve null si no es un hex válido (evita inyectar CSS arbitrario)
export function normalizeHex(value: string | undefined): string | null {
    if (!value) return null;
    const match = decodeURIComponent(value).trim().match(HEX_RE);
    if (!match) return null;
    const hex = match[1].length === 3 ? match[1].split('').map(c => c + c).join('') : match[1];
    return `#${hex.toLowerCase()}`;
}

// "#rrggbb" → "h s% l%" (formato de los tokens de globals.css)
export function hexToHslTriplet(hex: string): string {
    const n = parseInt(hex.slice(1), 16);
    const r = ((n >> 16) & 255) / 255;
    const g = ((n >> 8) & 255) / 255;
    const b = (n & 255) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }

    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function getWidgetTheme(params: WidgetSearchParams): WidgetTheme {
    const isDarkMode = params.darkMode === 'true';
    const accent = normalizeHex(params.color) ?? DEFAULT_ACCENT;
    const text = normalizeHex(params.textColor);

    const vars: Record<string, string> = {
        '--primary': hexToHslTriplet(accent),
        '--ring': hexToHslTriplet(accent),
        '--brand': hexToHslTriplet(accent),
        '--primary-foreground': hexToHslTriplet(readableTextColor(accent)),
    };
    // El color de texto personalizado solo tiene sentido sobre fondo claro
    if (text && !isDarkMode) {
        vars['--foreground'] = hexToHslTriplet(text);
        vars['--card-foreground'] = hexToHslTriplet(text);
    }

    const declarations = Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');

    return {
        lang: params.lang === 'en' ? 'en' : 'es',
        version: params.version === 'lite' ? 'lite' : 'normal',
        isDarkMode,
        // Especificidad (0,3,0) para ganar a `:root:has(.widget-dark)` (0,2,0)
        css: `:root:root:root{${declarations}}`,
    };
}
