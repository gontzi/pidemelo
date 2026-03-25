'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, Settings, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import SettingsModal from './board/[id]/SettingsModal';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface ProjectCardProps {
    board: {
        id: string;
        name: string;
        slug: string;
        notifyNewIdeas: boolean;
        tags?: { id: string; name: string; color: string; }[];
    };
    dict: Record<string, string>;
    settingsDict: Record<string, string>;
    isPremium: boolean;
}

export default function ProjectCard({ board, dict, settingsDict, isPremium }: ProjectCardProps) {
    const [copied, setCopied] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleCopy = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

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
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className="bg-white border border-zinc-200/60 rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 hover:border-[#FF5C00]/20 hover:shadow-xl hover:shadow-zinc-200/40 group flex flex-col min-h-[240px] md:min-h-[320px] relative overflow-hidden">
                    <div className="flex-1">
                        <div className="space-y-1 mb-6">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">{dict.project}</p>
                            <h3 className="text-3xl md:text-3xl font-black tracking-tighter text-zinc-900 line-clamp-2 leading-none uppercase">{board.name}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="inline-block bg-zinc-100/80 text-zinc-500 text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full">
                                /{board.slug}
                            </span>
                            {board.tags?.slice(0, 2).map(tag => (
                                <span key={tag.id} className="inline-block bg-zinc-50 border border-zinc-100 text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        </div>

                    <div className="hidden md:flex items-center justify-between mb-6 transition-opacity duration-300">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleCopy}
                                title={dict.copy_link}
                                className="p-3 rounded-2xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>

                            <Link
                                href={`/board/${board.slug}`}
                                target="_blank"
                                title={dict.view_public}
                                className="p-3 rounded-2xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>

                        <SettingsModal
                            boardId={board.id}
                            currentName={board.name}
                            currentSlug={board.slug}
                            dict={settingsDict}
                            tags={board.tags}
                            isPremium={isPremium}
                            notifyNewIdeas={board.notifyNewIdeas}
                            trigger={
                                <button
                                    title={dict.settings_tooltip}
                                    className="p-3 rounded-2xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            }
                        />
                    </div>

                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                        <Link
                            href={`/dashboard/board/${board.id}`}
                            className="text-[#FF5C00] font-black text-[10px] md:text-xs tracking-[0.2em] uppercase flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            {dict.manage} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    {/* Visual indicator for long-press on mobile */}
                    <div className="lg:hidden absolute top-4 right-8 w-1 h-8 flex flex-col gap-1 justify-center opacity-20">
                        <div className="w-1 h-1 rounded-full bg-zinc-400" />
                        <div className="w-1 h-1 rounded-full bg-zinc-400" />
                        <div className="w-1 h-1 rounded-full bg-zinc-400" />
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-none bg-white/95 backdrop-blur-xl">
                <ContextMenuItem onClick={() => window.open(`/board/${board.slug}`, '_blank')} className="rounded-xl py-3 px-4 font-bold text-zinc-700 focus:bg-orange-50 focus:text-[#FF5C00]">
                    <ExternalLink className="w-4 h-4 mr-3 opacity-60" /> {dict.view_public}
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleCopy()} className="rounded-xl py-3 px-4 font-bold text-zinc-700 focus:bg-orange-50 focus:text-[#FF5C00]">
                    <Copy className="w-4 h-4 mr-3 opacity-60" /> {dict.copy_link}
                </ContextMenuItem>
                <SettingsModal
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    boardId={board.id}
                    currentName={board.name}
                    currentSlug={board.slug}
                    dict={settingsDict}
                    tags={board.tags}
                    isPremium={isPremium}
                    notifyNewIdeas={board.notifyNewIdeas}
                    trigger={
                        <ContextMenuItem onSelect={(e) => { e.preventDefault(); setSettingsOpen(true); }} className="rounded-xl py-3 px-4 font-bold text-zinc-700 focus:bg-orange-50 focus:text-[#FF5C00]">
                            <Settings className="w-4 h-4 mr-3 opacity-60" /> {settingsDict.settings}
                        </ContextMenuItem>
                    }
                />
                <ContextMenuSeparator className="bg-zinc-100 my-1" />
                <ContextMenuItem onSelect={(e) => { e.preventDefault(); setSettingsOpen(true); }} className="rounded-xl py-3 px-4 font-bold text-red-500 focus:bg-red-50 focus:text-red-600">
                    <Trash2 className="w-4 h-4 mr-3 opacity-60" /> {settingsDict.delete_board}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
