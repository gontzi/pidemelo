import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Solo protegemos el /dashboard, el resto (incluido los tablones de clientes) es público
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)'
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: [
        // Se salta el middleware para los estáticos internos de Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Aplica siempre a las rutas API y TRPC
        '/(api|trpc)(.*)',
    ],
};
