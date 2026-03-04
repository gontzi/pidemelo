import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 1. Creamos una función interna para obtener el cliente solo cuando se necesite
const getDb = () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        // Durante el build, esto evitará que el proceso explote.
        // Solo lanzará error si realmente intentas hacer una query sin URL.
        console.warn("⚠️ DATABASE_URL no encontrada. Si esto es el build, es normal.");
        return null as any;
    }

    const sql = neon(connectionString);
    return drizzle(sql, { schema });
};

// 2. Exportamos la instancia (Lazy Load)
export const db = getDb();