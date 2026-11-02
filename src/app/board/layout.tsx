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
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border pt-safe">
                <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
                    <Link
                        href="/"
                        aria-label="Pídemelo"
                        className="font-heading font-semibold text-lg tracking-tight flex items-center active:scale-95 transition-transform"
                    >
                        <span className="text-foreground">pidemelo</span>
                        <span className="text-[#FF5C00]">.</span>
                        <span className="text-foreground">app</span>
                    </Link>
                    {/* Discreto: en el tablero de un cliente, la acción principal es enviar ideas */}
                    <Link
                        href="/"
                        className="inline-flex items-center h-9 px-3 rounded-lg text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                        {t.navbar.create_yours}
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
