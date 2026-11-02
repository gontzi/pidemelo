// Estados de una idea y cómo se presentan en la UI.
// La BBDD mantiene 6 estados; el panel los simplifica en 4 abiertos + "cerrada"
// (descartado = cerrada y visible en público, archivado = cerrada y oculta).

export type IdeaStatus = 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado' | 'archivado';

export const OPEN_STATUSES = ['en_revision', 'planeado', 'en_progreso', 'completado'] as const;
export type OpenStatus = (typeof OPEN_STATUSES)[number];

export function isClosedStatus(status: IdeaStatus): boolean {
    return status === 'descartado' || status === 'archivado';
}

// Tintes suaves para los badges de estado (fondo + texto legible)
export const STATUS_BADGE: Record<IdeaStatus, string> = {
    en_revision: 'bg-[#FFF0E8] text-[#C24A00]',
    planeado: 'bg-[#F1ECFB] text-[#5B36A8]',
    en_progreso: 'bg-[#FDF3DC] text-[#8A6210]',
    completado: 'bg-mint text-[#2F7457]',
    descartado: 'bg-muted text-muted-foreground',
    archivado: 'bg-muted text-muted-foreground',
};

// Punto de color para indicadores compactos
export const STATUS_DOT: Record<IdeaStatus, string> = {
    en_revision: 'bg-[#FF5C00]',
    planeado: 'bg-[#8051D9]',
    en_progreso: 'bg-[#F5C35B]',
    completado: 'bg-[#65AD8C]',
    descartado: 'bg-muted-foreground/50',
    archivado: 'bg-muted-foreground/50',
};
