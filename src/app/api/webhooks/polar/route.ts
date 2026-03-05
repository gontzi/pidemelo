import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

/**
 * Webhook Handler de Polar.sh
 * Implementación de máxima compatibilidad para Cloudflare Pages
 */
export async function POST(req: Request) {
    const body = await req.text();
    const headersList = headers();
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    // Headers requeridos por Svix/Polar
    const msgId = headersList.get("webhook-id");
    const msgTimestamp = headersList.get("webhook-timestamp");
    const msgSignature = headersList.get("webhook-signature");

    if (!webhookSecret) {
        return NextResponse.json({ error: "Secret missing" }, { status: 500 });
    }

    if (!msgId || !msgTimestamp || !msgSignature) {
        return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    try {
        // 1. Limpiar el secreto (Polar lo da como whsec_...)
        const secretBase64 = webhookSecret.startsWith("whsec_")
            ? webhookSecret.substring(6)
            : webhookSecret;

        // 2. Preparar la verificación
        const encoder = new TextEncoder();
        const signedContent = `${msgId}.${msgTimestamp}.${body}`;

        // Decodificar el secreto de Base64 a binario
        const secretUint8 = Uint8Array.from(atob(secretBase64), c => c.charCodeAt(0));

        // Importar la llave para HMAC SHA-256
        const key = await crypto.subtle.importKey(
            "raw",
            secretUint8,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        // 3. Verificar cada firma enviada (pueden venir varias separadas por espacio)
        const signatures = msgSignature.split(" ");
        let isValid = false;

        for (const sig of signatures) {
            const [version, hash] = sig.split(",");
            if (version !== "v1") continue;

            // Generamos nuestro propio hash para comparar
            const signatureBinary = await crypto.subtle.sign(
                "HMAC",
                key,
                encoder.encode(signedContent)
            );

            // Convertimos nuestro binario a Base64 para comparar strings
            const expectedHash = btoa(String.fromCharCode(...new Uint8Array(signatureBinary)));

            if (expectedHash === hash) {
                isValid = true;
                break;
            }
        }

        if (!isValid) throw new Error("Invalid signature match");

    } catch (err) {
        // Si falla la firma, devolvemos 401. 
        // ⚠️ Si sigues viendo 401, el SECRETO en tus variables de entorno es incorrecto.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Lógica de Negocio (Si llegamos aquí, la firma es VÁLIDA)
    const payload = JSON.parse(body);
    const eventType = payload.type;
    const data = payload.data;

    // Buscamos el ID del usuario en cualquier rincón del JSON
    const clerkId = data.metadata?.clerkId ||
        data.customer_metadata?.clerkId ||
        data.custom_field_data?.clerkId ||
        payload.customer_metadata?.clerkId;

    if (!clerkId) {
        return NextResponse.json({ received: true, info: "No clerkId found" });
    }

    try {
        switch (eventType) {
            case "order.created": {
                const isSub = !!data.subscription_id;
                await db.insert(users)
                    .values({
                        id: clerkId,
                        isPremium: true,
                        plan: isSub ? 'pro' : 'lifetime',
                        subscriptionId: data.subscription_id || null,
                        updatedAt: new Date(),
                    })
                    .onConflictDoUpdate({
                        target: users.id,
                        set: {
                            isPremium: true,
                            plan: isSub ? 'pro' : 'lifetime',
                            subscriptionId: data.subscription_id || null,
                            updatedAt: new Date(),
                        }
                    });
                break;
            }

            case "subscription.created":
            case "subscription.updated": {
                const isPremium = data.status === 'active' || data.status === 'trialing';
                await db.insert(users)
                    .values({
                        id: clerkId,
                        isPremium,
                        plan: isPremium ? 'pro' : null,
                        subscriptionId: data.id,
                        updatedAt: new Date(),
                    })
                    .onConflictDoUpdate({
                        target: users.id,
                        set: {
                            isPremium,
                            plan: isPremium ? 'pro' : null,
                            subscriptionId: data.id,
                            updatedAt: new Date(),
                        }
                    });
                break;
            }

            case "subscription.canceled":
            case "subscription.revoked":
            case "subscription.past_due": {
                await db.update(users)
                    .set({ isPremium: false, plan: null, updatedAt: new Date() })
                    .where(eq(users.subscriptionId, data.id));
                break;
            }
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
}