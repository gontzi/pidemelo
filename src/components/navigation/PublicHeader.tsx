'use client';

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "../LanguageSwitcher";

export default function PublicHeader({ dict }: { dict?: Record<string, string> }) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/50">
            <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-jakarta font-extrabold text-xl tracking-tighter hover:scale-105 transition-all flex items-center active:scale-95 group">
                    <span className="group-hover:text-[#FF5C00] transition-colors text-zinc-900">pidemelo</span>
                    <span className="text-[#FF5C00]">.</span>
                    <span className="text-zinc-900">app</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors px-4 py-2 rounded-full hover:bg-zinc-100/50 hidden md:inline-block">
                                {dict?.login || "Entrar"}
                            </button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button className="bg-[#FF5C00] hover:bg-[#E65300] text-white font-black text-xs md:text-sm tracking-widest uppercase rounded-full px-4 md:px-6 h-9 md:h-10 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95">
                                {dict?.login_mobile || "Entrar ⚡"}
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/dashboard" className="hidden md:inline-flex">
                            <Button variant="outline" className="text-xs font-black tracking-widest uppercase rounded-full border-zinc-200 text-zinc-600 hover:text-zinc-900 mr-2 h-10 hover:bg-zinc-50 border">
                                {dict?.dashboard || "Panel 🏠"}
                            </Button>
                        </Link>
                        <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-zinc-200 shadow-sm" } }} />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
