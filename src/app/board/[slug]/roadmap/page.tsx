import type { Metadata } from 'next'
import { db } from "@/db";
import { boards, ideas, votes } from "@/db/schema";
import { eq, desc, ne, count, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import RoadmapClient from "../RoadmapClient";
import { getDictionary } from "@/i18n";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const t = await getDictionary();

    try {
        const board = await db.query.boards.findFirst({
            where: eq(boards.slug, params.slug),
            columns: { name: true, slug: true }
        });

        if (!board) {
            return {
                title: t.not_found.title,
                robots: { index: false }
            };
        }

        return {
            title: `${board.name} — ${t.roadmap.title}`,
            description: t.roadmap.subtitle,
            robots: { index: true, follow: true },
            alternates: {
                canonical: `https://pidemelo.app/board/${board.slug}/roadmap`,
            },
        };
    } catch {
        return {
            title: 'Pídemelo',
            robots: { index: false }
        };
    }
}

export default async function RoadmapPage({ params }: Props) {
    const t = await getDictionary();

    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, params.slug),
        with: {
            ideas: {
                where: ne(ideas.status, 'archivado'),
                with: { tag: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    const ideaIds = board.ideas.map(i => i.id);
    const voteRows = ideaIds.length > 0
        ? await db.select({ ideaId: votes.ideaId, count: count() })
            .from(votes)
            .where(inArray(votes.ideaId, ideaIds))
            .groupBy(votes.ideaId)
        : [];
    const voteCountMap = new Map(voteRows.map(r => [r.ideaId, r.count]));

    const roadmapIdeas = board.ideas.map(i => ({
        id: i.id,
        title: i.title ?? '',
        description: i.description ?? '',
        status: i.status as 'planeado' | 'en_progreso' | 'completado',
        imageUrl: i.imageUrl,
        votesCount: voteCountMap.get(i.id) ?? 0,
        tag: i.tag ? { id: i.tag.id, name: i.tag.name, color: i.tag.color } : null,
        adminResponse: i.adminResponse ?? null,
    }));

    return (
        <div className="min-h-screen pb-16 md:pb-24">
            <header className="bg-white border-b border-zinc-200 py-8 md:py-12 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-2">
                    <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 break-words">
                        {board.name} — {t.roadmap.title}
                    </h1>
                    <p className="text-zinc-500 font-medium">{t.roadmap.subtitle}</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                <RoadmapClient
                    boardSlug={board.slug}
                    initialIdeas={roadmapIdeas}
                    dict={t.roadmap}
                />
            </main>
        </div>
    );
}