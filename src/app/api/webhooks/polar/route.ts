import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";

export const runtime = 'edge';

/**
 * Webhook Handler para Polar.sh
 * Automatiza la gestión de estados Premium de los usuarios.
 */
export async function POST(req: Request) {
    const body = await req.text();
    const headersList = headers();
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("❌ POLAR_WEBHOOK_SECRET no configurado");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // 1. VERIFICACIÓN DE FIRMA (A prueba de fallos)
    let payload: any;
    try {
        const whHeaders = {
            "webhook-id": headersList.get("webhook-id") || "",
            "webhook-signature": headersList.get("webhook-signature") || "",
            "webhook-timestamp": headersList.get("webhook-timestamp") || "",
        };

        // Intento 1: Con el secreto tal cual (recomendado)
        try {
            const wh = new Webhook(webhookSecret);
            payload = wh.verify(body, whHeaders);
        } catch (e) {
            // Intento 2: Sin el prefijo 'whsec_' (fallback por si acaso)
            const normalized = webhookSecret.startsWith("whsec_") ? webhookSecret.substring(6) : webhookSecret;
            const wh = new Webhook(normalized);
            payload = wh.verify(body, whHeaders);
        }
    } catch (err) {
        // Si ambos fallan, devolvemos 401. Revisa tu POLAR_WEBHOOK_SECRET en Vercel/Cloudflare.
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const eventType = payload.type;
    const data = payload.data;



    // Intentamos extraer el clerkId de varias fuentes posibles
    const clerkId = data.metadata?.clerkId ||
        data.customer_metadata?.clerkId ||
        data.custom_field_data?.clerkId;

    try {
        switch (eventType) {
            case "order.created": {
                // Una orden puede ser por una suscripción (pro) o por un pago único (lifetime)
                const isSubscriptionOrder = !!data.subscription_id;
                const plan = isSubscriptionOrder ? 'pro' : 'lifetime';
                const subscriptionId = data.subscription_id || null;

                if (clerkId) {

                    await db.insert(users)
                        .values({
                            id: clerkId,
                            isPremium: true,
                            plan: plan,
                            subscriptionId: subscriptionId,
                            updatedAt: new Date(),
                        })
                        .onConflictDoUpdate({
                            target: users.id,
                            set: {
                                isPremium: true,
                                plan: plan,
                                subscriptionId: subscriptionId,
                                updatedAt: new Date(),
                            }
                        });

                }
                break;
            }

            case "subscription.created":
            case "subscription.updated": {
                const status = data.status; // 'active', 'trialing', etc.
                const subscriptionId = data.id;
                const isPremium = status === 'active' || status === 'trialing';

                if (clerkId) {

                    await db.insert(users)
                        .values({
                            id: clerkId,
                            isPremium: isPremium,
                            plan: isPremium ? 'pro' : null,
                            subscriptionId: subscriptionId,
                            updatedAt: new Date(),
                        })
                        .onConflictDoUpdate({
                            target: users.id,
                            set: {
                                isPremium: isPremium,
                                plan: isPremium ? 'pro' : null,
                                subscriptionId: subscriptionId,
                                updatedAt: new Date(),
                            }
                        });

                }
                break;
            }

            case "subscription.canceled":
            case "subscription.revoked":
            case "subscription.past_due": {
                const subscriptionId = data.id;


                if (subscriptionId) {
                    await db.update(users)
                        .set({
                            isPremium: false,
                            plan: null,
                            updatedAt: new Date(),
                        })
                        .where(eq(users.subscriptionId, subscriptionId));

                }
                break;
            }

            default:

        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error crítico en Webhook de Polar:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}