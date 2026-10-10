import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import SubmitIdeaForm from "../../../board/[slug]/SubmitIdeaForm";
import { getDictionary } from "@/i18n";
import { Suspense } from "react";
import WidgetSkeleton from "@/components/WidgetSkeleton";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function WidgetPage({
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
                <FormContent params={params} searchParams={searchParams} t={t} />
            </Suspense>
        </div>
    );
}

async function FormContent({ params, searchParams, t }: {
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
            tags: true,
            user: true,
            ideas: {
                with: { votes: true, tag: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-900'} transition-colors`}>
            <main className="p-4 space-y-8">
                {/* Minimal Header for Widget */}
                {widgetVersion !== 'lite' && (
                    <div className={`flex items-center justify-between pb-4 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'} transition-colors`}>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">{board.name}</h1>
                            <p className={`text-xs font-medium tracking-tight opacity-70 ${isDarkMode ? 'text-zinc-400' : ''}`}>{t.widget_page.vote_or_add}{board.name}?</p>
                        </div>
                    </div>
                )}

                {/* Form at Top for Widget to save space */}
                <section className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50/50 border-zinc-100'} border p-6 rounded-2xl transition-colors`}>
                    {widgetVersion !== 'lite' && (
                        <h2 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                            <span>💡</span> {t.widget_page.suggest}
                        </h2>
                    )}
                    <SubmitIdeaForm
                        boardId={board.id}
                        boardSlug={board.slug}
                        accentColor={accentColor}
                        textColor={textColor}
                        isDarkMode={isDarkMode}
                        dict={t.submit_idea_form}
                        imageDict={t.image_upload}
                        widgetVersion={widgetVersion}
                        tags={board.tags}
                    />
                </section>

                {/* Watermark */}
                <div className="text-center">
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
            </main>
        </div>
    );
}
