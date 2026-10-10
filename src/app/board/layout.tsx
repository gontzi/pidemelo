import React from "react";
import Link from "next/link";
import { getDictionary } from "@/i18n";

export default async function BoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getDictionary();

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/60 pt-safe">
                <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
                    <Link
                        href="/"
                        aria-label="Pídemelo"
                        className="font-jakarta font-extrabold text-lg tracking-tighter flex items-center active:scale-95 transition-transform"
                    >
                        <span className="text-zinc-900">pidemelo</span>
                        <span className="text-[#FF5C00]">.</span>
                        <span className="text-zinc-900">app</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center h-9 px-4 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        {t.navbar.start_now.replace('🚀', '').trim()}
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
