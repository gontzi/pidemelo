'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, Settings, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import SettingsModal from './board/[id]/SettingsModal';

interface ProjectCardProps {
    board: {
        id: string;
        slug: string;
        tags?: { id: string; name: string; color: string; }[];
    };
    dict: Record<string, string>;
    settingsDict: Record<string, string>;
}

export default function ProjectCard({ board, dict, settingsDict }: ProjectCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const url = `${window.location.origin}/board/${board.slug}`;
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    return (
        <div className="bg-white border border-zinc-200/60 rounded-[2rem] p-6 md:p-10 transition-all duration-300 hover:border-[#FF5C00]/20 hover:shadow-xl hover:shadow-zinc-200/40 group flex flex-col min-h-[280px] md:h-[320px]">
            <div className="flex-1">
                <div className="space-y-1 mb-4 md:mb-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">{dict.project}</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 line-clamp-2 leading-none">{board.name}</h3>
                </div>

                <span className="inline-block bg-zinc-100 text-zinc-500 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-4 md:mb-6">
                    /{board.slug}
                </span>

                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleCopy}
                        title={dict.copy_link}
                        className="p-2.5 md:p-3 rounded-2xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>

                    <Link
                        href={`/board/${board.slug}`}
                        target="_blank"
                        title={dict.view_public}
                        className="p-2.5 md:p-3 rounded-2xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95"
                    >
                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>

                    <SettingsModal
                        boardId={board.id}
                        currentName={board.name}
                        currentSlug={board.slug}
                        dict={settingsDict}
                        tags={board.tags}
                        isPremium={true} // Ocultar límite visualmente en este dropdown secundario o mapear desde arriba si prefieres
                        trigger={
                            <button
                                title={dict.settings_tooltip}
                                className="p-2.5 md:p-3 rounded-2xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95"
                            >
                                <Settings className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        }
                    />
                </div>
            </div>

            <div className="pt-4 md:pt-6 border-t border-zinc-50 flex items-center justify-between">
                <Link
                    href={`/dashboard/board/${board.id}`}
                    className="text-[#FF5C00] font-black text-[10px] md:text-xs tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all"
                >
                    {dict.manage} <span className="text-base md:text-lg">→</span>
                </Link>
            </div>
        </div >
    );
}
