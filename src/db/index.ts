import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Si process.env.DATABASE_URL no existe (como en el build), 
// le pasamos una URL falsa de Neon para que la librería no proteste.
const connectionString = process.env.DATABASE_URL || "postgres://fake:fake@db.neon.tech/main";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });