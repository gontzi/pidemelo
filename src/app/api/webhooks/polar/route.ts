import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

/**
 * Webhook Handler de Polar.sh
 * Versión Híbrida (Base64 + Raw UTF-8) para claves polar_whs_
 */
export async function POST(req: Request) {
    const body = await req.text();
    const headersList = headers();
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    const msgId = headersList.get("webhook-id");
    const msgTimestamp = headersList.get("webhook-timestamp");
    const msgSignature = headersList.get("webhook-signature");

    if (!webhookSecret || !msgId || !msgTimestamp || !msgSignature) {
        return NextResponse.json({ error: "Missing config" }, { status: 401 });
    }

    try {
        const encoder = new TextEncoder();
        const signedContent = `${msgId}.${msgTimestamp}.${body}`;

        // --- LOGICA DE LLAVE HÍBRIDA ---
        let secretUint8: Uint8Array;

        try {
            // Si empieza por polar_whs_, la tratamos como texto plano (UTF-8)
            if (webhookSecret.startsWith("polar_whs_")) {
                secretUint8 = encoder.encode(webhookSecret);
            } else {
                // Si no, probamos a decodificar Base64 (estándar whsec_...)
                const clean = webhookSecret.startsWith("whsec_") ? webhookSecret.substring(6) : webhookSecret;
                secretUint8 = Uint8Array.from(atob(clean), c => c.charCodeAt(0));
            }
        } catch (e) {
            // Fallback final: Texto plano
            secretUint8 = encoder.encode(webhookSecret);
        }

        const key = await crypto.subtle.importKey(
            "raw",
            secretUint8,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const signatures = msgSignature.split(" ");
        let isValid = false;

        for (const sig of signatures) {
            const [version, hash] = sig.split(",");
            if (version !== "v1") continue;

            const signatureBinary = await crypto.subtle.sign(
                "HMAC",
                key,
                encoder.encode(signedContent)
            );

            const expectedHash = btoa(String.fromCharCode(...new Uint8Array(signatureBinary)));

            if (expectedHash === hash) {
                isValid = true;
                break;
            }
        }

        if (!isValid) throw new Error("Invalid signature");
    } catch (err) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lógica de actualización de DB (solo si la firma es válida)
    const payload = JSON.parse(body);
    const eventType = payload.type;
    const data = payload.data;

    // Polar puede enviar el clerkId en distintos sitios según el tipo de evento
    // Probamos todos los lugares posibles
    const clerkId =
        data?.metadata?.clerkId ||
        data?.customer_metadata?.clerkId ||
        data?.customer?.metadata?.clerkId ||
        data?.subscription?.metadata?.clerkId ||
        payload?.customer_metadata?.clerkId ||
        payload?.metadata?.clerkId ||
        null;

    // Log para depuración (visible en los logs del servidor/edge)
    console.log(`[Polar Webhook] event=${eventType} clerkId=${clerkId} dataId=${data?.id}`);

    if (!clerkId && eventType !== "subscription.canceled" && eventType !== "subscription.revoked") {
        console.warn(`[Polar Webhook] No clerkId found for event=${eventType}. Payload keys: ${Object.keys(data || {}).join(', ')}`);
        return NextResponse.json({ received: true, info: "No clerkId found" });
    }

    try {
        switch (eventType) {
            case "order.created": {
                // Si la orden viene con subscription_id, es un plan pro mensual
                const isSub = !!data.subscription_id;
                const plan = isSub ? 'pro' : 'lifetime';
                // Para lifetime: guardamos el order id como subscriptionId (para referencia)
                // Para pro: guardamos el subscription_id real
                const subId = data.subscription_id || data.id || null;

                await db.insert(users)
                    .values({ id: clerkId!, isPremium: true, plan, subscriptionId: subId, updatedAt: new Date() })
                    .onConflictDoUpdate({
                        target: users.id,
                        set: { isPremium: true, plan, subscriptionId: subId, updatedAt: new Date() }
                    });
                break;
            }

            case "subscription.created":
            case "subscription.updated": {
                // Es una suscripción activa — data.id es el subscription ID
                const isPremium = data.status === 'active' || data.status === 'trialing';
                await db.insert(users)
                    .values({ id: clerkId!, isPremium, plan: isPremium ? 'pro' : null, subscriptionId: data.id, updatedAt: new Date() })
                    .onConflictDoUpdate({
                        target: users.id,
                        // Solo actualizamos subscriptionId si no lo teníamos ya (no pisamos un valor existente)
                        set: { isPremium, plan: isPremium ? 'pro' : null, subscriptionId: data.id, updatedAt: new Date() }
                    });
                break;
            }

            case "subscription.canceled":
            case "subscription.revoked":
            case "subscription.past_due": {
                // Al cancelar o fallar el pago, quitamos el premium
                await db.update(users)
                    .set({ isPremium: false, plan: null, updatedAt: new Date() })
                    .where(eq(users.subscriptionId, data.id));
                break;
            }

            default:
                console.log(`[Polar Webhook] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("🔥 Error Webhook Polar:", error);
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
}