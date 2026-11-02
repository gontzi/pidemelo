'use client';

import { useState, useTransition } from 'react';
import { ChevronUp, X, Trash2, ArrowRight, Check } from 'lucide-react';
import { Dialog, DialogClose, DialogDescription, DialogTitle, SheetContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import ImageLightbox from '@/components/ImageLightbox';
import { cn, readableTextColor } from '@/lib/utils';
import { formatRelative } from '@/lib/relative-time';
import { OPEN_STATUSES, STATUS_DOT, isClosedStatus, type IdeaStatus } from '@/lib/idea-status';
import type { Dictionary } from '@/i18n/types';
import type { InboxIdea } from './types';

type InboxDict = Dictionary['inbox'];

export function statusLabel(status: IdeaStatus, dict: InboxDict): string {
    switch (status) {
        case 'en_revision': return dict.status_review;
        case 'planeado': return dict.status_planned;
        case 'en_progreso': return dict.status_progress;
        case 'completado': return dict.status_done;
        default: return dict.status_closed;
    }
}

export default function IdeaPanel({
    idea,
    open,
    isNew,
    dict,
    locale,
    onOpenChange,
    onStatusChange,
    onSaveResponse,
    onDelete,
    onNext,
}: {
    idea: InboxIdea | null;
    open: boolean;
    isNew: boolean;
    dict: InboxDict;
    locale: string;
    onOpenChange: (open: boolean) => void;
    onStatusChange: (status: IdeaStatus) => void;
    onSaveResponse: (response: string) => Promise<boolean>;
    onDelete: () => void;
    onNext: (() => void) | null;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <SheetContent aria-describedby={undefined}>
                {idea && (
                    <IdeaPanelBody
                        key={idea.id}
                        idea={idea}
                        isNew={isNew}
                        dict={dict}
                        locale={locale}
                        onStatusChange={onStatusChange}
                        onSaveResponse={onSaveResponse}
                        onDelete={onDelete}
                        onNext={onNext}
                    />
                )}
            </SheetContent>
        </Dialog>
    );
}

function IdeaPanelBody({
    idea,
    isNew,
    dict,
    locale,
    onStatusChange,
    onSaveResponse,
    onDelete,
    onNext,
}: {
    idea: InboxIdea;
    isNew: boolean;
    dict: InboxDict;
    locale: string;
    onStatusChange: (status: IdeaStatus) => void;
    onSaveResponse: (response: string) => Promise<boolean>;
    onDelete: () => void;
    onNext: (() => void) | null;
}) {
    const [draft, setDraft] = useState(idea.adminResponse ?? '');
    const [saved, setSaved] = useState(false);
    const [failed, setFailed] = useState(false);
    const [saving, startSaving] = useTransition();

    const closed = isClosedStatus(idea.status);
    const dirty = draft.trim() !== (idea.adminResponse ?? '').trim();

    const handleSave = () => {
        setFailed(false);
        startSaving(async () => {
            const ok = await onSaveResponse(draft);
            if (ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                setFailed(true);
            }
        });
    };

    const statusOptions: IdeaStatus[] = [...OPEN_STATUSES, 'descartado'];

    return (
        <>
            {/* Cabecera fija */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
                <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF0E8] px-2 py-0.5 font-bold text-[#C24A00]">
                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                        {idea.votesCount} {idea.votesCount === 1 ? dict.votes_one : dict.votes_other}
                    </span>
                    <span className="truncate">{formatRelative(idea.createdAt, locale)}</span>
                    {isNew && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{dict.new}</span>
                    )}
                </div>
                <DialogClose asChild>
                    <Button variant="ghost" size="icon" aria-label={dict.close} className="-mr-2 shrink-0">
                        <X aria-hidden="true" />
                    </Button>
                </DialogClose>
            </div>

            {/* Contenido desplazable */}
            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 md:px-6">
                <div className="space-y-2">
                    {idea.tag && (
                        <span
                            className="inline-flex rounded-full border border-black/10 px-2 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: idea.tag.color, color: readableTextColor(idea.tag.color) }}
                        >
                            {idea.tag.name}
                        </span>
                    )}
                    <DialogTitle className="font-heading text-xl font-bold leading-snug tracking-tight text-foreground break-words md:text-2xl">
                        {idea.title}
                    </DialogTitle>
                    <DialogDescription asChild>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground md:text-base">
                            {idea.description}
                        </p>
                    </DialogDescription>
                    {idea.imageUrl && (
                        <ImageLightbox
                            src={idea.imageUrl}
                            alt={idea.title}
                            className="mt-3 rounded-lg border border-border"
                            closeLabel={dict.close}
                        />
                    )}
                </div>

                {/* Estado */}
                <section className="space-y-3 border-t border-border pt-5" aria-labelledby="idea-status-label">
                    <h3 id="idea-status-label" className="text-sm font-semibold text-foreground">{dict.status_label}</h3>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="idea-status-label">
                        {statusOptions.map(status => {
                            const active = status === 'descartado' ? closed : idea.status === status;
                            return (
                                <button
                                    key={status}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => {
                                        if (status === 'descartado' && closed) return;
                                        onStatusChange(status);
                                    }}
                                    className={cn(
                                        'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                        active
                                            ? 'border-foreground bg-foreground text-background'
                                            : 'border-border bg-card text-foreground hover:bg-muted'
                                    )}
                                >
                                    <span className={cn('h-2 w-2 rounded-full', STATUS_DOT[status])} aria-hidden="true" />
                                    {statusLabel(status, dict)}
                                </button>
                            );
                        })}
                    </div>
                    {closed && (
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/50 p-3">
                            <div className="space-y-0.5">
                                <label htmlFor="closed-visible" className="text-sm font-medium text-foreground">{dict.closed_visible}</label>
                                <p className="text-xs text-muted-foreground">{dict.closed_visible_desc}</p>
                            </div>
                            <Switch
                                id="closed-visible"
                                checked={idea.status === 'descartado'}
                                onCheckedChange={(visible) => onStatusChange(visible ? 'descartado' : 'archivado')}
                            />
                        </div>
                    )}
                </section>

                {/* Respuesta pública */}
                <section className="space-y-3 border-t border-border pt-5">
                    <div className="space-y-0.5">
                        <label htmlFor="idea-response" className="text-sm font-semibold text-foreground">{dict.response_label}</label>
                        <p className="text-xs text-muted-foreground">{dict.response_hint}</p>
                    </div>
                    <Textarea
                        id="idea-response"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={dict.response_placeholder}
                        maxLength={800}
                        rows={4}
                        className="text-sm leading-relaxed"
                    />
                    <div className="flex items-center gap-3">
                        <Button onClick={handleSave} disabled={saving || !dirty} size="sm">
                            {saving ? dict.saving : idea.adminResponse ? dict.update_response : dict.save_response}
                        </Button>
                        {saved && (
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2F7457]">
                                <Check className="h-4 w-4" aria-hidden="true" /> {dict.saved}
                            </span>
                        )}
                        {failed && <span className="text-sm font-medium text-destructive">{dict.error}</span>}
                    </div>
                </section>
            </div>

            {/* Pie fijo */}
            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 aria-hidden="true" /> {dict.delete}
                </Button>
                {onNext && (
                    <Button variant="outline" size="sm" onClick={onNext}>
                        {dict.next} <ArrowRight aria-hidden="true" />
                    </Button>
                )}
            </div>
        </>
    );
}
