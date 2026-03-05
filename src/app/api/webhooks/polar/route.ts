import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks"; // ¡Usamos la librería estándar!

// 🚫 Adiós import crypto from "crypto";

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

    // 1. VERIFICACIÓN DE FIRMA (Usando standardwebhooks compatible con Edge)
    let payload: any;
    try {
        const wh = new Webhook(webhookSecret);
        // Construimos el objeto de headers que espera la librería
        const whHeaders = {
            "webhook-id": headersList.get("webhook-id") || "",
            "webhook-signature": headersList.get("webhook-signature") || "",
            "webhook-timestamp": headersList.get("webhook-timestamp") || "",
        };

        // Verifica y parsea el JSON a la vez
        payload = wh.verify(body, whHeaders);

    } catch (err) {
        console.warn("⚠️ Intento de webhook con firma inválida o faltan headers", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const eventType = payload.type;
    const data = payload.data;

    console.log(`✉️ Webhook recibido de Polar: ${eventType}`);

    try {
        switch (eventType) {
            // CASO: Compra única (Plan Lifetime)
            case "order.created": {
                const clerkUserId = data.customer_metadata?.clerkId || data.metadata?.clerkId;

                if (clerkUserId) {
                    await db.insert(users)
                        .values({
                            id: clerkUserId,
                            isPremium: true,
                            plan: 'lifetime',
                            updatedAt: new Date(),
                        })
                        .onConflictDoUpdate({
                            target: users.id,
                            set: {
                                isPremium: true,
                                plan: 'lifetime',
                                updatedAt: new Date(),
                            }
                        });
                    console.log(`✅ Usuario ${clerkUserId} actualizado a Lifetime`);
                }
                break;
            }

            // CASO: Suscripción nueva o actualizada (Plan Mensual Pro)
            case "subscription.created":
            case "subscription.updated": {
                const clerkUserId = data.customer_metadata?.clerkId || data.metadata?.clerkId;
                const subscriptionId = data.id;
                const status = data.status; // 'active', 'trialing', etc.

                if (clerkUserId) {
                    const isPremium = status === 'active' || status === 'trialing';

                    await db.insert(users)
                        .values({
                            id: clerkUserId,
                            isPremium,
                            plan: isPremium ? 'pro' : null,
                            subscriptionId: subscriptionId,
                            updatedAt: new Date(),
                        })
                        .onConflictDoUpdate({
                            target: users.id,
                            set: {
                                isPremium,
                                plan: isPremium ? 'pro' : null,
                                subscriptionId: subscriptionId,
                                updatedAt: new Date(),
                            }
                        });
                    console.log(`✅ Suscripción ${status} para usuario ${clerkUserId}`);
                }
                break;
            }

            // CASO: Cancelaciones, impagos o revocaciones
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
                    console.log(`❌ Suscripción ${subscriptionId} desactivada / Impagada`);
                }
                break;
            }

            default:
                console.log(`ℹ️ Evento no manejado: ${eventType}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error procesando webhook de Polar:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}