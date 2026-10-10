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

    // 🔒 Configuración de seguridad para imágenes externas
    images: {
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