import type { MetadataRoute } from 'next'
import { db } from '@/db'
import { boards } from '@/db/schema'

const BASE_URL = 'https://pidemelo.app'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Rutas estáticas públicas
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ]

    // Rutas dinámicas: tableros públicos de usuarios
    try {
        const allBoards = await db
            .select({ slug: boards.slug, updatedAt: boards.createdAt })
            .from(boards)

        const boardRoutes: MetadataRoute.Sitemap = allBoards.map((board) => ({
            url: `${BASE_URL}/board/${board.slug}`,
            lastModified: board.updatedAt,
            changeFrequency: 'daily',
            priority: 0.8,
        }))

        return [...staticRoutes, ...boardRoutes]
    } catch {
        // Si la DB falla (ej. durante el build), devolvemos solo las estáticas
        return staticRoutes
    }
}
