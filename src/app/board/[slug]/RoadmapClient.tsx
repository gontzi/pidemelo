'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { upvoteIdea } from './actions';
import AdminResponseBlock from '@/components/AdminResponseBlock';
import { Panel } from '@/components/ui/panel';
import { ROADMAP_STATUSES, groupIdeasByStatus, type RoadmapStatus } from '@/lib/roadmap';
import { cn, readableTextColor } from '@/lib/utils';
import { STATUS_DOT } from '@/lib/idea-status';

type RoadmapIdea = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    status: RoadmapStatus;
    votesCount: number;
    tag: { id: string; name: string; color: string } | null;
    adminResponse?: string | null;
};

const COLUMN_LABELS: Record<RoadmapStatus, string> = {
    planeado: 'col_planned',
    en_progreso: 'col_in_progress',
    completado: 'col_done',
};

export default function RoadmapClient({ boardSlug, initialIdeas, dict }: {
    boardSlug: string;
    initialIdeas: RoadmapIdea[];
    dict: Record<string, string>;
}) {
    const grouped = groupIdeasByStatus(initialIdeas);

    return (
        <div className="space-y-6">
            <Link
                href={`/board/${boardSlug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#5C6478] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-lg"
            >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                {dict.back}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
                {ROADMAP_STATUSES.map(status => (
                    <Panel key={status} tone="card" padding="md" className="space-y-3 self-start">
                        <header className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_DOT[status])} aria-hidden="true" />
                                <h2 className="text-sm font-bold text-foreground">
                                    {dict[COLUMN_LABELS[status]]}
                                </h2>
                            </div>
                            <span className="text-[11px] font-bold text-foreground/70 bg-white/55 px-2.5 py-0.5 rounded-full">
                                {grouped[status].length}
                            </span>
                        </header>

                        {grouped[status].length === 0 ? (
                            <div className="border-2 border-dashed border-white/70 rounded-2xl py-10 text-center text-xs font-semibold text-foreground/40">
                                {dict.empty}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {grouped[status].map(idea => (
                                    <article key={idea.id} className="bg-card border border-black/5 rounded-2xl p-4 shadow-soft transition-shadow hover:shadow-card">
                                        <div className="flex items-start gap-3">
                                            <form action={upvoteIdea.bind(null, idea.id, boardSlug)}>
                                                <button
                                                    type="submit"
                                                    aria-label={`${dict.votes}: ${idea.votesCount}`}
                                                    className="flex flex-col items-center justify-center w-12 h-14 border border-black/10 rounded-xl bg-white text-[#FF5C00] transition-colors hover:bg-primary/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                                >
                                                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                                                    <span className="font-bold text-base leading-none">{idea.votesCount}</span>
                                                </button>
                                            </form>

                                            <div className="flex-1 min-w-0">
                                                {idea.tag && (
                                                    <span
                                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border border-black/10"
                                                        style={{ backgroundColor: idea.tag.color, color: readableTextColor(idea.tag.color) }}
                                                    >
                                                        {idea.tag.name}
                                                    </span>
                                                )}
                                                <h3 className="mt-1.5 font-bold text-foreground leading-snug break-words">{idea.title}</h3>
                                                <p className="mt-1 text-sm text-[#5C6478] font-medium line-clamp-3 whitespace-pre-wrap break-words">
                                                    {idea.description}
                                                </p>
                                                <AdminResponseBlock
                                                    response={idea.adminResponse ?? ''}
                                                    label={dict.response_label}
                                                />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </Panel>
                ))}
            </div>
        </div>
    );
}
