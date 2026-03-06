import { db } from "@/db";
import { boards, ideas, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicBoardClient from "../../board/[slug]/PublicBoardClient";
import SubmitIdeaForm from "../../board/[slug]/SubmitIdeaForm";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function WidgetPage({
    params,
    searchParams
}: {
    params: { slug: string },
    searchParams: { color?: string, textColor?: string, darkMode?: string }
}) {
    const accentColor = searchParams.color ? decodeURIComponent(searchParams.color) : "#FF5C00";
    const textColor = searchParams.textColor ? decodeURIComponent(searchParams.textColor) : "#18181b";
    const isDarkMode = searchParams.darkMode === 'true';

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

    // Verificar si el dueño del tablero es premium
    const user = await db.query.users.findFirst({
        where: eq(users.id, board.userId)
    });

    if (!user?.isPremium) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-zinc-50 border-4 border-dashed border-zinc-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-3xl mb-4">🔒</div>
                <h1 className="text-xl font-black text-zinc-900 mb-2 italic">Widget Desactivado</h1>
                <p className="text-sm text-zinc-500 font-medium max-w-xs mb-6 leading-relaxed">
                    Este tablón necesita una suscripción activa para ser incrustado en otras webs.
                </p>
                <a
                    href="https://pidemelo.app"
                    target="_blank"
                    className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] hover:underline"
                >
                    ir a pidemelo.app 🚀
                </a>
            </div>
        );
    }

    const sortedIdeas = board.ideas.sort((a, b) => b.votes.length - a.votes.length);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-900'} transition-colors`}>
            <main className="p-4 space-y-8">
                {/* Minimal Header for Widget */}
                <div className={`flex items-center justify-between pb-4 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'} transition-colors`}>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">{board.name}</h1>
                        <p className={`text-xs font-medium tracking-tight opacity-70 ${isDarkMode ? 'text-zinc-400' : ''}`}>Vota o añade tus propias ideas. ¿Qué crees que le falta a {board.name}?</p>
                    </div>
                </div>

                {/* Form at Top for Widget to save space */}
                <section className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50/50 border-zinc-100'} border p-6 rounded-2xl transition-colors`}>
                    <h2 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                        <span>💡</span> Sugiere algo nuevo
                    </h2>
                    <SubmitIdeaForm
                        boardId={board.id}
                        boardSlug={board.slug}
                        accentColor={accentColor}
                        textColor={textColor}
                        isDarkMode={isDarkMode}
                    />
                </section>

                {/* Watermark */}
                <div className="text-center">
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
            </main>
        </div>
    );
}
