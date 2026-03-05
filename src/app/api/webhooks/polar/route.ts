import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

/**
 * Webhook Handler para Polar.sh (Versión Infalible para Producción)
 */
export async function POST(req: Request) {
    const body = await req.text();
    const headersList = headers();
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    const id = headersList.get("webhook-id");
    const timestamp = headersList.get("webhook-timestamp");
    const signature = headersList.get("webhook-signature");

    if (!webhookSecret) {
        console.error("❌ POLAR_WEBHOOK_SECRET no configurado");
        return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }

    if (!id || !timestamp || !signature) {
        return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    // 1. VERIFICACIÓN DE FIRMA MANUAL (Compatible con Web Standard Crypto / Edge Runtime)
    try {
        const encoder = new TextEncoder();
        // Polar usa Base64 para el secreto (sin el prefijo whsec_)
        const secretKey = webhookSecret.startsWith("whsec_") ? webhookSecret.substring(6) : webhookSecret;

        // Convertimos el secreto de Base64 a ArrayBuffer (Polar secrets están en Base64)
        const secretBuffer = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0));

        const key = await crypto.subtle.importKey(
            "raw",
            secretBuffer,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify", "sign"]
        );

        const signedContent = `${id}.${timestamp}.${body}`;
        const signatures = signature.split(" ");
        let isVerified = false;

        for (const sig of signatures) {
            const [version, hash] = sig.split(",");
            if (version !== "v1") continue;

            const sigBuffer = Uint8Array.from(atob(hash), c => c.charCodeAt(0));
            isVerified = await crypto.subtle.verify(
                "HMAC",
                key,
                sigBuffer,
                encoder.encode(signedContent)
            );
            if (isVerified) break;
        }

        if (!isVerified) throw new Error("Invalid signature");
    } catch (err) {
        console.warn("⚠️ Firma de Polar inválida");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. PROCESAMIENTO DEL EVENTO
    const payload = JSON.parse(body);
    const eventType = payload.type;
    const data = payload.data;

    // Detección de ClerkId en múltiples fuentes de Polar
    const clerkId = data.metadata?.clerkId ||
        data.customer_metadata?.clerkId ||
        data.custom_field_data?.clerkId ||
        payload.customer_metadata?.clerkId;

    try {
        switch (eventType) {
            case "order.created": {
                const plan = !!data.subscription_id ? 'pro' : 'lifetime';
                if (!clerkId) break;

                await db.insert(users)
                    .values({
                        id: clerkId,
                        isPremium: true,
                        plan: plan,
                        subscriptionId: data.subscription_id || null,
                        updatedAt: new Date(),
                    })
                    .onConflictDoUpdate({
                        target: users.id,
                        set: {
                            isPremium: true,
                            plan: plan,
                            subscriptionId: data.subscription_id || null,
                            updatedAt: new Date(),
                        }
                    });
                break;
            }

            case "subscription.created":
            case "subscription.updated": {
                if (!clerkId) break;
                const isPremium = data.status === 'active' || data.status === 'trialing';

                await db.insert(users)
                    .values({
                        id: clerkId,
                        isPremium: isPremium,
                        plan: isPremium ? 'pro' : null,
                        subscriptionId: data.id,
                        updatedAt: new Date(),
                    })
                    .onConflictDoUpdate({
                        target: users.id,
                        set: {
                            isPremium: isPremium,
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
                if (data.id) {
                    await db.update(users)
                        .set({
                            isPremium: false,
                            plan: null,
                            updatedAt: new Date(),
                        })
                        .where(eq(users.subscriptionId, data.id));
                }
                break;
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error Neon DB:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}