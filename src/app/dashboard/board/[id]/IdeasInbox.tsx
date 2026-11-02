'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { ChevronUp, Inbox, MessageSquare, Search, SearchX, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ConfirmDialog';
import { cn, readableTextColor } from '@/lib/utils';
import { formatRelative } from '@/lib/relative-time';
import { readLastSeen, writeLastSeen } from '@/lib/last-seen';
import { STATUS_BADGE, isClosedStatus, type IdeaStatus } from '@/lib/idea-status';
import type { Dictionary } from '@/i18n/types';
import { updateIdeaStatus, deleteIdea, setAdminResponse } from './actions';
import IdeaPanel, { statusLabel } from './IdeaPanel';
import type { InboxIdea } from './types';

type Filter = 'open' | 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'closed';
type Sort = 'recent' | 'votes';

function matchesFilter(idea: InboxIdea, filter: Filter): boolean {
    if (filter === 'open') return !isClosedStatus(idea.status);
    if (filter === 'closed') return isClosedStatus(idea.status);
    return idea.status === filter;
}

export default function IdeasInbox({
    initialIdeas,
    boardId,
    dict,
    locale,
}: {
    initialIdeas: InboxIdea[];
    boardId: string;
    dict: Dictionary['inbox'];
    locale: string;
}) {
    const [ideas, setIdeas] = useState<InboxIdea[]>(initialIdeas);
    const [filter, setFilter] = useState<Filter>(() =>
        initialIdeas.some(i => i.status === 'en_revision') ? 'en_revision' : 'open'
    );
    const [sort, setSort] = useState<Sort>('recent');
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [snapshot, setSnapshot] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [lastSeen, setLastSeen] = useState<number | null>(null);
    const [deleting, startDeleting] = useTransition();

    useEffect(() => { setIdeas(initialIdeas); }, [initialIdeas]);

    // Recordamos la visita anterior para resaltar lo nuevo y registramos la actual
    useEffect(() => {
        setLastSeen(readLastSeen(boardId));
        writeLastSeen(boardId);
    }, [boardId]);

    const isNew = (idea: InboxIdea) => lastSeen !== null && new Date(idea.createdAt).getTime() > lastSeen;

    const counts = useMemo(() => {
        const result: Record<Filter, number> = { open: 0, en_revision: 0, planeado: 0, en_progreso: 0, completado: 0, closed: 0 };
        for (const idea of ideas) {
            (Object.keys(result) as Filter[]).forEach(f => { if (matchesFilter(idea, f)) result[f] += 1; });
        }
        return result;
    }, [ideas]);

    const query = search.trim().toLowerCase();
    const visible = useMemo(() => {
        const list = ideas.filter(idea =>
            matchesFilter(idea, filter) &&
            (!query ||
                idea.title.toLowerCase().includes(query) ||
                idea.description.toLowerCase().includes(query) ||
                (idea.tag?.name.toLowerCase().includes(query) ?? false))
        );
        return list.sort((a, b) =>
            sort === 'votes'
                ? b.votesCount - a.votesCount
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [ideas, filter, query, sort]);

    const selected = ideas.find(i => i.id === selectedId) ?? null;

    const openIdea = (id: string) => {
        setSnapshot(visible.map(i => i.id));
        setSelectedId(id);
    };

    // Siguiente idea según el orden de la lista en el momento de abrir el panel
    const nextId = useMemo(() => {
        if (!selectedId) return null;
        const start = snapshot.indexOf(selectedId);
        for (let i = start + 1; i < snapshot.length; i++) {
            if (ideas.some(idea => idea.id === snapshot[i])) return snapshot[i];
        }
        return null;
    }, [selectedId, snapshot, ideas]);

    const patchIdea = (id: string, patch: Partial<InboxIdea>) =>
        setIdeas(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));

    const changeStatus = async (id: string, status: IdeaStatus) => {
        const previous = ideas.find(i => i.id === id)?.status;
        if (!previous || previous === status) return;
        patchIdea(id, { status });
        const res = await updateIdeaStatus(id, status, boardId);
        if (res?.error) patchIdea(id, { status: previous });
    };

    const saveResponse = async (id: string, response: string): Promise<boolean> => {
        const res = await setAdminResponse(id, boardId, response);
        if (res?.error) return false;
        patchIdea(id, { adminResponse: response.trim() || null });
        return true;
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        const id = deleteId;
        startDeleting(async () => {
            const res = await deleteIdea(id, boardId);
            if (res?.error) return;
            setIdeas(prev => prev.filter(i => i.id !== id));
            if (selectedId === id) setSelectedId(nextId);
            setDeleteId(null);
        });
    };

    const filters: { id: Filter; label: string }[] = [
        { id: 'en_revision', label: dict.filter_review },
        { id: 'open', label: dict.filter_all },
        { id: 'planeado', label: dict.filter_planned },
        { id: 'en_progreso', label: dict.filter_progress },
        { id: 'completado', label: dict.filter_done },
        { id: 'closed', label: dict.filter_closed },
    ];

    if (ideas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-[#FFF0E8] text-[#FF5C00]">
                    <Inbox className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground">{dict.empty_board_title}</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">{dict.empty_board_desc}</p>
                <Button asChild className="mt-6">
                    <Link href={`/dashboard/board/${boardId}/share`}>
                        <Share2 aria-hidden="true" /> {dict.empty_board_cta}
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filtros por estado */}
            <div
                role="tablist"
                aria-label={dict.filters_label}
                className="-mx-4 flex gap-2 overflow-x-auto px-4 hide-scrollbar md:mx-0 md:flex-wrap md:px-0"
            >
                {filters.map(f => {
                    const active = filter === f.id;
                    return (
                        <button
                            key={f.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setFilter(f.id)}
                            className={cn(
                                'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                active
                                    ? 'border-foreground bg-foreground text-background'
                                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {f.label}
                            <span
                                className={cn(
                                    'rounded-full px-1.5 text-xs font-semibold tabular-nums',
                                    active
                                        ? 'bg-background/20'
                                        : f.id === 'en_revision' && counts.en_revision > 0
                                            ? 'bg-[#FFF0E8] text-[#C24A00]'
                                            : 'bg-muted'
                                )}
                            >
                                {counts[f.id]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Búsqueda + orden */}
            <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1 md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={dict.search}
                        aria-label={dict.search}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            aria-label={dict.clear_search}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    )}
                </div>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    aria-label={dict.sort_label}
                    className="h-10 shrink-0 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:ml-auto"
                >
                    <option value="recent">{dict.sort_recent}</option>
                    <option value="votes">{dict.sort_votes}</option>
                </select>
            </div>

            {/* Lista */}
            {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
                    {query ? (
                        <>
                            <SearchX className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
                            <p className="text-sm font-semibold text-foreground">{dict.no_results}</p>
                            <button type="button" onClick={() => setSearch('')} className="mt-2 text-sm font-semibold text-primary hover:underline">
                                {dict.clear_search}
                            </button>
                        </>
                    ) : (
                        <>
                            <Inbox className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
                            <p className="text-sm font-semibold text-foreground">
                                {filter === 'en_revision' ? dict.empty_review_title : dict.empty_title}
                            </p>
                            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                                {filter === 'en_revision' ? dict.empty_review_desc : dict.empty_desc}
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                    {visible.map(idea => {
                        const fresh = isNew(idea);
                        return (
                            <li key={idea.id}>
                                <button
                                    type="button"
                                    onClick={() => openIdea(idea.id)}
                                    className={cn(
                                        'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none md:gap-4 md:px-5',
                                        selectedId === idea.id && 'bg-muted/50'
                                    )}
                                >
                                    <span className="flex w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-background py-1.5">
                                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                        <span className="text-sm font-bold tabular-nums text-foreground">{idea.votesCount}</span>
                                    </span>

                                    <span className="min-w-0 flex-1 space-y-1">
                                        <span className="flex items-start gap-2">
                                            {fresh && (
                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label={dict.new} />
                                            )}
                                            <span className={cn('line-clamp-2 break-words font-heading text-[15px] leading-snug text-foreground', fresh ? 'font-bold' : 'font-semibold')}>
                                                {idea.title}
                                            </span>
                                        </span>
                                        <span className="line-clamp-1 block text-sm text-muted-foreground">{idea.description}</span>
                                        <span className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
                                            <span className={cn('rounded-full px-2 py-0.5 font-semibold', STATUS_BADGE[idea.status])}>
                                                {statusLabel(idea.status, dict)}
                                            </span>
                                            {idea.tag && (
                                                <span
                                                    className="max-w-[140px] truncate rounded-full border border-black/10 px-2 py-0.5 font-semibold"
                                                    style={{ backgroundColor: idea.tag.color, color: readableTextColor(idea.tag.color) }}
                                                >
                                                    {idea.tag.name}
                                                </span>
                                            )}
                                            {idea.adminResponse && (
                                                <span className="inline-flex items-center gap-1 text-[#2F7457]">
                                                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" /> {dict.answered}
                                                </span>
                                            )}
                                            <span aria-hidden="true">·</span>
                                            <time dateTime={idea.createdAt}>{formatRelative(idea.createdAt, locale)}</time>
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <IdeaPanel
                idea={selected}
                open={selected !== null}
                isNew={selected ? isNew(selected) : false}
                dict={dict}
                locale={locale}
                onOpenChange={(open) => { if (!open) setSelectedId(null); }}
                onStatusChange={(status) => { if (selected) void changeStatus(selected.id, status); }}
                onSaveResponse={(response) => (selected ? saveResponse(selected.id, response) : Promise.resolve(false))}
                onDelete={() => { if (selected) setDeleteId(selected.id); }}
                onNext={nextId ? () => setSelectedId(nextId) : null}
            />

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
                title={dict.delete_title}
                description={dict.delete_desc}
                confirmLabel={dict.delete_confirm}
                pendingLabel={dict.deleting}
                cancelLabel={dict.cancel}
                pending={deleting}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
