import type { Metadata } from 'next'
import { db } from "@/db";
import { boards, ideas, votes } from "@/db/schema";
import { eq, desc, ne, count, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicBoardClient from "./PublicBoardClient";
import SubmitIdeaForm from "./SubmitIdeaForm";
import MobileSubmitSheet from "./MobileSubmitSheet";
import { getDictionary } from "@/i18n";
import { auth } from "@clerk/nextjs/server";

import JsonLd from "@/components/JsonLd";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const t = await getDictionary();
    
    try {
        const board = await db.query.boards.findFirst({
            where: eq(boards.slug, params.slug),
            with: {
                ideas: { limit: 1 }
            }
        })

        if (!board) {
            return {
                title: t.not_found.title,
                robots: { index: false }
            }
        }

        const hasContent = board.ideas.length > 0;
        const title = t.seo.board_title.replace('%s', board.name);
        const description = t.seo.board_description.replace('%s', board.name);
        const url = `https://pidemelo.app/board/${board.slug}`

        return {
            title: board.name,
            description,
            robots: {
                index: hasContent,
                follow: true,
            },
            alternates: {
                canonical: url,
                languages: {
                    'es': `${url}?lang=es`,
                    'en': `${url}?lang=en`,
                    'x-default': url,
                }
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
    } catch {
        return {
            title: 'Pídemelo',
            robots: { index: false }
        }
    }
}

export default async function PublicBoardPage({ params }: { params: { slug: string } }) {
    const t = await getDictionary();
    const { userId } = auth();

    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, params.slug),
        with: {
            tags: true,
            user: true,
            ideas: {
                where: ne(ideas.status, 'archivado'),
                with: { tag: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    const isCurrentUserAdmin = userId === board.userId;

    // Conteo de votos agregado en SQL (evita cargar todas las filas de votos)
    const ideaIds = board.ideas.map(i => i.id);
    const voteRows = ideaIds.length > 0
        ? await db.select({ ideaId: votes.ideaId, count: count() })
            .from(votes)
            .where(inArray(votes.ideaId, ideaIds))
            .groupBy(votes.ideaId)
        : [];
    const voteCountMap = new Map(voteRows.map(r => [r.ideaId, r.count]));

    const sortedIdeas = board.ideas.sort((a, b) => (voteCountMap.get(b.id) ?? 0) - (voteCountMap.get(a.id) ?? 0));

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": board.name,
        "description": t.seo.board_description.replace('%s', board.name),
        "url": `https://pidemelo.app/board/${board.slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": sortedIdeas.slice(0, 10).map((idea, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": idea.title,
                "description": idea.description
            }))
        }
    };

    return (
        <div className="min-h-screen pb-nav lg:pb-24">
            <JsonLd schema={collectionSchema} />

            {/* Header */}
            <header className="bg-white border-b border-zinc-200 py-8 md:py-16 mb-6 md:mb-10 shadow-sm">
                <div className="max-w-3xl mx-auto px-5 text-center space-y-3 md:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5C00]/10 text-[#FF5C00] text-xs md:text-sm font-bold border border-[#FF5C00]/20 mb-1 md:mb-2">
                        {t.public_board_page.tag}
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 break-words">
                        {board.name}
                    </h1>
                    <p className="text-base md:text-xl text-zinc-500 max-w-xl mx-auto font-medium">
                        {t.public_board_page.description}
                    </p>
                    <div className="pt-2">
                        <Link
                            href={`/board/${board.slug}/roadmap`}
                            className="inline-flex items-center px-5 h-10 rounded-full border border-zinc-200 bg-white text-zinc-700 text-[11px] font-black uppercase tracking-widest transition-colors hover:border-[#FF5C00]/60 hover:text-[#FF5C00] active:scale-95"
                        >
                            {t.public_board_page.roadmap_btn}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-10 items-start">

                    {/* Contenido principal: feed de ideas */}
                    <PublicBoardClient
                        initialIdeas={sortedIdeas.map(i => ({
                            ...i,
                            status: i.status as 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado',
                            title: i.title ?? '',
                            description: i.description ?? '',
                            imageUrl: i.imageUrl,
                            votesCount: voteCountMap.get(i.id) ?? 0
                        }))}
                        boardSlug={board.slug}
                        dict={t.public_board_client}
                    />

                    {/* Formulario en línea (solo escritorio). En móvil se abre como hoja inferior */}
                    <aside className="hidden lg:block lg:sticky lg:top-20 bg-white border border-zinc-200 p-8 rounded-3xl shadow-lg shadow-zinc-200/40 w-full">
                        <h2 className="font-heading text-xl font-bold tracking-tight mb-1">{t.public_board_page.form_title}</h2>
                        <p className="text-zinc-500 font-medium text-sm mb-5">{t.public_board_page.form_desc}</p>
                        <SubmitIdeaForm
                            boardId={board.id}
                            boardSlug={board.slug}
                            dict={t.submit_idea_form}
                            imageDict={t.image_upload}
                            tags={board.tags}
                            isCurrentUserAdmin={isCurrentUserAdmin}
                        />
                    </aside>

                </div>
            </main>

            <MobileSubmitSheet
                boardId={board.id}
                boardSlug={board.slug}
                formTitle={t.public_board_page.form_title}
                formDesc={t.public_board_page.form_desc}
                dict={t.submit_idea_form}
                imageDict={t.image_upload}
                tags={board.tags}
                isCurrentUserAdmin={isCurrentUserAdmin}
                fabLabel={t.public_board_page.submit_fab}
            />

        </div>
    );
}
