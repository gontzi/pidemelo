'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, LayoutDashboard, Zap, Rocket } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import LanguageSwitcher from "../LanguageSwitcher";

export default function AdminSidebar({ dict }: { dict: Record<string, string> }) {
    const pathname = usePathname();
    const { user } = useUser();

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-zinc-200/50 py-6 px-4 z-40">
            <Link href="/" className="font-jakarta font-extrabold text-2xl tracking-tighter hover:scale-105 transition-all flex items-center mb-10 px-2 group">
                <span className="group-hover:text-[#FF5C00] transition-colors text-zinc-900">pidemelo</span>
                <span className="text-[#FF5C00]">.</span>
                <span className="text-zinc-900">app</span>
            </Link>

            <nav className="flex-1 space-y-2">
                <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/dashboard') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}>
                    <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-[#FF5C00]' : 'text-zinc-400'}`} />
                    {dict.dashboard?.replace('🏠', '').trim() || "Panel"}
                </Link>
                <Link href="/dashboard/widgets" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/dashboard/widgets') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}>
                    <Monitor className={`w-5 h-5 ${isActive('/dashboard/widgets') ? 'text-[#FF5C00]' : 'text-zinc-400'}`} />
                    {dict.widgets || "Widgets"}
                </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-zinc-100 flex flex-col gap-4 px-2">
                <a 
                    href="https://buymeacoffee.com/gontzi" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#FF5C00] hover:bg-[#E65300] text-white font-bold text-xs rounded-md transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                    ☕ {dict.support_gontzi}
                </a>
                <div className="flex items-center justify-between">
                    <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border border-zinc-200 shadow-sm" } }} />
                    <LanguageSwitcher />
                </div>
            </div>
        </aside>
    );
}
