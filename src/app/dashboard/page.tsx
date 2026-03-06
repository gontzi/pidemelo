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

import ProjectCard from "./ProjectCard";

export default async function Dashboard() {
    const { userId } = auth();
    if (!userId) return null;

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const isPremium = user?.isPremium || false;

    const userBoards = await db.query.boards.findMany({
        where: eq(boards.userId, userId),
        orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });

    const isLimitReached = !isPremium && userBoards.length >= 3;

    return (
        <div className="min-h-screen bg-[#F3F4F6] px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">

                <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">Administración</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isLimitReached ? 'bg-orange-100 text-[#FF5C00]' : 'bg-emerald-100 text-emerald-600'}`}>
                                {isPremium ? '♾️ Proyectos ilimitados' : `${userBoards.length}/3 Proyectos usados`}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-none">Mis Tableros</h1>
                    </div>

                    <div className="bg-white border border-zinc-200/60 p-5 md:p-6 rounded-[2rem] shadow-xl shadow-zinc-200/30 flex-1 lg:max-w-xl relative overflow-hidden group">
                        {isLimitReached && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center animate-in fade-in duration-300 p-4">
                                <Link href="/dashboard/billing">
                                    <Button className="bg-zinc-900 text-white hover:bg-[#FF5C00] font-black text-[10px] md:text-xs tracking-widest uppercase h-11 md:h-12 rounded-full px-6 md:px-8 shadow-2xl transition-all hover:scale-105 active:scale-95 text-center">
                                        ⚡ Subir a Pro para crear más
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <form action={createBoard} className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-end">
                            <div className="flex-1 space-y-2">
                                <label htmlFor="name" className="text-[10px] uppercase tracking-widest font-black text-zinc-400 ml-1">Nuevo Chiringuito</label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre del proyecto..."
                                    required
                                    disabled={isLimitReached}
                                    className="h-12 md:h-14 shadow-none border-zinc-100 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] bg-zinc-50 rounded-2xl text-base md:text-lg px-4 font-bold"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLimitReached}
                                className="h-12 md:h-14 px-8 md:px-10 bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-lg shadow-orange-500/20 rounded-full font-black text-xs md:text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shrink-0"
                            >
                                CREAR 🚀
                            </Button>
                        </form>
                    </div>
                </section>

                <section className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {userBoards.map(board => (
                        <ProjectCard key={board.id} board={board as any} />
                    ))}
                    {userBoards.length === 0 && (
                        <div className="col-span-full border-[3px] border-dashed border-zinc-200 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center bg-white/40 min-h-[300px] md:h-[400px]">
                            <span className="text-5xl md:text-6xl mb-4 md:mb-6">🏜️</span>
                            <p className="text-xl md:text-2xl font-black tracking-tighter text-zinc-900 max-w-xs leading-tight">
                                Tu imperio de feedback empieza aquí. No lo dejes vacío. 👇
                            </p>
                            <p className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mt-4">Crea tu primer tablero arriba</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
