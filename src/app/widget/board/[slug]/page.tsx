import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { eq, desc, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicBoardClient from "../../../board/[slug]/PublicBoardClient";
import { getDictionary } from "@/i18n";
import { Suspense } from "react";
import WidgetSkeleton from "@/components/WidgetSkeleton";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function WidgetBoardPage({
    params,
    searchParams
}: {
    params: { slug: string },
    searchParams: { color?: string, textColor?: string, darkMode?: string, lang?: string, version?: string }
}) {
    const lang = (searchParams.lang === 'en' || searchParams.lang === 'es') ? searchParams.lang : 'es';
    const t = await getDictionary(lang);

    return (
        <div className="min-h-screen transition-colors">
            <Suspense fallback={<WidgetSkeleton />}>
                <BoardContent params={params} searchParams={searchParams} t={t} />
            </Suspense>
        </div>
    );
}

async function BoardContent({ params, searchParams, t }: {
    params: { slug: string };
    searchParams: { color?: string; textColor?: string; darkMode?: string; lang?: string; version?: string };
    t: Awaited<ReturnType<typeof getDictionary>>;
}) {
    const accentColor = searchParams.color ? decodeURIComponent(searchParams.color) : "#FF5C00";
    const textColor = searchParams.textColor ? decodeURIComponent(searchParams.textColor) : "#18181b";
    const isDarkMode = searchParams.darkMode === 'true';
    const widgetVersion = searchParams.version === 'lite' ? 'lite' : 'normal';

    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, params.slug),
        with: {
            user: true,
            ideas: {
                where: ne(ideas.status, 'archivado'),
                with: { votes: true, tag: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    const sortedIdeas = board.ideas.sort((a, b) => b.votes.length - a.votes.length);

    return (
        <div className={`min-h-screen flex flex-col p-4 ${isDarkMode ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-900'}`}>
            <div className="flex-1">
                <PublicBoardClient
                    initialIdeas={sortedIdeas.map(i => ({
                        ...i,
                        status: i.status as 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado',
                        title: i.title ?? '',
                        description: i.description ?? '',
                        imageUrl: i.imageUrl
                    }))}
                    boardSlug={board.slug}
                    accentColor={accentColor}
                    textColor={textColor}
                    isDarkMode={isDarkMode}
                    widgetVersion={widgetVersion}
                    dict={t.public_board_client}
                />
            </div>
            {/* Watermark */}
            <div className="text-center pt-8 mt-auto">
                <a
                    href="https://pidemelo.app"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-300 hover:text-zinc-400 transition-all group"
                >
                    <span>{t.public_board_client.powered_by || 'Powered by'}</span>
                    <span className="font-jakarta font-extrabold lowercase tracking-tighter text-[13px] flex items-center">
                        <span className="group-hover:text-[#FF5C00] transition-colors text-zinc-400">pidemelo</span>
                        <span className="text-[#FF5C00]">.</span>
                        <span className="text-zinc-400">app</span>
                    </span>
                </a>
            </div>
        </div>
    );
}
