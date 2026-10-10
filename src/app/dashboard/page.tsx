import { db } from "@/db";
import { boards, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createBoard } from "./actions";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getDictionary } from '@/i18n';
import ProjectCard from "./ProjectCard";
import { cn } from "@/lib/utils";
import DashboardEmptyState from "./DashboardEmptyState";
export default async function Dashboard() {
    const t = await getDictionary();
    const { userId } = auth();
    if (!userId) return null;

    const userBoards = await db.query.boards.findMany({
        where: eq(boards.userId, userId),
        with: { 
            tags: true,
            ideas: {
                columns: {
                    id: true
                }
            } 
        },
        orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });



    return (
        <div className="min-h-screen bg-[#FAFAFA] px-4 py-6 md:px-10 lg:py-16">
            <div className="max-w-6xl mx-auto">
                
                {/* Unified Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-16">
                    <div className="space-y-3 md:space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00]">
                                {t.dashboard_index.unlimited_projects}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-[0.95] md:leading-[0.9]">
                            {t.dashboard_index.my_boards}
                        </h1>
                        <p className="text-zinc-500 font-medium text-base md:text-lg max-w-md">
                            {t.dashboard_index.my_boards_subtitle}
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="relative bg-white border border-zinc-200/60 p-2 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all flex flex-col sm:flex-row items-center gap-2">
                            <form action={createBoard} className="flex flex-col sm:flex-row gap-2 w-full">
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={t.dashboard_index.project_name_ph}
                                    required
                                    className="h-12 border-none shadow-none focus-visible:ring-0 bg-transparent text-lg font-bold px-4 min-w-[240px]"
                                />
                                <Button
                                    type="submit"
                                    className="h-12 px-8 bg-zinc-900 text-white hover:bg-black rounded-xl font-black text-xs tracking-widest uppercase transition-all shrink-0"
                                >
                                    {t.dashboard_index.create_btn}
                                </Button>
                            </form>
                        </div>
                    </div>
                </header>


                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {userBoards.map(board => (
                            <ProjectCard key={board.id} board={board as any} dict={t.project_card} settingsDict={t.board_details} />
                        ))}
                        
                        {userBoards.length === 0 && (
                            <DashboardEmptyState dict={t.dashboard_index} />
                        )}
                    </section>

            </div>
        </div>
    );
}
