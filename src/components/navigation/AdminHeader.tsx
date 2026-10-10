'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu, X, Monitor } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";

export default function AdminHeader({ dict }: { dict: Record<string, string> }) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/50 px-5 h-16 flex items-center justify-between">
                <Link href="/" onClick={() => setMenuOpen(false)} className="font-jakarta font-extrabold text-xl tracking-tighter flex items-center active:scale-95 transition-transform">
                    <span className="text-zinc-900">pidemelo</span>
                    <span className="text-[#FF5C00]">.</span>
                    <span className="text-zinc-900">app</span>
                </Link>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-zinc-200" } }} />
                    <button
                        className="p-1 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
                        onClick={() => setMenuOpen(p => !p)}
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {menuOpen && (
                <div className="fixed inset-0 z-30 md:hidden bg-white/80 backdrop-blur-md animate-in fade-in duration-300 top-16">
                    <div className="bg-white border-b border-zinc-200 shadow-2xl p-6 space-y-4 animate-in slide-in-from-top-5 duration-300">
                        <div className="grid gap-2 text-left">
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="w-full px-5 py-4 rounded-2xl bg-zinc-900 text-white font-black text-sm tracking-widest uppercase shadow-xl flex items-center justify-between group">
                                {dict.dashboard?.replace('🏠', '').trim() || "Panel de Control"} <span className="text-orange-500 opacity-100 transition-opacity">→</span>
                            </Link>
                            <Link href="/dashboard/widgets" onClick={() => setMenuOpen(false)} className="px-5 py-4 rounded-2xl text-zinc-600 font-bold hover:bg-zinc-50 border border-transparent hover:border-zinc-100 flex items-center gap-3 transition-all">
                                <Monitor className="w-5 h-5 opacity-40" /> {dict.widgets || "Widgets"}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
