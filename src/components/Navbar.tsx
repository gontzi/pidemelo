'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Menu, X, Monitor, Zap } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

function Rocket({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1-4c2 0 3.27 1.02 4 2z" /><path d="M12 15v5s1 .5 4 1c0-2-1.02-3.27-2-4z" /></svg>
    )
}

export default function Navbar({ dict }: { dict: Record<string, string> }) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    if (pathname !== '/') return null;

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/50">
                <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" onClick={() => setMenuOpen(false)} className="font-jakarta font-extrabold text-xl tracking-tighter hover:scale-105 transition-all flex items-center active:scale-95 group">
                        <span className="group-hover:text-[#FF5C00] transition-colors">pidemelo</span>
                        <span className="text-[#FF5C00]">.</span>
                        <span>app</span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-2 mr-2">
                        <Link href="/#que-es" className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-xl hover:bg-zinc-50">{dict.what_is}</Link>
                        <Link href="/#faq" className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-xl hover:bg-zinc-50">{dict.faq}</Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <LanguageSwitcher />
                        <SignedOut>
                            <div className="hidden md:flex items-center gap-3">
                                <SignInButton mode="modal">
                                    <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors px-4 py-2 rounded-full hover:bg-zinc-100/50">{dict.login}</button>
                                </SignInButton>
                                <SignInButton mode="modal">
                                    <Button className="bg-[#FF5C00] hover:bg-[#E65300] text-white font-black text-xs tracking-widest uppercase rounded-full px-6 h-10 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95">
                                        {dict.start_now}
                                    </Button>
                                </SignInButton>
                            </div>
                            {/* Mobile: solo botón de entrar */}
                            <div className="flex md:hidden">
                                <SignInButton mode="modal">
                                    <Button className="bg-[#FF5C00] hover:bg-[#E65300] text-white font-black text-[10px] tracking-widest uppercase rounded-full px-4 h-9 shadow-lg shadow-orange-500/20 active:scale-95">
                                        {dict.login_mobile}
                                    </Button>
                                </SignInButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            {/* Desktop signed-in links */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/dashboard">
                                    <Button className="bg-[#FF5C00] hover:bg-[#E65300] text-white font-black text-xs tracking-widest uppercase rounded-full px-6 h-10 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 ml-2">
                                        {dict.dashboard}
                                    </Button>
                                </Link>
                                <div className="ml-2 flex items-center">
                                    <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-zinc-200 shadow-sm" } }} />
                                </div>
                            </div>

                            {/* Mobile: avatar (hamburger below) */}
                            <div className="flex md:hidden items-center">
                                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-zinc-200" } }} />
                            </div>
                        </SignedIn>

                        {/* Hamburger */}
                        <button
                            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                            className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors md:hidden"
                            onClick={() => setMenuOpen(p => !p)}
                        >
                            {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 md:hidden bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="absolute top-16 left-0 right-0 bg-white border-b border-zinc-200 shadow-2xl p-6 space-y-4 animate-in slide-in-from-top-5 duration-300">
                        <SignedOut>
                            <div className="grid gap-2 text-left">
                                <Link href="/#que-es" onClick={() => setMenuOpen(false)} className="px-5 py-4 rounded-2xl text-zinc-600 font-bold hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all">
                                    {dict.mobile_what_is}
                                </Link>
                                <Link href="/#faq" onClick={() => setMenuOpen(false)} className="px-5 py-4 rounded-2xl text-zinc-600 font-bold hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all">
                                    {dict.mobile_faq}
                                </Link>
                            </div>
                            <div className="pt-4 border-t border-zinc-100">
                                <SignInButton mode="modal">
                                    <Button className="w-full bg-[#FF5C00] text-white font-black text-sm tracking-widest uppercase rounded-2xl h-14 shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                                        {dict.mobile_try_free}
                                    </Button>
                                </SignInButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <div className="grid gap-2 text-left">
                                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="w-full px-5 py-4 rounded-2xl bg-zinc-900 text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-zinc-900/10 flex items-center justify-between group active:scale-[0.98] transition-all">
                                    {dict.mobile_dashboard} <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            )}
        </>
    );
}

