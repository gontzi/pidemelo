'use client';

import { useState, useRef, useEffect, useMemo, useTransition } from 'react';
import { upvoteIdea } from './actions';
import {
    Search,
    ChevronDown,
    ChevronUp,
    Check,
    Inbox,
    Clock,
    Hammer,
    Rocket,
    CheckCircle2,
    Archive,
    Layers,
    X,
} from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';
import AdminResponseBlock from '@/components/AdminResponseBlock';
import { cn, readableTextColor } from '@/lib/utils';
import { STATUS_BADGE } from '@/lib/idea-status';

type Idea = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    status: 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado';
    votesCount: number;
    tag: { id: string; name: string; color: string; } | null;
    adminResponse?: string | null;
};

type StatusFilter = 'all' | Idea['status'];

// Lista pública de ideas con votos. Se usa en el tablero público y en el widget
// de tablero; el color de marca y el modo oscuro llegan por tokens CSS.
export default function PublicBoardClient({
    initialIdeas,
    boardSlug,
    widgetVersion = 'normal',
    embedded = false,
    votedIdeaIds = [],
    dict
}: {
    initialIdeas: Idea[],
    boardSlug: string,
    widgetVersion?: 'normal' | 'lite',
    // Dentro de un iframe no hay cabecera fija encima de la barra de filtros
    embedded?: boolean,
    votedIdeaIds?: string[],
    dict: Record<string, string>
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Votos del visitante: los que ya constaban en el servidor + los de esta sesión
    const [voted, setVoted] = useState<Set<string>>(() => new Set(votedIdeaIds));
    const [, startVoting] = useTransition();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isLite = widgetVersion === 'lite';

    // Clave estable: evita re-ejecutar el efecto por arrays nuevos con el mismo contenido
    const votedKey = votedIdeaIds.join(',');
    useEffect(() => {
        if (!votedKey) return;
        setVoted(prev => new Set(Array.from(prev).concat(votedKey.split(","))));
    }, [votedKey]);

    const handleVote = (id: string) => {
        if (voted.has(id)) return;
        setVoted(prev => new Set(prev).add(id));
        startVoting(async () => {
            try {
                await upvoteIdea(id, boardSlug);
            } catch {
                // Si falla, deshacemos la marca para permitir reintentar
                setVoted(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        });
    };

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
        { value: 'all', label: dict.filter_all, Icon: Layers },
        { value: 'en_revision', label: dict.filter_pending, Icon: Clock },
        { value: 'planeado', label: dict.filter_planned, Icon: Hammer },
        { value: 'en_progreso', label: dict.filter_in_progress, Icon: Rocket },
        { value: 'completado', label: dict.filter_done, Icon: CheckCircle2 },
        { value: 'descartado', label: dict.filter_discarded, Icon: Archive }
    ] as const;

    const activeFilter = filterOptions.find(o => o.value === statusFilter);
    const hasFilters = statusFilter !== 'all' || searchQuery.trim().length > 0;

    const filteredIdeas = useMemo(() => initialIdeas.filter(idea => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || idea.title.toLowerCase().includes(q) || idea.description.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [initialIdeas, searchQuery, statusFilter]);

    const resetFilters = () => { setSearchQuery(''); setStatusFilter('all'); };

    const statusLabel = (status: Idea['status']) =>
        status === 'completado' ? dict.tag_done :
            status === 'planeado' ? dict.tag_planned :
                status === 'en_progreso' ? dict.tag_in_progress :
                    status === 'descartado' ? dict.tag_discarded : '';

    const toolbar = (
        <div className="flex items-center gap-2">
            <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-muted-foreground">
                {dict.showing} <span className="text-foreground">{filteredIdeas.length}</span>
            </p>
            <div className="relative ml-auto min-w-0 max-w-[280px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                    type="search"
                    placeholder={dict.search_placeholder}
                    aria-label={dict.search_placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm font-medium text-foreground transition-colors placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
            </div>
            <div className="relative shrink-0" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setDropdownOpen(p => !p)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    className="relative flex h-9 max-w-[150px] cursor-pointer items-center gap-2 rounded-lg border border-input bg-card pl-3 pr-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.98]"
                >
                    {activeFilter && <activeFilter.Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}
                    <span className="truncate">{activeFilter?.label}</span>
                    <ChevronDown className={cn('absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')} aria-hidden="true" />
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[190px] overflow-hidden rounded-lg border border-border bg-popover py-1.5 shadow-pop animate-pop" role="listbox">
                        {filterOptions.map(option => {
                            const isActive = statusFilter === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => { setStatusFilter(option.value); setDropdownOpen(false); }}
                                    className={cn(
                                        'flex w-full items-center gap-3 px-3.5 py-2 text-left text-sm font-medium transition-colors',
                                        isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                                    )}
                                >
                                    <option.Icon className="h-4 w-4" aria-hidden="true" />
                                    <span>{option.label}</span>
                                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            {hasFilters && (
                <button
                    type="button"
                    onClick={resetFilters}
                    aria-label={dict.clear}
                    title={dict.clear}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-muted"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );

    return (
        <section className="space-y-4 text-foreground">
            {!isLite && (
                <div
                    className={cn(
                        'sticky z-20 bg-background/85 py-3 backdrop-blur',
                        embedded ? 'top-0 bg-card/90 py-2' : '-mx-4 top-14 px-4 md:static md:mx-0 md:px-0 md:py-0'
                    )}
                >
                    {toolbar}
                </div>
            )}

            <div className={cn(isLite ? 'space-y-2' : 'space-y-3')}>
                {filteredIdeas.map((idea) => {
                    const hasVoted = voted.has(idea.id);
                    return (
                        <article
                            key={idea.id}
                            className={cn(
                                'flex gap-3 rounded-xl border border-border bg-card transition-shadow hover:shadow-card md:gap-4',
                                isLite ? 'p-3' : 'p-4 md:p-5'
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => handleVote(idea.id)}
                                disabled={hasVoted}
                                aria-label={`${hasVoted ? dict.voted : dict.vote} (${idea.votesCount})`}
                                aria-pressed={hasVoted}
                                className={cn(
                                    'flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                    isLite ? 'h-12 w-11' : 'h-16 w-14',
                                    hasVoted
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border bg-muted/40 text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary'
                                )}
                            >
                                {hasVoted
                                    ? <Check className="h-4 w-4" aria-hidden="true" />
                                    : <ChevronUp className="h-4 w-4" aria-hidden="true" />}
                                <span className="text-base font-bold leading-none text-foreground">{idea.votesCount}</span>
                                {!isLite && (
                                    <span className="text-[9px] opacity-80">{hasVoted ? dict.voted : dict.vote}</span>
                                )}
                            </button>

                            <div className="min-w-0 flex-1">
                                {!isLite && (idea.status !== 'en_revision' || idea.tag) && (
                                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                        {idea.status !== 'en_revision' && (
                                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', STATUS_BADGE[idea.status])}>
                                                {statusLabel(idea.status)}
                                            </span>
                                        )}
                                        {idea.tag && (
                                            <span
                                                className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[10px] font-bold"
                                                style={{ backgroundColor: idea.tag.color, color: readableTextColor(idea.tag.color) }}
                                            >
                                                {idea.tag.name}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <h3 className={cn('break-words font-heading font-bold leading-snug text-foreground', isLite ? 'text-sm' : 'text-base md:text-lg')}>
                                    {idea.title}
                                </h3>
                                <p className={cn(
                                    'mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground',
                                    isLite ? 'line-clamp-1' : 'line-clamp-2 md:line-clamp-3'
                                )}>
                                    {idea.description}
                                </p>

                                {idea.imageUrl && !isLite && (
                                    <ImageLightbox
                                        src={idea.imageUrl}
                                        alt={idea.title}
                                        className="mt-3 rounded-lg border border-border"
                                        closeLabel={dict.close}
                                    />
                                )}
                                {!isLite && (
                                    <AdminResponseBlock
                                        response={idea.adminResponse ?? ''}
                                        label={dict.admin_response}
                                    />
                                )}
                            </div>
                        </article>
                    );
                })}

                {filteredIdeas.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-border bg-card p-10 text-center">
                        {initialIdeas.length === 0
                            ? <Inbox className="mx-auto mb-3 h-9 w-9 text-muted-foreground" aria-hidden="true" />
                            : <Search className="mx-auto mb-3 h-9 w-9 text-muted-foreground" aria-hidden="true" />}
                        <p className="font-heading font-bold text-foreground">{dict.empty_title}</p>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">{dict.empty_desc}</p>
                        {initialIdeas.length > 0 && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                {dict.clear}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
