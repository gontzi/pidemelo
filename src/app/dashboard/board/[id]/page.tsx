import { db } from "@/db";
import { boards, ideas, votes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, desc, count, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import DashboardClient from "./DashboardClient";
import SettingsModal from "./SettingsModal";
import { ExternalLink, ArrowLeft, Settings } from "lucide-react";
import { getDictionary } from "@/i18n";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function BoardDashboardPage({ params }: { params: { id: string } }) {
    const t = await getDictionary();
    const { userId } = auth();
    if (!userId) return null;

    const board = await db.query.boards.findFirst({
        where: and(eq(boards.id, params.id), eq(boards.userId, userId)),
        with: {
            tags: true,
            ideas: {
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

    const formattedIdeas = board.ideas.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        status: idea.status,
        imageUrl: idea.imageUrl,
        votesCount: voteCountMap.get(idea.id) ?? 0,
        adminResponse: idea.adminResponse ?? null,
        tag: idea.tag ? {
            id: idea.tag.id,
            name: idea.tag.name,
            color: idea.tag.color
        } : null,
    }));

    formattedIdeas.sort((a, b) => b.votesCount - a.votesCount);

    return (
        <div className="min-h-screen bg-[#F3F4F6] overflow-x-hidden w-full">
            <div className="w-full mx-auto h-full flex flex-col overflow-x-hidden">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-10 rounded-b-[2rem] md:rounded-[2.5rem] border border-zinc-200/60 flex-shrink-0 shadow-xl shadow-zinc-200/20 px-6 md:px-10">
                    <div className="space-y-1 md:space-y-3 min-w-0">
                        <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-[#FF5C00] font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> {t.board_details.back_to_dashboard}
                        </Link>
                        <h1 className="font-heading text-2xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-tight break-words">
                            {board.name}
                        </h1>
                        <p className="text-[9px] md:text-xs font-black tracking-widest text-[#FF5C00] uppercase bg-orange-50 px-3 py-1 rounded-full w-fit">
                            /{board.slug}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <SettingsModal
                            boardId={board.id}
                            currentName={board.name}
                            currentSlug={board.slug}
                            dict={t.board_details}
                            tags={board.tags}
                            notifyNewIdeas={board.notifyNewIdeas}
                            trigger={
                                <button className="p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all active:scale-95 flex-shrink-0">
                                    <Settings className="w-4 h-4 md:w-6 md:h-6" />
                                </button>
                            }
                        />
                        <Link
                            href={`/board/${board.slug}`}
                            target="_blank"
                            className="flex-1 md:flex-none inline-flex items-center justify-center px-4 md:px-10 h-10 md:h-14 bg-[#FF5C00] text-white hover:bg-[#E65300] rounded-full text-[10px] md:text-sm font-black tracking-widest uppercase shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                        >
                            {t.board_details.view_public} <ExternalLink className="w-3 h-3 md:w-5 md:h-5 ml-2 md:ml-3" />
                        </Link>
                    </div>
                </header>


                <main className="flex-1 lg:bg-white lg:rounded-[2.5rem] lg:border lg:border-zinc-200/60 p-0 md:p-1 overflow-hidden w-full max-w-full">
                    <DashboardClient initialIdeas={formattedIdeas} boardId={board.id} dict={t.board_client} />
                </main>

            </div>
        </div>
    );
}
