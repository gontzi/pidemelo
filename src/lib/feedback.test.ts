import { describe, expect, it } from 'vitest';
import {
    detectImageMime,
    escapeHtml,
    randomSuffix,
    resolveError,
    resolveUploadError,
    sanitizeHeader,
    sha256,
    slugify,
} from './feedback';

describe('escapeHtml', () => {
    it('escapa los caracteres HTML peligrosos', () => {
        expect(escapeHtml('<b>&"\'</b>')).toBe('&lt;b&gt;&amp;&quot;&#39;&lt;/b&gt;');
    });

    it('deja el texto plano intacto', () => {
        expect(escapeHtml('¡Hola, mundo! 123')).toBe('¡Hola, mundo! 123');
    });
});

describe('sanitizeHeader', () => {
    it('elimina saltos de línea (previene header injection)', () => {
        expect(sanitizeHeader('foo\r\nBcc: evil@x.com')).toBe('foo Bcc: evil@x.com');
    });

    it('recorta a 120 caracteres', () => {
        expect(sanitizeHeader('¿'.repeat(200)).length).toBe(120);
    });
});

describe('sha256', () => {
    it('devuelve un hash hexadecimal de 64 caracteres', async () => {
        const h = await sha256('pidemelo');
        expect(h).toMatch(/^[0-9a-f]{64}$/);
    });

    it('es determinista', async () => {
        expect(await sha256('a')).toBe(await sha256('a'));
    });

    it('distingue inputs diferentes', async () => {
        expect(await sha256('a')).not.toBe(await sha256('b'));
    });
});

describe('detectImageMime', () => {
    const pad12 = (prefix: number[]) => [...prefix, ...Array(12 - prefix.length).fill(0)];

    it('detecta JPEG (FF D8 FF)', () => {
        expect(detectImageMime(pad12([0xff, 0xd8, 0xff]))).toBe('image/jpeg');
    });

    it('detecta PNG', () => {
        expect(detectImageMime(pad12([0x89, 0x50, 0x4e, 0x47]))).toBe('image/png');
    });

    it('detecta WEBP (RIFF....WEBP)', () => {
        const riff = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
        expect(detectImageMime(riff)).toBe('image/webp');
    });

    it('rechaza contenido que no es una imagen', () => {
        expect(detectImageMime([0x00, 0x01, 0x02, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toBeNull();
    });

    it('rechaza buffers demasiado cortos', () => {
        expect(detectImageMime([0xff, 0xd8])).toBeNull();
    });
});

describe('slugify', () => {
    it('normaliza a minúsculas y guiones', () => {
        expect(slugify('Hola Mundo App')).toBe('hola-mundo-app');
    });

    it('elimina símbolos y acentos', () => {
        expect(slugify('¿Qué es Pidemelo?')).toBe('qu-es-pidemelo');
    });

    it('colapsa separadores consecutivos', () => {
        expect(slugify('a-----b   c')).toBe('a-b-c');
    });

    it('recorta guiones al inicio y al final', () => {
        expect(slugify('-hola-')).toBe('hola');
    });

    it('devuelve cadena vacía si no hay caracteres válidos', () => {
        expect(slugify('!!!  ')).toBe('');
    });
});

describe('randomSuffix', () => {
    it('devuelve 6 caracteres alfanuméricos', () => {
        const s = randomSuffix();
        expect(s).toMatch(/^[a-z0-9]{6}$/);
    });

    it('no repite sufijos de forma trivial', () => {
        const a = randomSuffix();
        const b = randomSuffix();
        expect([a, b].filter((v) => v === `${a}`).length).toBeLessThan(2);
    });
});

describe('resolveError', () => {
    const dict = {
        err_missing_fields: 'Rellena todo',
        err_cooldown: 'Espera {s} segundos',
        err_generic: 'Algo salió mal',
        error_fallback: 'Fallback',
    };

    it('mapea missing_fields', () => {
        expect(resolveError({ error: 'missing_fields' }, dict)).toBe('Rellena todo');
    });

    it('interpola los segundos del cooldown', () => {
        expect(resolveError({ error: 'cooldown', seconds: 4 }, dict)).toBe('Espera 4 segundos');
    });

    it('mapea generic', () => {
        expect(resolveError({ error: 'generic' }, dict)).toBe('Algo salió mal');
    });

    it('usa el fallback ante códigos desconocidos o ausentes', () => {
        expect(resolveError({ error: 'desconocido' }, dict)).toBe('Algo salió mal');
        expect(resolveError({ error: 'generic' }, { error_fallback: 'Fallback' })).toBe('Fallback');
    });
});

describe('resolveUploadError', () => {
    const dict = {
        attach: 'a',
        uploading: 'u',
        error_size: 'Muy grande',
        error_connection: 'Conexión',
        error_missing: 'Faltan datos',
        error_format: 'Formato malo',
        error_board: 'No existe',
        error_upload: 'Error genérico',
    };

    it('mapea cada código a su mensaje', () => {
        expect(resolveUploadError('too_large', dict)).toBe('Muy grande');
        expect(resolveUploadError('bad_format', dict)).toBe('Formato malo');
        expect(resolveUploadError('board_not_found', dict)).toBe('No existe');
        expect(resolveUploadError('missing_data', dict)).toBe('Faltan datos');
    });

    it('usa el mensaje genérico por defecto', () => {
        expect(resolveUploadError('upload_failed', dict)).toBe('Error genérico');
        expect(resolveUploadError('otro', dict)).toBe('Error genérico');
    });
});