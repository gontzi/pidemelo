import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/db/schema';
import fs from 'fs';
import { sql } from 'drizzle-orm';

const sqlDb = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlDb, { schema });

async function run() {
    const query = fs.readFileSync('./src/db/migrations/0001_funny_shinko_yamashiro.sql', 'utf-8');
    const stmts = query.split('--> statement-breakpoint');
    for (const stmt of stmts) {
        const trimmed = stmt.trim();
        if (trimmed) {
            console.log('Executing:', trimmed);
            try {
                await db.execute(sql.raw(trimmed));
            } catch (e) {
                console.error('Error on stmt:', trimmed, e);
            }
        }
    }
    console.log('Migration finished');
}
run();
