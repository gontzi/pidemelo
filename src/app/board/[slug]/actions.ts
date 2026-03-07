'use server'

import { db } from "@/db";
import { ideas, votes } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

// 🛠️ Eliminado: import crypto from 'crypto';

function getFingerprint() {
    const cookieStore = cookies();
    let fingerprint = cookieStore.get('voter-id')?.value;

    if (!fingerprint) {
        fingerprint = uuidv4();
        // Nota: En Server Actions de Next.js, cookies().set() funciona directamente
        cookies().set('voter-id', fingerprint, { maxAge: 60 * 60 * 24 * 365 });
    }

    return fingerprint;
}

// 🌐 Versión compatible con Edge Runtime (Web Crypto API)
async function getIpHash() {
    const fallback = 'unknown';
    const forwardedFor = headers().get('x-forwarded-for') || fallback;
    const ip = forwardedFor.split(',')[0].trim();

    // Usamos la API nativa de Edge
    const msgUint8 = new TextEncoder().encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function submitIdea(boardId: string, slug: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagId = formData.get('tagId') as string | null;

    if (!title || !description) return { error: "Faltan campos." };

    // ⚡️ IMPORTANTE: Ahora necesitamos await porque el hash es asíncrono
    const ipHash = await getIpHash();
    const COOLDOWN_MINUTES = 5;

    // Verificar cooldown
    const recentIdea = await db.query.ideas.findFirst({
        where: eq(ideas.authorFingerprint, ipHash),
        orderBy: [desc(ideas.createdAt)]
    });

    if (recentIdea) {
        const timeDiff = Date.now() - new Date(recentIdea.createdAt).getTime();
        if (timeDiff < COOLDOWN_MINUTES * 60 * 1000) {
            return { error: `Espera ${COOLDOWN_MINUTES} minutos antes de publicar otra idea.` };
        }
    }

    try {
        await db.insert(ideas).values({
            boardId,
            tagId: tagId || null,
            title,
            description,
            authorFingerprint: ipHash,
        });

        revalidatePath(`/board/${slug}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Hubo un error al guardar tu petición." };
    }
}

export async function upvoteIdea(ideaId: string, slug: string) {
    const fingerprint = getFingerprint();

    const existingVote = await db.query.votes.findFirst({
        where: and(eq(votes.ideaId, ideaId), eq(votes.anonymousFingerprint, fingerprint))
    });

    if (!existingVote) {
        await db.insert(votes).values({ ideaId, anonymousFingerprint: fingerprint });
        revalidatePath(`/board/${slug}`);
    }
}