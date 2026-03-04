import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicBoardClient from "../../board/[slug]/PublicBoardClient";
import SubmitIdeaForm from "../../board/[slug]/SubmitIdeaForm";

export const dynamic = 'force-dynamic';

export default async function WidgetPage({ params }: { params: { slug: string } }) {
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
        <div className="min-h-screen bg-white">
            <main className="p-4 space-y-8">
                {/* Minimal Header for Widget */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-zinc-900">{board.name}</h1>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Vota o añade tus propias ideas. ¿Qué crees que le falta a {board.name}?</p>
                    </div>
                </div>

                {/* Form at Top for Widget to save space */}
                <section className="bg-zinc-50/50 border border-zinc-100 p-6 rounded-2xl">
                    <h2 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                        <span>💡</span> Sugiere algo nuevo
                    </h2>
                    <SubmitIdeaForm boardId={board.id} boardSlug={board.slug} />
                </section>

                {/* Watermark */}
                <div className="pt-2 pb-1 text-center">
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
