import type { Metadata } from 'next'
import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicBoardClient from "./PublicBoardClient";
import SubmitIdeaForm from "./SubmitIdeaForm";
import { getDictionary } from "@/i18n";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, params.slug),
    })

    if (!board) {
        return {
            title: 'Tablero no encontrado',
        }
    }

    const title = `${board.name} — Tablón de sugerencias`
    const description = `Vota y envía tus ideas para "${board.name}". Deja que la comunidad decida qué viene después.`
    const url = `https://pidemelo.app/board/${board.slug}`

    return {
        title: board.name, // El template en layout lo convierte en: "Nombre del board | Pídemelo"
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'website',
            url,
            title,
            description,
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/og-image.png'],
        },
    }
}



export default async function PublicBoardPage({ params }: { params: { slug: string } }) {
    const t = await getDictionary();
    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, params.slug),
        with: {
            ideas: {
                with: { votes: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    const sortedIdeas = board.ideas.sort((a, b) => b.votes.length - a.votes.length);

    return (
        <div className="min-h-screen pb-16 md:pb-24">

            {/* Header */}
            <header className="bg-white border-b border-zinc-200 py-10 md:py-16 mb-6 md:mb-10 shadow-sm">
                <div className="max-w-3xl mx-auto px-5 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5C00]/10 text-[#FF5C00] text-xs md:text-sm font-bold border border-[#FF5C00]/20 mb-2">
                        {t.public_board_page.tag}
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900">
                        {board.name}
                    </h1>
                    <p className="text-base md:text-xl text-zinc-500 max-w-xl mx-auto font-medium">
                        {t.public_board_page.description}
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6">
                {/* Mobile: formulario primero (colapsable) → en desktop se mueve a la derecha */}
                <div className="flex flex-col md:grid md:grid-cols-[1fr_340px] gap-6 md:gap-10 items-start">

                    {/* Left Col: Feed */}
                    <PublicBoardClient
                        initialIdeas={sortedIdeas.map(i => ({
                            ...i,
                            status: i.status as 'pending' | 'planned' | 'done',
                            title: i.title ?? '',
                            description: i.description ?? ''
                        }))}
                        boardSlug={board.slug}
                        dict={t.public_board_client}
                    />

                    {/* Right Col / Mobile Bottom: Formulario */}
                    <aside className="md:sticky md:top-20 bg-white border border-zinc-200 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg shadow-zinc-200/40 w-full order-first md:order-last">
                        <h2 className="font-heading text-lg md:text-xl font-bold tracking-tight mb-1">{t.public_board_page.form_title}</h2>
                        <p className="text-zinc-500 font-medium text-sm mb-5">{t.public_board_page.form_desc}</p>
                        <SubmitIdeaForm boardId={board.id} boardSlug={board.slug} dict={t.submit_idea_form} />
                    </aside>

                </div>
            </main>

        </div>
    );
}
