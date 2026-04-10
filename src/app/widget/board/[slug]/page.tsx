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
    const widgetVersion = searchParams.version === 'lite' ? 'lite' : 'normal';
    const t = await getDictionary(lang);

    return (
        <div className="min-h-screen transition-colors">
            <Suspense fallback={<WidgetSkeleton />}>
                <BoardContent params={params} searchParams={searchParams} t={t} />
            </Suspense>
        </div>
    );
}

async function BoardContent({ params, searchParams, t }: any) {
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

    const isOwnerPremium = board.user?.isPremium || board.user?.plan === 'pro' || board.user?.plan === 'lifetime';

    if (!isOwnerPremium) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-zinc-50 border-4 border-dashed border-zinc-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-3xl mb-4">🔒</div>
                <h1 className="text-xl font-black text-zinc-900 mb-2 italic">{t.widget_page.disabled_title}</h1>
                <p className="text-sm text-zinc-500 font-medium max-w-xs mb-6 leading-relaxed">
                    {t.widget_page.disabled_desc}
                </p>
                <a
                    href="https://pidemelo.app"
                    target="_blank"
                    className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] hover:underline"
                >
                    {t.widget_page.go_to}
                </a>
            </div>
        );
    }

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
                    <span>Powered by</span>
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
