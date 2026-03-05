'use server'

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Server Action para iniciar el proceso de checkout con Polar.sh
 * @param formData Datos del formulario que contienen el productId
 */
export async function checkoutAction(formData: FormData) {
    const { userId } = auth();
    const productId = formData.get("productId") as string;

    // 1. Validación de Autenticación
    if (!userId) {
        throw new Error("⚠️ No estás autenticado. Por favor, inicia sesión para continuar.");
    }

    // 2. Validación de Variables de Entorno
    const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
    const successUrl = process.env.POLAR_SUCCESS_URL;

    if (!polarAccessToken) {
        console.error("Falta POLAR_ACCESS_TOKEN en el .env");
        throw new Error("El sistema de pagos no está configurado correctamente.");
    }

    if (!successUrl) {
        console.error("Falta POLAR_SUCCESS_URL en el .env");
        throw new Error("Falta la URL de retorno para completar el pago.");
    }

    if (!productId) {
        throw new Error("El ID del producto es obligatorio para iniciar el checkout.");
    }

    try {
        console.log(`🚀 Iniciando checkout para el producto ${productId} (Usuario: ${userId})`);

        // 3. Llamada a la API de Polar
        const response = await fetch("https://api.polar.sh/api/v1/checkouts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${polarAccessToken}`,
            },
            body: JSON.stringify({
                product_id: productId,
                success_url: successUrl,
                // INYECCIÓN CRÍTICA: Metadata para el Webhook
                customer_metadata: {
                    clerkId: userId,
                },
                metadata: {
                    clerkId: userId, // Duplicamos en metadata para mayor seguridad según el flujo de Polar
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Error de Polar API:", data);
            throw new Error(data.detail?.[0]?.msg || data.detail || "Error al conectar con la pasarela de pagos.");
        }

        // 4. Redirección final
        if (data.url) {
            redirect(data.url);
        } else {
            throw new Error("No se ha podido generar la URL de pago.");
        }
    } catch (error) {
        // Si el error es una redirección normal de Next.js, la dejamos pasar
        if ((error as any).message === "NEXT_REDIRECT") {
            throw error;
        }

        console.error("🔥 Error crítico en checkoutAction:", error);
        throw error;
    }
}
