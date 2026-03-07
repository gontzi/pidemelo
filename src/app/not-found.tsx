import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";
import { getDictionary } from '@/i18n';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function NotFound() {
    const t = await getDictionary();
    return (
        <main className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Fondo de puntitos retro-moderno (igual que la home) */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-xl space-y-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 mb-4 rotate-3">
                    <Ghost className="w-12 h-12 text-[#FF5C00] animate-bounce" />
                </div>

                <div className="space-y-4">
                    <h1 className="font-heading text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                        404 — <br />
                        <span className="text-[#FF5C00]">{t.not_found.title}</span>
                    </h1>

                    <p className="text-xl text-zinc-500 font-bold leading-tight max-w-sm mx-auto">
                        {t.not_found.desc}
                    </p>
                </div>

                <div className="pt-6">
                    <Link href="/">
                        <Button size="lg" className="h-16 px-10 text-lg bg-zinc-900 text-white hover:bg-zinc-800 shadow-2xl shadow-zinc-900/20 rounded-full font-black transition-all hover:scale-105 active:scale-95 group">
                            <MoveLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                            {t.not_found.back}
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-zinc-400 font-medium italic opacity-60">
                    {t.not_found.quote}
                </p>
            </div>
        </main>
    );
}
