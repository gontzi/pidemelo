/** @type {import('next').NextConfig} */
const nextConfig = {
    // 🖼️ Mantiene tu configuración para que el widget se pueda embeber
    async headers() {
        return [
            {
                source: "/widget/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *",
                    },
                    {
                        // Añadimos X-Frame-Options por compatibilidad con navegadores antiguos
                        key: "X-Frame-Options",
                        value: "ALLOWALL",
                    },
                ],
            },
        ];
    },

    // Secciones antiguas del panel: los widgets viven ahora en la pestaña
    // "Compartir" de cada tablero y el perfil en el menú del avatar.
    async redirects() {
        return [
            { source: "/dashboard/widgets", destination: "/dashboard", permanent: true },
            { source: "/dashboard/profile", destination: "/dashboard", permanent: true },
        ];
    },

    // 🔒 Configuración de seguridad para imágenes externas
    images: {
        // Las imágenes se sirven directamente desde ImageKit (que ya es un CDN
        // con sus propias transformaciones). En Cloudflare Workers no hay
        // optimizador de imágenes salvo que se contrate Cloudflare Images,
        // así que desactivamos el optimizador de Next.js para no depender de
        // la ruta /_next/image (que devolvería 404 en Workers).
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;

// Integra el servidor de desarrollo de Next con el runtime de Cloudflare Workers
// (bindings, .dev.vars, etc.). Solo afecta a `next dev`; no se incluye en el build.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
