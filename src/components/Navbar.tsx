import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sparkles, Zap, Monitor } from "lucide-react";

export default async function Navbar() {
    const { userId } = auth();

    // Obtenemos el estado premium si hay un usuario logueado
    let isPremium = false;
    if (userId) {
        const userData = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        isPremium = userData?.isPremium || false;
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* IZQUIERDA: Logo */}
                <Link href="/" className="font-jakarta font-extrabold text-xl tracking-tighter hover:scale-105 transition-all flex items-center active:scale-95 group">
                    <span className="group-hover:text-[#FF5C00] transition-colors">pidemelo</span>
                    <span className="text-[#FF5C00]">.</span>
                    <span>app</span>
                </Link>

                {/* DERECHA: Enlaces y Auth */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 mr-2">
                        <Link href="/#que-es" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">¿Qué es esto?</Link>
                        <Link href="/#faq" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">Dudas</Link>
                    </div>

                    <SignedOut>
                        <div className="flex items-center gap-3">
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-full hover:bg-zinc-100/50">
                                    Entrar
                                </button>
                            </SignInButton>
                            <SignInButton mode="modal">
                                <Button className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white font-bold text-sm rounded-full px-5 h-9 shadow-lg shadow-[#FF5C00]/10 transition-all hover:scale-105 active:scale-95">
                                    Probar gratis
                                </Button>
                            </SignInButton>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/billing">
                                <button className="text-sm font-bold text-zinc-600 hover:text-[#FF5C00] transition-colors px-3 py-2 rounded-full hover:bg-orange-50/50 flex items-center gap-2 group">
                                    {isPremium ? (
                                        <>
                                            Tu Plan <Zap className="w-3.5 h-3.5 fill-[#FF5C00] text-[#FF5C00] group-hover:animate-pulse" />
                                        </>
                                    ) : (
                                        <>
                                            Planes <Rocket className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FF5C00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                        </>
                                    )}
                                </button>
                            </Link>
                            <Link href="/dashboard/widgets">
                                <button className="text-sm font-bold text-zinc-600 hover:text-[#FF5C00] transition-colors px-3 py-2 rounded-full hover:bg-orange-50/50 flex items-center gap-2 group">
                                    Widgets <Monitor className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FF5C00] transition-all" />
                                </button>
                            </Link>
                            <Link href="/dashboard">
                                <Button className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white font-bold text-sm rounded-full px-5 h-9 shadow-lg shadow-[#FF5C00]/10 transition-all hover:scale-105 active:scale-95">
                                    Panel
                                </Button>
                            </Link>
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-zinc-200 flex items-center justify-center bg-white shadow-sm">
                                <UserButton appearance={{ elements: { avatarBox: "w-full h-full" } }} />
                            </div>
                        </div>
                    </SignedIn>
                </div>
            </div >
        </nav >
    );
}

// Estos componentes de Lucide no estaban importados o se usan de forma distinta
function Rocket({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1-4c2 0 3.27 1.02 4 2z" /><path d="M12 15v5s1 .5 4 1c0-2-1.02-3.27-2-4z" /></svg>
    )
}

