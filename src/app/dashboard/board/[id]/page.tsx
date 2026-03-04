import { db } from "@/db";
import { boards, ideas } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import DashboardClient from "./DashboardClient";
import SettingsModal from "./SettingsModal";

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
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-zinc-200 flex-shrink-0 shadow-sm">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 font-semibold text-sm mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver al dashboard
                        </Link>
                        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900">
                            {board.name}
                        </h1>
                        <p className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full w-fit mt-2">pidemelo.app/board/{board.slug}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <SettingsModal boardId={board.id} currentName={board.name} currentSlug={board.slug} />
                        <Link
                            href={`/board/${board.slug}`}
                            target="_blank"
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#FF5C00] text-white hover:bg-[#E65300] rounded-full text-sm font-bold shadow-md shadow-[#FF5C00]/20 transition-transform active:scale-95"
                        >
                            Ver Tablón Público <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 min-h-[600px]">
                    <DashboardClient initialIdeas={formattedIdeas} boardId={board.id} />
                </main>

            </div>
        </div>
    );
}
