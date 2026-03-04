import { db } from "@/db";
import { boards } from "@/db/schema";
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

    const userBoards = await db.query.boards.findMany({
        where: eq(boards.userId, userId),
        orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-6 md:p-12 pt-32">
            <div className="max-w-6xl mx-auto space-y-20">

                <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">Administración</p>
                        <h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Mis Tableros</h1>
                    </div>

                    <div className="bg-white border border-zinc-200/60 p-6 rounded-[2rem] shadow-xl shadow-zinc-200/30 flex-1 max-w-xl">
                        <form action={createBoard} className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 w-full space-y-2">
                                <label htmlFor="name" className="text-[10px] uppercase tracking-widest font-black text-zinc-400 ml-1">Nuevo Chiringuito</label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre del proyecto..."
                                    required
                                    className="h-14 shadow-none border-zinc-100 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] bg-zinc-50 rounded-2xl text-lg px-4 font-bold"
                                />
                            </div>
                            <Button type="submit" className="h-14 px-10 bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-lg shadow-orange-500/20 rounded-full font-black text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shrink-0">
                                CREAR 🚀
                            </Button>
                        </form>
                    </div>
                </section>

                <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {userBoards.map(board => (
                        <ProjectCard key={board.id} board={board as any} />
                    ))}
                    {userBoards.length === 0 && (
                        <div className="col-span-full border-[3px] border-dashed border-zinc-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center bg-white/40 h-[400px]">
                            <span className="text-6xl mb-6">🏜️</span>
                            <p className="text-2xl font-black tracking-tighter text-zinc-900 max-w-xs">
                                Tu imperio de feedback empieza aquí. No lo dejes vacío. 👇
                            </p>
                            <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-bold mt-4">Crea tu primer tablero arriba</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
