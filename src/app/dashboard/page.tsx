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

export default async function Dashboard() {
    const t = await getDictionary();
    const { userId } = auth();
    if (!userId) return null;

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const isPremium = user?.isPremium || false;

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

    const isLimitReached = !isPremium && userBoards.length >= 3;

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-6 py-10 md:px-10 lg:py-16">
            <div className="max-w-6xl mx-auto">
                
                {/* Unified Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00]">
                                {isPremium ? t.dashboard_index.unlimited_projects : `${userBoards.length}/3 ${t.dashboard_index.projects_used}`}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 leading-[0.9]">
                            {t.dashboard_index.my_boards}
                        </h1>
                        <p className="text-zinc-500 font-medium text-lg max-w-md">
                            {t.dashboard_index.my_boards_subtitle}
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className={cn(
                            "relative bg-white border border-zinc-200/60 p-2 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all flex flex-col sm:flex-row items-center gap-2",
                            isLimitReached && "opacity-50 pointer-events-none grayscale"
                        )}>
                            <form action={createBoard} className="flex flex-col sm:flex-row gap-2 w-full">
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={t.dashboard_index.project_name_ph}
                                    required
                                    disabled={isLimitReached}
                                    className="h-12 border-none shadow-none focus-visible:ring-0 bg-transparent text-lg font-bold px-4 min-w-[240px]"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLimitReached}
                                    className="h-12 px-8 bg-zinc-900 text-white hover:bg-black rounded-xl font-black text-xs tracking-widest uppercase transition-all shrink-0"
                                >
                                    {t.dashboard_index.create_btn}
                                </Button>
                            </form>
                            
                            {isLimitReached && (
                                <Link 
                                    href="/dashboard/billing"
                                    className="absolute inset-x-0 -bottom-10 text-center"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] hover:underline">
                                        {t.dashboard_index.upgrade_pro} ↗
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>


                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userBoards.map(board => (
                            <ProjectCard key={board.id} board={board as any} dict={t.project_card} settingsDict={t.board_details} isPremium={isPremium} />
                        ))}
                        
                        {userBoards.length === 0 && (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-zinc-50/50 rounded-[3rem] border border-dashed border-zinc-200">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-8 border border-zinc-100 transform -rotate-6">
                                    🏜️
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-zinc-900 mb-2">
                                    {t.dashboard_index.empty_title}
                                </h3>
                                <p className="text-zinc-500 font-medium max-w-xs mx-auto mb-8">
                                    {t.dashboard_index.empty_subtitle}
                                </p>
                                <Button 
                                    variant="outline" 
                                    className="rounded-full border-zinc-200 font-black text-[10px] uppercase tracking-widest hover:bg-white px-8"
                                    onClick={() => document.getElementById('name')?.focus()}
                                >
                                    {t.dashboard_index.create_first_btn}
                                </Button>
                            </div>
                        )}
                    </section>

            </div>
        </div>
    );
}
