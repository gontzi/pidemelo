'use client';

import { useMemo, useState } from 'react';
import { Search, X, SearchX } from 'lucide-react';
import type { Dictionary } from '@/i18n/types';
import ProjectCard from './ProjectCard';

export type BoardSummary = {
    id: string;
    name: string;
    slug: string;
    openCount: number;
    toReviewCount: number;
    ideaCreatedAts: string[];
};

// La búsqueda solo aparece cuando hay suficientes tableros para necesitarla
const SEARCH_THRESHOLD = 4;

export default function BoardsBrowser({
    boards,
    dict,
}: {
    boards: BoardSummary[];
    dict: Dictionary['dashboard_index'];
}) {
    const [query, setQuery] = useState('');
    const q = query.trim().toLowerCase();

    const filtered = useMemo(
        () => (!q ? boards : boards.filter(b => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q))),
        [boards, q]
    );

    return (
        <div className="space-y-4">
            {boards.length >= SEARCH_THRESHOLD && (
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={dict.search_boards}
                        aria-label={dict.search_boards}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            aria-label={dict.clear}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    )}
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                    <SearchX className="mb-3 h-9 w-9 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground">{dict.no_boards_found}</p>
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="mt-3 text-sm font-semibold text-primary hover:underline"
                    >
                        {dict.clear}
                    </button>
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                    {filtered.map(board => (
                        <ProjectCard key={board.id} board={board} dict={dict} />
                    ))}
                </section>
            )}
        </div>
    );
}
