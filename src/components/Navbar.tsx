import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
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
                            <Link href="/dashboard">
                                <Button className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white font-bold text-sm rounded-full px-5 h-9 shadow-lg shadow-[#FF5C00]/10 transition-all hover:scale-105 active:scale-95">
                                    Panel 🚀
                                </Button>
                            </Link>
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-zinc-200 flex items-center justify-center bg-white shadow-sm">
                                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-full h-full" } }} />
                            </div>
                        </div>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
