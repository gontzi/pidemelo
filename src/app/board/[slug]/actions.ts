'use server'

import { db } from "@/db";
import { ideas, votes, boards, users } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { auth } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const tagId = formData.get('tagId') as string | null;
        const imageUrl = formData.get('imageUrl') as string | null;

        if (!title || !description) return { error: "Faltan campos." };

        // 1. Identificación y Plan
        const { userId } = auth();
        let isPremiumUser = false;

        if (userId) {
            const userData = await db.query.users.findFirst({
                where: eq(users.id, userId)
            });
            if (userData && (userData.isPremium || userData.plan === 'pro' || userData.plan === 'lifetime')) {
                isPremiumUser = true;
            }
        }

        // 2. Lógica de Cooldowns
        const COOLDOWN_SECONDS = isPremiumUser ? 30 : 180;

        // Usamos ipHash como fingerprint para todos (más estricto y seguro)
        const ipHash = await getIpHash();

        // 3. Validación en Drizzle
        const recentIdea = await db.query.ideas.findFirst({
            where: eq(ideas.authorFingerprint, ipHash),
            orderBy: [desc(ideas.createdAt)]
        });

        // 4. Cálculo de Tiempo y Error UI
        if (recentIdea && recentIdea.createdAt) {
            const pastMs = recentIdea.createdAt instanceof Date
                ? recentIdea.createdAt.getTime()
                : new Date(recentIdea.createdAt).getTime();

            if (!isNaN(pastMs)) {
                const elapsedSeconds = Math.floor((Date.now() - pastMs) / 1000);

                if (elapsedSeconds < COOLDOWN_SECONDS) {
                    const remainingSeconds = COOLDOWN_SECONDS - elapsedSeconds;

                    if (!isPremiumUser && remainingSeconds > 60) {
                        const mins = Math.floor(remainingSeconds / 60);
                        const secs = remainingSeconds % 60;
                        return { error: `Estás enviando ideas muy rápido. Por favor, espera ${mins} minutos y ${secs} segundos.` };
                    } else {
                        return { error: `Por favor, espera ${remainingSeconds} segundos antes de enviar otra idea.` };
                    }
                }
            }
        }

        await db.insert(ideas).values({
            boardId,
            tagId: tagId || null,
            title,
            description,
            imageUrl,
            authorFingerprint: ipHash,
        });

        // 📧 ENVÍO DE EMAIL TRANSACCIONAL CON RESEND
        try {
            // Consulta para obtener la info del tablero y su dueño
            const boardData = await db.query.boards.findFirst({
                where: eq(boards.id, boardId),
                with: { user: true }
            });

            if (boardData && boardData.notifyNewIdeas && boardData.user?.email) {
                const ownerEmail = boardData.user.email;
                const boardName = boardData.name;

                // Obtenemos preferencia de idioma desde la cookie (como en la web)
                const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
                const locale = cookieLocale === 'en' ? 'en' : 'es';

                let subject = '';
                let html = '';

                if (locale === 'es') {
                    subject = `🔔 Te están dando la chapa en: ${boardName}`;
                    html = `
                    <style>
                        .logo-link { transition: color 0.15s ease-in-out; }
                        .logo-link:hover, .logo-link:hover span { color: #FF5C00 !important; }
                    </style>
                    <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #fafafa; padding: 40px 20px; color: #18181b;">
                        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="https://pidemelo.app" class="logo-link" style="text-decoration: none; color: #18181b; outline: none;">
                                    <span style="font-weight: 900; font-size: 24px; letter-spacing: -1px;">pidemelo<span style="color: #FF5C00;">.</span>app</span>
                                </a>
                            </div>
                            <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.2;">Alguien te está dando la chapa en <b>${boardName}</b></h2>
                            <p style="font-size: 15px; color: #52525b; margin: 0 0 24px 0; line-height: 1.5;">Acaban de dejarte una nueva sugerencia en tu tablón. O igual es una idea brillante, quién sabe.</p>
                            
                            <div style="background-color: #fff7ed; border-left: 4px solid #FF5C00; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
                                <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF5C00; font-weight: 800; margin: 0 0 8px 0;">TÍTULO:</p>
                                <p style="font-size: 16px; font-weight: 700; margin: 0 0 16px 0; color: #18181b;">${title}</p>
                                <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF5C00; font-weight: 800; margin: 0 0 8px 0;">DESCRIPCIÓN:</p>
                                <p style="font-size: 14px; margin: 0; color: #3f3f46; white-space: pre-wrap; font-style: italic;">"${description}"</p>
                            </div>

                            <a href="https://pidemelo.app/dashboard/board/${boardId}" style="display: block; background-color: #FF5C00; color: #ffffff; font-weight: 900; text-decoration: none; padding: 16px 24px; border-radius: 9999px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; text-align: center;">Entrar al panel y gestionar</a>

                            <p style="font-size: 14px; color: #71717a; margin: 24px 0 0 0; text-align: center;">Tú mandas: pásala a planeado, bórrala o ignórala épicamente.</p>
                        </div>
                        <p style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 24px; font-weight: bold;">Un saludo desde Pídemelo 👋</p>
                    </div>`;
                } else {
                    subject = `🔔 Someone is requesting stuff on: ${boardName}`;
                    html = `
                    <style>
                        .logo-link { transition: color 0.15s ease-in-out; }
                        .logo-link:hover, .logo-link:hover span { color: #FF5C00 !important; }
                    </style>
                    <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #fafafa; padding: 40px 20px; color: #18181b;">
                        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="https://pidemelo.app" class="logo-link" style="text-decoration: none; color: #18181b; outline: none;">
                                    <span style="font-weight: 900; font-size: 24px; letter-spacing: -1px;">pidemelo<span style="color: #FF5C00;">.</span>app</span>
                                </a>
                            </div>
                            <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.2;">Someone is requesting stuff on <b>${boardName}</b></h2>
                            <p style="font-size: 15px; color: #52525b; margin: 0 0 24px 0; line-height: 1.5;">Someone just dropped a new request on your board. Or maybe it's a genius idea, who knows.</p>
                            
                            <div style="background-color: #fff7ed; border-left: 4px solid #FF5C00; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
                                <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF5C00; font-weight: 800; margin: 0 0 8px 0;">TITLE:</p>
                                <p style="font-size: 16px; font-weight: 700; margin: 0 0 16px 0; color: #18181b;">${title}</p>
                                <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF5C00; font-weight: 800; margin: 0 0 8px 0;">DESCRIPTION:</p>
                                <p style="font-size: 14px; margin: 0; color: #3f3f46; white-space: pre-wrap; font-style: italic;">"${description}"</p>
                            </div>

                            <a href="https://pidemelo.app/dashboard/board/${boardId}" style="display: block; background-color: #FF5C00; color: #ffffff; font-weight: 900; text-decoration: none; padding: 16px 24px; border-radius: 9999px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; text-align: center;">Open dashboard to review</a>

                            <p style="font-size: 14px; color: #71717a; margin: 24px 0 0 0; text-align: center;">You're the boss: move it to planned, delete it, or ignore it entirely.</p>
                        </div>
                        <p style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 24px; font-weight: bold;">Keep shipping from Pidemelo 👋</p>
                    </div>`;
                }

                await resend.emails.send({
                    from: 'Pídemelo <hola@pidemelo.app>',
                    to: ownerEmail,
                    subject,
                    html,
                });
            }
        } catch (emailError) {
            // Manejamos silenciosamente el error para que la idea se registre igual sin fallar en el front
            console.log("Error al enviar email a través de Resend:", emailError instanceof Error ? emailError.message : String(emailError));
        }

        revalidatePath(`/board/${slug}`);
        return { success: true };
    } catch (e) {
        // En Cloudflare Edge, console.error con objetos complejos crashea el worker. Lo pasamos a string.
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.log("Error seguro capturado en submitIdea:", errorMsg);

        // Devolvemos el error real para verlo en UI en vez de la caída del runtime (útil para debugear Edge)
        return { error: `Error inesperado: ${errorMsg}` };
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