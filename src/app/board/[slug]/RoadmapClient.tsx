'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { upvoteIdea } from './actions';
import AdminResponseBlock from '@/components/AdminResponseBlock';
import { ROADMAP_STATUSES, groupIdeasByStatus, type RoadmapStatus } from '@/lib/roadmap';
import { cn } from '@/lib/utils';

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
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 rounded-lg"
            >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                {dict.back}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
                {ROADMAP_STATUSES.map(status => (
                    <section key={status} className="space-y-3">
                        <header className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'h-2.5 w-2.5 rounded-full',
                                        status === 'completado' ? 'bg-green-500' : status === 'en_progreso' ? 'bg-blue-500' : 'bg-amber-500'
                                    )}
                                    aria-hidden="true"
                                />
                                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-700">
                                    {dict[COLUMN_LABELS[status]]}
                                </h2>
                            </div>
                            <span className="text-[10px] font-black text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                                {grouped[status].length}
                            </span>
                        </header>

                        {grouped[status].length === 0 ? (
                            <div className="border-2 border-dashed border-zinc-200 rounded-2xl py-10 text-center text-xs font-bold uppercase tracking-widest text-zinc-300">
                                {dict.empty}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {grouped[status].map(idea => (
                                    <article key={idea.id} className="bg-white border border-zinc-200 rounded-2xl p-4">
                                        <div className="flex items-start gap-3">
                                            <form action={upvoteIdea.bind(null, idea.id, boardSlug)}>
                                                <button
                                                    type="submit"
                                                    aria-label={`${dict.votes}: ${idea.votesCount}`}
                                                    className="flex flex-col items-center justify-center w-12 h-14 border border-zinc-200 rounded-xl bg-[#FAFAFA] text-[#FF5C00] transition-colors hover:bg-[#FF5C00]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]/40"
                                                >
                                                    <span className="text-[9px] font-black text-zinc-400" aria-hidden="true">▲</span>
                                                    <span className="font-black text-base leading-none">{idea.votesCount}</span>
                                                </button>
                                            </form>

                                            <div className="flex-1 min-w-0">
                                                {idea.tag && (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider border border-zinc-100 px-2 py-0.5 rounded-full text-zinc-500">
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: idea.tag.color }} />
                                                        {idea.tag.name}
                                                    </span>
                                                )}
                                                <h3 className="mt-1 font-bold text-zinc-900 leading-snug break-words">{idea.title}</h3>
                                                <p className="mt-1 text-sm text-zinc-500 font-medium line-clamp-3 whitespace-pre-wrap break-words">
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
                    </section>
                ))}
            </div>
        </div>
    );
}