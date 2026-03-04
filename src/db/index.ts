import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * 🛠️ CONFIGURACIÓN PARA CLOUDFLARE PAGES + NEON
 * * Durante el build, DATABASE_URL puede ser undefined. 
 * Usamos un fallback de string vacío para que neon() no explote al inicializarse,
 * ya que hemos forzado 'force-dynamic' en las rutas que usan la DB.
 */
const connectionString = process.env.DATABASE_URL || "";

const sql = neon(connectionString);

// Exportamos la instancia de drizzle usando el cliente de neon-http
export const db = drizzle(sql, { schema });