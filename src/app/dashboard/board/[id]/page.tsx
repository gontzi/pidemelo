import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import IframeGenerator from "./IframeGenerator";
import DashboardClient from "./DashboardClient";
import SettingsModal from "./SettingsModal";
import { ExternalLink, ArrowLeft, Settings } from "lucide-react";

export default async function BoardDashboardPage({ params }: { params: { id: string } }) {
    const { userId } = auth();
    if (!userId) return null;

    const board = await db.query.boards.findFirst({
        where: and(eq(boards.id, params.id), eq(boards.userId, userId)),
        with: {
            ideas: {
                with: { votes: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    const formattedIdeas = board.ideas.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        status: idea.status,
        votesCount: idea.votes.length,
    }));

    formattedIdeas.sort((a, b) => b.votesCount - a.votesCount);

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-6 md:p-10 pt-24">
            <div className="max-w-7xl mx-auto space-y-10 h-full flex flex-col">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-zinc-200/60 flex-shrink-0 shadow-xl shadow-zinc-200/20">
                    <div className="space-y-3">
                        <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-[#FF5C00] font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Volver al dashboard
                        </Link>
                        <h1 className="font-heading text-4xl font-black tracking-tighter text-zinc-900 leading-none">
                            {board.name}
                        </h1>
                        <p className="text-xs font-black tracking-widest text-[#FF5C00] uppercase bg-orange-50 px-3 py-1.5 rounded-full w-fit">
                            /{board.slug}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <SettingsModal
                            boardId={board.id}
                            currentName={board.name}
                            currentSlug={board.slug}
                            trigger={
                                <button className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all active:scale-95">
                                    <Settings className="w-6 h-6" />
                                </button>
                            }
                        />
                        <Link
                            href={`/board/${board.slug}`}
                            target="_blank"
                            className="inline-flex items-center justify-center px-10 h-14 bg-[#FF5C00] text-white hover:bg-[#E65300] rounded-full text-sm font-black tracking-widest uppercase shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Ver Público <ExternalLink className="w-5 h-5 ml-3" />
                        </Link>
                    </div>
                </header>

                <IframeGenerator slug={board.slug} />

                <main className="flex-1 bg-white rounded-[2.5rem] border border-zinc-200/60 p-1">
                    <DashboardClient initialIdeas={formattedIdeas} boardId={board.id} />
                </main>

            </div>
        </div>
    );
}
