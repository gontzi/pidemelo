import { describe, expect, it } from 'vitest';
import { ROADMAP_STATUSES, groupIdeasByStatus } from './roadmap';

const baseIdea = (status: string, n: number) => ({ id: `i${n}`, status });

describe('groupIdeasByStatus', () => {
    it('agrupa cada idea en su columna de roadmap', () => {
        const ideas = [
            baseIdea('planeado', 1),
            baseIdea('en_progreso', 2),
            baseIdea('completado', 3),
        ];
        const grouped = groupIdeasByStatus(ideas);

        expect(grouped.planeado.map(i => i.id)).toEqual(['i1']);
        expect(grouped.en_progreso.map(i => i.id)).toEqual(['i2']);
        expect(grouped.completado.map(i => i.id)).toEqual(['i3']);
    });

    it('ignora estados que no pertenecen al roadmap', () => {
        const ideas = [
            baseIdea('en_revision', 1),
            baseIdea('descartado', 2),
            baseIdea('archivado', 3),
            baseIdea('planeado', 4),
        ];
        const grouped = groupIdeasByStatus(ideas);

        expect(grouped.planeado.map(i => i.id)).toEqual(['i4']);
        expect(grouped.en_progreso).toHaveLength(0);
        expect(grouped.completado).toHaveLength(0);
    });

    it('devuelve columnas vacías si no hay ideas', () => {
        const grouped = groupIdeasByStatus([]);
        for (const status of ROADMAP_STATUSES) {
            expect(grouped[status]).toEqual([]);
        }
    });
});