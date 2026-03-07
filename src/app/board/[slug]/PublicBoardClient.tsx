'use client';

import { useState, useRef, useEffect } from 'react';
import { upvoteIdea } from './actions';
import { Search, ChevronDown } from 'lucide-react';

type Idea = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'planned' | 'done';
    votes: { id: string }[];
    tag: { id: string; name: string; color: string; } | null;
};

export default function PublicBoardClient({
    initialIdeas,
    boardSlug,
    accentColor = "#FF5C00",
    textColor = "#18181b",
    dict
}: {
    initialIdeas: Idea[],
    boardSlug: string,
    accentColor?: string,
    textColor?: string,
    dict: Record<string, string>
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'planned' | 'done'>('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar el dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filterOptions = [
        { value: 'all', label: dict.filter_all, emoji: '🗂️' },
        { value: 'pending', label: dict.filter_pending, emoji: '🤔' },
        { value: 'planned', label: dict.filter_planned, emoji: '🏗️' },
        { value: 'done', label: dict.filter_done, emoji: '✅' },
    ] as const;

    const filteredIdeas = initialIdeas.filter(idea => {
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <section className="space-y-6" style={{ color: textColor }}>
            {/* Cabecera con título y filtros */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold tracking-tight inline-flex items-center gap-2" style={{ color: textColor }}>
                    {dict.showing} <span>🔥</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder={dict.search_placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                outlineColor: accentColor,
                                boxShadow: `0 0 0 2px ${accentColor}10`,
                                color: textColor
                            } as React.CSSProperties}
                            className="h-11 pl-9 pr-4 rounded-2xl border border-zinc-200 bg-[#FAFAFA] focus-visible:bg-white text-sm font-medium focus:outline-none transition-colors w-full sm:w-64 shadow-sm"
                        />
                    </div>
                    {/* Custom Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(p => !p)}
                            style={{ borderColor: dropdownOpen ? accentColor : undefined, color: textColor } as React.CSSProperties}
                            className="h-11 pl-4 pr-10 rounded-2xl border border-zinc-200 bg-[#FAFAFA] text-sm font-bold focus:outline-none transition-all cursor-pointer shadow-sm hover:border-zinc-300 hover:bg-white flex items-center gap-2 min-w-[160px] relative"
                        >
                            <span>{filterOptions.find(o => o.value === statusFilter)?.emoji}</span>
                            <span className="flex-1 text-left">{filterOptions.find(o => o.value === statusFilter)?.label}</span>
                            <ChevronDown
                                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-200/60 py-2 min-w-full overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                {filterOptions.map(option => {
                                    const isActive = statusFilter === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => { setStatusFilter(option.value); setDropdownOpen(false); }}
                                            style={isActive ? { color: accentColor, backgroundColor: `${accentColor}10` } : { color: textColor }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-zinc-50 transition-colors text-left"
                                        >
                                            <span>{option.emoji}</span>
                                            <span>{option.label}</span>
                                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lista de ideas */}
            <div className="space-y-3 md:space-y-4">
                {filteredIdeas.map((idea) => (
                    <div key={idea.id} className="group flex gap-3 md:gap-5 p-4 md:p-6 bg-white border border-zinc-200 rounded-2xl md:rounded-3xl hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 transition-all">
                        <form action={upvoteIdea.bind(null, idea.id, boardSlug)} className="shrink-0 text-[#FF5C00]">
                            <button
                                type="submit"
                                style={{
                                    '--hover-bg': `${accentColor}15`,
                                    '--hover-border': accentColor,
                                    '--hover-text': accentColor
                                } as React.CSSProperties}
                                className="flex flex-col items-center justify-center w-14 md:w-16 h-18 md:h-20 border border-zinc-200 bg-[#FAFAFA] rounded-xl md:rounded-2xl hover:bg-[var(--hover-bg)] hover:border-[var(--hover-border)] hover:text-[var(--hover-text)] transition-colors active:scale-95 group/btn shadow-sm"
                            >
                                <span className="text-zinc-400 font-black mb-0.5 md:mb-1 text-[10px] md:text-sm group-hover/btn:text-[var(--hover-text)]">▲</span>
                                <span className="text-zinc-900 font-black text-lg md:text-xl leading-none group-hover/btn:text-[var(--hover-text)]">{idea.votes.length}</span>
                            </button>
                        </form>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 md:gap-3 mb-1.5 md:mb-2 text-left">
                                <h3 className="font-[family-name:var(--font-jakarta)] text-lg md:text-xl font-bold tracking-tight truncate leading-tight" style={{ color: textColor }}>
                                    {idea.title}
                                </h3>
                                {idea.status !== 'pending' && (
                                    <span className={`w-fit px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] uppercase font-black md:font-bold tracking-wider 
                                        ${idea.status === 'done' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            idea.status === 'planned' ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}`}>
                                        {idea.status === 'done' ? dict.tag_done : dict.tag_planned}
                                    </span>
                                )}
                                {idea.tag && (
                                    <span
                                        className="w-fit flex items-center gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] uppercase font-black tracking-wider border border-zinc-200 bg-white"
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: idea.tag.color }} />
                                        <span className="text-zinc-600">{idea.tag.name}</span>
                                    </span>
                                )}
                            </div>
                            <p className="font-medium text-xs md:text-base leading-relaxed whitespace-pre-wrap line-clamp-2 md:line-clamp-3 opacity-80" style={{ color: textColor }}>
                                {idea.description}
                            </p>
                        </div>
                    </div>
                ))}

                {filteredIdeas.length === 0 && (
                    <div className="p-16 text-center bg-white border-2 border-zinc-200 rounded-3xl border-dashed">
                        <span className="text-4xl block mb-4">👀</span>
                        <p className="font-bold text-lg" style={{ color: textColor }}>{dict.empty_title}</p>
                        <p className="font-medium mt-1 opacity-60" style={{ color: textColor }}>{dict.empty_desc}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
