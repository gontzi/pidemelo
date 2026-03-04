'use server'

import { db } from "@/db";
import { ideas, votes } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

function getFingerprint() {
    const cookieStore = cookies();
    let fingerprint = cookieStore.get('voter-id')?.value;

    if (!fingerprint) {
        fingerprint = uuidv4();
        cookies().set('voter-id', fingerprint, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    }

    return fingerprint;
}

function getIpHash() {
    const fallback = 'unknown';
    const forwardedFor = headers().get('x-forwarded-for') || fallback;
    const ip = forwardedFor.split(',')[0].trim();
    // Using a simple SHA-256 hash of the IP for anonymity
    return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function submitIdea(boardId: string, slug: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || !description) return { error: "Faltan campos." };

    const ipHash = getIpHash();
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
            title,
            description,
            authorFingerprint: ipHash,
        });

        revalidatePath(`/board/${slug}`);
        return { success: true };
    } catch {
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
