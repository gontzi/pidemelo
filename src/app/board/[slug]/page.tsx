import type { Metadata } from 'next'
import { db } from "@/db";
import { boards, ideas, votes } from "@/db/schema";
import { eq, desc, ne, count, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicBoardClient from "./PublicBoardClient";
import SubmitIdeaForm from "./SubmitIdeaForm";
import SubmitIdeaSheet from "./SubmitIdeaSheet";
import { Panel } from "@/components/ui/panel";
import { getDictionary } from "@/i18n";

import JsonLd from "@/components/JsonLd";
import { getVotedIdeaIds } from "@/lib/voter";

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

    // Conteo de votos agregado en SQL (evita cargar todas las filas de votos)
    const ideaIds = board.ideas.map(i => i.id);
    const voteRows = ideaIds.length > 0
        ? await db.select({ ideaId: votes.ideaId, count: count() })
            .from(votes)
            .where(inArray(votes.ideaId, ideaIds))
            .groupBy(votes.ideaId)
        : [];
    const voteCountMap = new Map(voteRows.map(r => [r.ideaId, r.count]));
    const votedIdeaIds = await getVotedIdeaIds(ideaIds);

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
            <header className="px-4 md:px-6 pt-5 md:pt-8">
                <div className="max-w-5xl mx-auto rounded-xl border border-border bg-card p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground break-words text-balance">
                            {board.name}
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xl mt-0.5">
                            {t.public_board_page.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={`/board/${board.slug}/roadmap`}
                            className="inline-flex items-center h-10 px-4 rounded-lg border border-border bg-card text-foreground text-sm font-medium transition-colors hover:bg-muted"
                        >
                            {t.public_board_page.roadmap_btn}
                        </Link>
                        <a
                            href="#propose"
                            className="hidden lg:inline-flex items-center h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90"
                        >
                            {t.public_board_page.submit_fab}
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">

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
                        votedIdeaIds={votedIdeaIds}
                    dict={t.public_board_client}
                    />

                    {/* Formulario en línea (solo escritorio). En móvil se abre como hoja inferior */}
                    <aside id="propose" className="hidden lg:block lg:sticky lg:top-20 w-full scroll-mt-24">
                        <Panel tone="cream" padding="lg" className="w-full">
                            <h2 className="font-heading text-lg font-bold tracking-tight mb-1">{t.public_board_page.form_title}</h2>
                            <p className="text-muted-foreground font-medium text-sm mb-5">{t.public_board_page.form_desc}</p>
                            <SubmitIdeaForm
                                boardId={board.id}
                                boardSlug={board.slug}
                                dict={t.submit_idea_form}
                                imageDict={t.image_upload}
                                tags={board.tags}
                            />
                        </Panel>
                    </aside>

                </div>
            </main>

            <SubmitIdeaSheet
                boardId={board.id}
                boardSlug={board.slug}
                formTitle={t.public_board_page.form_title}
                formDesc={t.public_board_page.form_desc}
                dict={t.submit_idea_form}
                imageDict={t.image_upload}
                tags={board.tags}
                triggerLabel={t.public_board_page.submit_fab}
            />

        </div>
    );
}
