'use client';

import { useState, useRef, useEffect } from 'react';
import { upvoteIdea } from './actions';
import { Search, ChevronDown } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';

type Idea = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    status: 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado';
    votes: { id: string }[];
    tag: { id: string; name: string; color: string; } | null;
};

export default function PublicBoardClient({
    initialIdeas,
    boardSlug,
    accentColor = "#FF5C00",
    textColor = "#18181b",
    isDarkMode = false,
    widgetVersion = 'normal',
    dict
}: {
    initialIdeas: Idea[],
    boardSlug: string,
    accentColor?: string,
    textColor?: string,
    isDarkMode?: boolean,
    widgetVersion?: 'normal' | 'lite',
    dict: Record<string, string>
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado'>('all');
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
        { value: 'all', label: dict.filter_all || 'Todas', emoji: '🗂️' },
        { value: 'en_revision', label: dict.filter_pending || 'En Revisión', emoji: '🤔' },
        { value: 'planeado', label: dict.filter_planned || 'Planeado', emoji: '🏗️' },
        { value: 'en_progreso', label: dict.filter_in_progress || 'En Progreso', emoji: '⚙️' },
        { value: 'completado', label: dict.filter_done || 'Completado', emoji: '✅' },
        { value: 'descartado', label: dict.filter_discarded || 'Descartadas', emoji: '💨' }
    ] as const;

    const filteredIdeas = initialIdeas.filter(idea => {
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <section className="space-y-6" style={{ color: isDarkMode ? '#f4f4f5' : '#18181b' }}>
            {/* Cabecera con título y filtros */}
            {widgetVersion !== 'lite' && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold tracking-tight inline-flex items-center gap-2" style={{ color: isDarkMode ? '#f4f4f5' : '#18181b' }}>
                        {dict.showing} <span>🔥</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
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
                                    color: isDarkMode ? '#f4f4f5' : '#18181b'
                                } as React.CSSProperties}
                                className={`h-11 pl-9 pr-4 rounded-2xl border ${isDarkMode ? 'border-zinc-800 bg-zinc-900 placeholder:text-zinc-600 focus-visible:bg-zinc-800' : 'border-zinc-200 bg-[#FAFAFA] focus-visible:bg-white'} text-sm font-medium focus:outline-none transition-colors w-full sm:w-64 shadow-sm`}
                            />
                        </div>
                        {/* Custom Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(p => !p)}
                                style={{ borderColor: dropdownOpen ? accentColor : (isDarkMode ? '#27272a' : undefined), color: isDarkMode ? '#f4f4f5' : '#18181b', backgroundColor: isDarkMode ? '#18181b' : '#FAFAFA' } as React.CSSProperties}
                                className={`h-11 pl-4 pr-10 rounded-2xl border ${isDarkMode ? 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900' : 'border-zinc-200 hover:border-zinc-300 hover:bg-white'} text-sm font-bold focus:outline-none transition-all cursor-pointer shadow-sm flex items-center gap-2 min-w-[160px] relative`}
                            >
                                <span>{filterOptions.find(o => o.value === statusFilter)?.emoji}</span>
                                <span className="flex-1 text-left">{filterOptions.find(o => o.value === statusFilter)?.label}</span>
                                <ChevronDown
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className={`absolute top-[calc(100%+8px)] right-0 z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-black/50' : 'bg-white border-zinc-200 shadow-zinc-200/60'} border rounded-2xl shadow-xl py-2 min-w-full overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150`}>
                                    {filterOptions.map(option => {
                                        const isActive = statusFilter === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => { setStatusFilter(option.value); setDropdownOpen(false); }}
                                                style={isActive ? { color: accentColor, backgroundColor: `${accentColor}10` } : { color: isDarkMode ? '#f4f4f5' : '#18181b' }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold ${isDarkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'} transition-colors text-left`}
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
            )}

            {/* Lista de ideas */}
            <div className="space-y-3 md:space-y-4">
                {filteredIdeas.map((idea) => (
                    <div key={idea.id} className={`group flex gap-3 md:gap-5 p-4 md:p-6 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-black/50' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/50'} border rounded-2xl md:rounded-3xl hover:shadow-lg transition-all`}>
                        <form action={upvoteIdea.bind(null, idea.id, boardSlug)} className="shrink-0 text-[#FF5C00]">
                            <button
                                type="submit"
                                style={{
                                    '--hover-bg': `${accentColor}15`,
                                    '--hover-border': accentColor,
                                    '--hover-text': accentColor,
                                    backgroundColor: isDarkMode ? '#18181b' : '#FAFAFA'
                                } as React.CSSProperties}
                                className={`flex flex-col items-center justify-center w-14 md:w-16 h-18 md:h-20 border ${isDarkMode ? 'border-zinc-800 hover:bg-[var(--hover-bg)]' : 'border-zinc-200 hover:bg-[var(--hover-bg)]'} rounded-xl md:rounded-2xl hover:border-[var(--hover-border)] hover:text-[var(--hover-text)] transition-colors active:scale-95 group/btn shadow-sm`}
                            >
                                <span className="text-zinc-400 font-black mb-0.5 md:mb-1 text-[10px] md:text-sm group-hover/btn:text-[var(--hover-text)]">▲</span>
                                <span className={`font-black text-lg md:text-xl leading-none group-hover/btn:text-[var(--hover-text)] ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{idea.votes.length}</span>
                            </button>
                        </form>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1.5 md:gap-3 mb-1.5 md:mb-2 text-left min-w-0">
                                <h3 className="font-[family-name:var(--font-jakarta)] text-lg md:text-xl font-bold tracking-tight truncate leading-tight" style={{ color: isDarkMode ? '#f4f4f5' : '#18181b' }}>
                                    {idea.title}
                                </h3>
                                {idea.status !== 'en_revision' && widgetVersion !== 'lite' && (
                                    <span className={`w-fit px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] uppercase font-black md:font-bold tracking-wider 
                                        ${idea.status === 'completado' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            idea.status === 'planeado' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                idea.status === 'en_progreso' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    idea.status === 'descartado' ? 'bg-zinc-100 text-zinc-500 border border-zinc-200' : ''}`}>
                                        {idea.status === 'completado' ? (dict.tag_done || 'Completado') :
                                            idea.status === 'planeado' ? (dict.tag_planned || 'Planeado') :
                                                idea.status === 'en_progreso' ? (dict.tag_in_progress || 'En Progreso') :
                                                    idea.status === 'descartado' ? (dict.tag_discarded || 'Descartado') : ''}
                                    </span>
                                )}
                                {idea.tag && widgetVersion !== 'lite' && (
                                    <span
                                        className="w-fit flex items-center gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] uppercase font-black tracking-wider border border-zinc-200 bg-white"
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: idea.tag.color }} />
                                        <span className={`${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{idea.tag.name}</span>
                                    </span>
                                )}
                            </div>
                            <p className={`font-medium text-xs md:text-base leading-relaxed whitespace-pre-wrap break-words ${widgetVersion === 'lite' ? 'line-clamp-1 opacity-60' : 'line-clamp-2 md:line-clamp-3 opacity-80'}`} style={{ color: isDarkMode ? '#d4d4d8' : '#18181b' }}>
                                {idea.description}
                            </p>
                            {idea.imageUrl && widgetVersion !== 'lite' && (
                                <ImageLightbox
                                    src={idea.imageUrl}
                                    alt={idea.title}
                                    className="mt-4 rounded-xl border border-zinc-100 shadow-sm"
                                />
                            )}
                        </div>
                    </div>
                ))}

                {filteredIdeas.length === 0 && (
                    <div className={`p-16 text-center border-2 rounded-3xl border-dashed ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                        <span className="text-4xl block mb-4">👀</span>
                        <p className="font-bold text-lg" style={{ color: isDarkMode ? '#f4f4f5' : '#18181b' }}>{dict.empty_title}</p>
                        <p className="font-medium mt-1 opacity-60" style={{ color: isDarkMode ? '#d4d4d8' : '#18181b' }}>{dict.empty_desc}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
