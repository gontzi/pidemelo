import { cookies, headers } from "next/headers";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { votes } from "@/db/schema";
import { sha256 } from "@/lib/feedback";

export const VOTER_COOKIE = 'voter-id';

// IP de confianza: priorizamos la cabecera de Cloudflare y, como respaldo,
// el último valor de X-Forwarded-For (el más cercano a nuestro proxy).
export function getClientIp(): string {
    const cfIp = headers().get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();

    const forwardedFor = headers().get('x-forwarded-for');
    if (forwardedFor) {
        const parts = forwardedFor.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length > 0) return parts[parts.length - 1];
    }

    return 'unknown';
}

// Identidad de voto = cookie de dispositivo + IP.
export async function fingerprintFor(cookieId: string): Promise<string> {
    return sha256(`${cookieId}|${getClientIp()}`);
}

// Ideas que el visitante actual ya ha votado. Solo lectura (no crea la cookie),
// para poder usarse desde Server Components.
export async function getVotedIdeaIds(ideaIds: string[]): Promise<string[]> {
    const cookieId = cookies().get(VOTER_COOKIE)?.value;
    if (!cookieId || ideaIds.length === 0) return [];

    const fingerprint = await fingerprintFor(cookieId);
    const rows = await db
        .select({ ideaId: votes.ideaId })
        .from(votes)
        .where(and(eq(votes.anonymousFingerprint, fingerprint), inArray(votes.ideaId, ideaIds)));

    return rows.map(r => r.ideaId);
}
