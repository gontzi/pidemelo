import { cache } from 'react';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { boards } from '@/db/schema';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Tablero del usuario actual (con etiquetas). Memoizado por petición para que
// el layout y la página compartan la misma consulta.
export const getOwnedBoard = cache(async (id: string) => {
    const { userId } = auth();
    if (!userId || !UUID_RE.test(id)) return null;

    const board = await db.query.boards.findFirst({
        where: and(eq(boards.id, id), eq(boards.userId, userId)),
        with: { tags: true },
    });
    return board ?? null;
});
