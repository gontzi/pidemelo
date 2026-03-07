import { db } from "@/db";
import { boards, ideas, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import IframeGenerator from "./IframeGenerator";
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
                with: { votes: true, tag: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    // Consultar estado premium del usuario
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
    const isPremium = user?.isPremium || false;

    const formattedIdeas = board.ideas.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        status: idea.status,
        votesCount: idea.votes.length,
        tag: idea.tag ? {
            id: idea.tag.id,
            name: idea.tag.name,
            color: idea.tag.color
        } : null,
    }));

    formattedIdeas.sort((a, b) => b.votesCount - a.votesCount);

    return (
        <div className="h-[100dvh] bg-[#F3F4F6] px-4 py-8">
            <div className="w-full mx-auto space-y-6 md:space-y-10 h-full flex flex-col">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-200/60 flex-shrink-0 shadow-xl shadow-zinc-200/20 px-6">
                    <div className="space-y-2 md:space-y-3">
                        <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-[#FF5C00] font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> {t.board_details.back_to_dashboard}
                        </Link>
                        <h1 className="font-heading text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-tight">
                            {board.name}
                        </h1>
                        <p className="text-[10px] md:text-xs font-black tracking-widest text-[#FF5C00] uppercase bg-orange-50 px-3 py-1 md:py-1.5 rounded-full w-fit">
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
                            isPremium={isPremium}
                            trigger={
                                <button className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all active:scale-95 flex-shrink-0">
                                    <Settings className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            }
                        />
                        <Link
                            href={`/board/${board.slug}`}
                            target="_blank"
                            className="flex-1 md:flex-none inline-flex items-center justify-center px-6 md:px-10 h-12 md:h-14 bg-[#FF5C00] text-white hover:bg-[#E65300] rounded-full text-xs md:text-sm font-black tracking-widest uppercase shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            {t.board_details.view_public} <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3" />
                        </Link>
                    </div>
                </header>


                <main className="flex-1 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-zinc-200/60 p-0 md:p-1 overflow-hidden">
                    <DashboardClient initialIdeas={formattedIdeas} boardId={board.id} dict={t.board_client} />
                </main>

            </div>
        </div>
    );
}
