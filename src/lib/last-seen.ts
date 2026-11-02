// Marca local (por dispositivo) de la última visita del admin a cada tablero.
// Permite resaltar las ideas nuevas sin añadir columnas a la BBDD.

const key = (boardId: string) => `pidemelo:last-seen:${boardId}`;

export function readLastSeen(boardId: string): number | null {
    try {
        const raw = window.localStorage.getItem(key(boardId));
        const value = raw ? Number(raw) : NaN;
        return Number.isFinite(value) ? value : null;
    } catch {
        return null;
    }
}

export function writeLastSeen(boardId: string, at: number = Date.now()): void {
    try {
        window.localStorage.setItem(key(boardId), String(at));
    } catch {
        /* almacenamiento no disponible (modo privado, etc.) */
    }
}

export function countNewSince(createdAts: string[], lastSeen: number | null): number {
    if (lastSeen === null) return 0;
    return createdAts.filter(c => new Date(c).getTime() > lastSeen).length;
}
