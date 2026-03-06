import type { Metadata } from 'next'
import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicBoardClient from "./PublicBoardClient";
import SubmitIdeaForm from "./SubmitIdeaForm";

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
        <div className="min-h-screen pb-24">

            {/* Marc Lou Style Header */}
            <header className="bg-white border-b border-zinc-200 py-16 mb-10 shadow-sm">
                <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5C00]/10 text-[#FF5C00] text-sm font-bold border border-[#FF5C00]/20 mb-2">
                        🚀 Planes y desvaríos
                    </div>
                    <h1 className="font-heading text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900">
                        {board.name}
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-xl mx-auto font-medium">
                        Danos la chapa con tus ideas o vota las burradas que han dicho otros.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 grid md:grid-cols-[1fr_360px] gap-10 items-start">

                {/* Left Col: Ideas Feed Component */}
                <PublicBoardClient
                    initialIdeas={sortedIdeas.map(i => ({
                        ...i,
                        status: i.status as 'pending' | 'planned' | 'done',
                        title: i.title ?? '',
                        description: i.description ?? ''
                    }))}
                    boardSlug={board.slug}
                />

                {/* Right Col: High Friction Form */}
                <aside className="sticky top-10 bg-white border border-zinc-200 p-8 rounded-3xl shadow-xl shadow-zinc-200/40">
                    <h2 className="font-heading text-xl font-bold tracking-tight mb-2">Suéltalo todo 💡</h2>
                    <p className="text-zinc-500 font-medium text-sm mb-6">Prometemos leerlo, otra cosa es que te hagamos caso.</p>

                    <SubmitIdeaForm boardId={board.id} boardSlug={board.slug} />
                </aside>

            </main>

        </div>
    );
}
