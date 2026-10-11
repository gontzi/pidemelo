import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Configuración por defecto del adaptador Cloudflare.
// La app es 100% dinámica (todas las rutas exportan `dynamic = 'force-dynamic'`),
// así que no hay ISR/SSG que cachear: no se necesita R2 ni Durable Objects.
// Documentación: https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({});
