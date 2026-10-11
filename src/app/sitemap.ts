import type { MetadataRoute } from 'next'
import { db } from '@/db'

const BASE_URL = 'https://pidemelo.app'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Rutas estáticas principales
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ]

    // Rutas dinámicas: Solo tableros públicos con contenido (Thin Content Protection)
    try {
        const allBoards = await db.query.boards.findMany({
            with: {
                ideas: {
                    limit: 1,
                    columns: {
                        id: true
                    }
                }
            },
            columns: {
                slug: true,
                createdAt: true
            }
        })

        const boardRoutes: MetadataRoute.Sitemap = allBoards
            .filter(board => board.ideas.length > 0)
            .map((board) => ({
                url: `${BASE_URL}/board/${board.slug}`,
                lastModified: board.createdAt,
                changeFrequency: 'daily',
                priority: 0.8,
            }))

        return [...staticRoutes, ...boardRoutes]
    } catch (error) {
        // Fallback a rutas estáticas si falla la DB
        console.error('Sitemap Error:', error)
        return staticRoutes
    }
}
