import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard',
                    '/api',
                    '/admin',
                    '/login',
                    '/sign-in',
                    '/settings',
                    '/*?_clerk_status', // Clerk callback params
                ],
            },
            {
                // Protegemos el contenido de rastreadores de IA para entrenamiento
                userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'claudebot'],
                disallow: '/',
            }
        ],
        sitemap: 'https://pidemelo.app/sitemap.xml',
    }
}
