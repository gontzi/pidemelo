import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Bloqueamos todo lo privado del dashboard
                disallow: ['/dashboard/', '/dashboard'],
            },
        ],
        sitemap: 'https://pidemelo.app/sitemap.xml',
        host: 'https://pidemelo.app',
    }
}
