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
    const data = payload.data;
    const clerkId = data.metadata?.clerkId || data.customer_metadata?.clerkId;

    if (!clerkId) return NextResponse.json({ received: true });

    try {
        const isSub = !!data.subscription_id;
        const plan = isSub ? 'pro' : 'lifetime';
        const subId = data.subscription_id || data.id || null;

        await db.insert(users)
            .values({ id: clerkId, isPremium: true, plan, subscriptionId: subId, updatedAt: new Date() })
            .onConflictDoUpdate({
                target: users.id,
                set: { isPremium: true, plan, subscriptionId: subId, updatedAt: new Date() }
            });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
}