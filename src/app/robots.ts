import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Bloqueamos el acceso al dashboard y a las rutas de API
                disallow: ['/dashboard/', '/dashboard', '/api/'],
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
