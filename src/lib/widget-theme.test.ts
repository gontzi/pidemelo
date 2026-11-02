import { describe, expect, it } from 'vitest';
import { getWidgetTheme, hexToHslTriplet, normalizeHex } from './widget-theme';

describe('normalizeHex', () => {
    it('acepta hex con o sin # y en forma corta', () => {
        expect(normalizeHex('%23FF5C00')).toBe('#ff5c00');
        expect(normalizeHex('abc')).toBe('#aabbcc');
    });

    it('rechaza valores que no son colores', () => {
        expect(normalizeHex('red;background:url(x)')).toBeNull();
        expect(normalizeHex(undefined)).toBeNull();
    });
});

describe('hexToHslTriplet', () => {
    it('convierte al formato de los tokens', () => {
        expect(hexToHslTriplet('#ff5c00')).toBe('22 100% 50%');
        expect(hexToHslTriplet('#ffffff')).toBe('0 0% 100%');
    });
});

describe('getWidgetTheme', () => {
    it('usa el naranja por defecto y texto blanco sobre él', () => {
        const theme = getWidgetTheme({});
        expect(theme.css).toContain('--primary:22 100% 50%');
        expect(theme.css).toContain('--primary-foreground:0 0% 100%');
        expect(theme.isDarkMode).toBe(false);
    });

    it('activa el modo oscuro e ignora el color de texto en él', () => {
        const theme = getWidgetTheme({ darkMode: 'true', textColor: '#151B35' });
        expect(theme.isDarkMode).toBe(true);
        expect(theme.css).not.toContain('--foreground');
    });

    it('usa texto oscuro sobre acentos claros', () => {
        const theme = getWidgetTheme({ color: '#F5C35B' });
        expect(theme.css).toContain(`--primary-foreground:${hexToHslTriplet('#151b35')}`);
    });
});
