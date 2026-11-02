'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, Copy } from 'lucide-react';
import { countNewSince, readLastSeen } from '@/lib/last-seen';
import type { Dictionary } from '@/i18n/types';
import type { BoardSummary } from './BoardsBrowser';

export default function ProjectCard({ board, dict }: { board: BoardSummary; dict: Dictionary['dashboard_index'] }) {
    const [copied, setCopied] = useState(false);
    const [newCount, setNewCount] = useState(0);

    useEffect(() => {
        setNewCount(countNewSince(board.ideaCreatedAts, readLastSeen(board.id)));
    }, [board.id, board.ideaCreatedAts]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/board/${board.slug}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* portapapeles no disponible */
        }
    };

    return (
        <article className="group relative flex flex-col rounded-xl border border-border bg-card p-4 transition-shadow focus-within:ring-2 focus-within:ring-ring/40 hover:shadow-card md:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="truncate font-heading text-lg font-bold tracking-tight text-foreground">
                        {/* Enlace estirado: toda la tarjeta abre el tablero */}
                        <Link href={`/dashboard/board/${board.id}`} className="after:absolute after:inset-0 after:rounded-xl focus:outline-none">
                            {board.name}
                        </Link>
                    </h2>
                    <p className="truncate text-xs text-muted-foreground">pidemelo.app/board/{board.slug}</p>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? dict.copied : dict.copy_link}
                    title={copied ? dict.copied : dict.copy_link}
                    className="relative z-10 -mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-95"
                >
                    {copied ? <Check className="h-4 w-4 text-[#2F7457]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                    {board.toReviewCount > 0 ? (
                        <span className="rounded-full bg-[#FFF0E8] px-2 py-0.5 font-semibold text-[#C24A00]">
                            {board.toReviewCount} {dict.to_review}
                        </span>
                    ) : (
                        <span className="rounded-full bg-mint px-2 py-0.5 font-semibold text-[#2F7457]">{dict.all_caught_up}</span>
                    )}
                    {newCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 font-semibold text-primary-foreground">
                            {newCount} {dict.new_count}
                        </span>
                    )}
                    <span className="text-muted-foreground">
                        {board.openCount} {dict.open_ideas}
                    </span>
                </div>
                <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden="true"
                />
            </div>
        </article>
    );
}
