import { describe, expect, it } from 'vitest';
import { formatRelative } from './relative-time';
import { countNewSince } from './last-seen';

const NOW = new Date('2026-11-02T12:00:00Z').getTime();

describe('formatRelative', () => {
    it('formatea horas y días en español', () => {
        expect(formatRelative(new Date(NOW - 3 * 3600 * 1000), 'es', NOW)).toBe('hace 3 horas');
        expect(formatRelative(new Date(NOW - 24 * 3600 * 1000), 'es', NOW)).toBe('ayer');
    });

    it('trata los instantes recientes como "ahora"', () => {
        expect(formatRelative(new Date(NOW - 10 * 1000), 'en', NOW)).toBe('now');
    });
});

describe('countNewSince', () => {
    it('no marca nada como nuevo en la primera visita', () => {
        expect(countNewSince(['2026-11-01T00:00:00Z'], null)).toBe(0);
    });

    it('cuenta solo las ideas posteriores a la última visita', () => {
        const lastSeen = new Date('2026-11-01T00:00:00Z').getTime();
        expect(countNewSince(['2026-10-31T00:00:00Z', '2026-11-01T10:00:00Z'], lastSeen)).toBe(1);
    });
});
