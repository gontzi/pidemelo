import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '../db';
import { boards, tags } from '../db/schema';
import { eq } from 'drizzle-orm';

const defaultTags = [
    { name: 'Bug', color: '#ef4444', description: 'Errores y problemas en la plataforma descubiertos por los usuarios.' },
    { name: 'Nueva Funcionalidad', color: '#3b82f6', description: 'Ideas para nuevas características que aportarían valor.' },
    { name: 'Diseño', color: '#ec4899', description: 'Sugerencias para mejorar la interfaz de usuario y la experiencia.' },
    { name: 'Integraciones', color: '#8b5cf6', description: 'Peticiones para conectar con otras herramientas y servicios.' },
    { name: 'Rendimiento', color: '#eab308', description: 'Cosas que van lentas o podrían ir más rápido.' },
];

async function main() {
    console.log('Iniciando migración de etiquetas por defecto...');

    // Obtener todos los tableros
    const allBoards = await db.select().from(boards);
    console.log(`Se encontraron ${allBoards.length} tableros.`);

    let insertedCount = 0;

    for (const board of allBoards) {
        // Verificar si ya tiene etiquetas para no duplicar en caso de relanzar el script
        const existingTags = await db.select().from(tags).where(eq(tags.boardId, board.id));

        if (existingTags.length === 0) {
            console.log(`Insertando etiquetas para el tablero: ${board.name} (${board.slug})`);
            for (const tag of defaultTags) {
                await db.insert(tags).values({
                    boardId: board.id,
                    name: tag.name,
                    color: tag.color,
                    description: tag.description,
                });
                insertedCount++;
            }
        } else {
            console.log(`El tablero ${board.name} ya tiene etiquetas. Saltando.`);
        }
    }

    console.log(`Migración completada. Se insertaron ${insertedCount} etiquetas en total.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('Error durante la migración:', err);
    process.exit(1);
});
