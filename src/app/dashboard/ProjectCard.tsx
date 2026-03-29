'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, Settings, ArrowRight, Share2 } from 'lucide-react';
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
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    board: {
        id: string;
        name: string;
        slug: string;
        notifyNewIdeas: boolean;
        tags?: { id: string; name: string; color: string; }[];
        ideas?: { id: string; }[];
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
                <div className="group relative bg-white border border-zinc-200/60 rounded-[2rem] p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-zinc-300/60 flex flex-col min-h-[340px]">
                    
                    {/* Top Section: Badges & Count */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-2">
                             <span className="inline-flex items-center bg-zinc-50 border border-zinc-100 text-zinc-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {dict.project}
                            </span>
                        </div>
                        {board.ideas && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-orange-50/50 rounded-full border border-orange-100/50 group-hover:bg-orange-50 group-hover:border-orange-200/50 transition-colors">
                                <span className="text-sm font-black text-[#FF5C00]">{board.ideas.length}</span>
                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter">{dict.ideas || 'IDEA(S)'}</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-4">
                        <h3 className="text-3xl font-black tracking-tight text-zinc-900 leading-[1.1] group-hover:text-black transition-colors">
                            {board.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {board.tags?.slice(0, 3).map(tag => (
                                <span key={tag.id} className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-100/50 px-2 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-tight">
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: tag.color }} />
                                    {tag.name}
                                </span>
                            ))}
                            {(!board.tags || board.tags.length === 0) && (
                                <span className="text-[10px] font-bold text-zinc-300 italic px-2 py-0.5">
                                    {dict.no_tags}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer Section: URL & Actions */}
                    <div className="mt-8 pt-6 border-t border-zinc-50 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 flex items-center gap-2 bg-zinc-50/80 px-4 py-2.5 rounded-xl border border-zinc-100/50 group/url hover:bg-zinc-100 transition-colors overflow-hidden">
                                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-xs font-medium text-zinc-400 truncate flex-1">
                                    pidemelo.app/board/<span className="text-zinc-600 font-bold">{board.slug}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleCopy}
                                    title={dict.copy_link}
                                    className="p-2.5 rounded-xl text-zinc-400 hover:text-[#FF5C00] hover:bg-orange-50 transition-all active:scale-95 border border-transparent hover:border-orange-100"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <Link
                                    href={`/board/${board.slug}`}
                                    target="_blank"
                                    title={dict.view_public}
                                    className="p-2.5 rounded-xl text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-95 border border-transparent hover:border-blue-100"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-stretch gap-2">
                            <Link
                                href={`/dashboard/board/${board.id}`}
                                className="flex-1 flex items-center justify-center bg-zinc-900 text-white hover:bg-black rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-zinc-900/10 hover:shadow-zinc-900/20 active:scale-[0.98] h-12"
                            >
                                {dict.manage} <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            
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
                                        className="flex items-center justify-center w-12 bg-zinc-100/50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all active:scale-95 border border-zinc-200/40"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    {/* Subtle accent border on top */}
                    <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-zinc-100 bg-white/95 backdrop-blur-xl">
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
                    <ExternalLink className="w-4 h-4 mr-3 opacity-60" /> {settingsDict.delete_board}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
