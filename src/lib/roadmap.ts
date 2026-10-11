// Lógica del roadmap público (estados que participan).
// No depende de la UI: testeable de forma aislada.
export type RoadmapStatus = 'planeado' | 'en_progreso' | 'completado';

export const ROADMAP_STATUSES: readonly RoadmapStatus[] = ['planeado', 'en_progreso', 'completado'];

// Agrupa ideas por estado de roadmap, ignorando el resto (en_revision, descartado, archivado…).
export function groupIdeasByStatus<T extends { status: string }>(ideas: T[]): Record<RoadmapStatus, T[]> {
    const grouped: Record<RoadmapStatus, T[]> = { planeado: [], en_progreso: [], completado: [] };

    for (const idea of ideas) {
        if (idea.status === 'planeado' || idea.status === 'en_progreso' || idea.status === 'completado') {
            grouped[idea.status].push(idea);
        }
    }

    return grouped;
}