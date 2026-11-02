'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitIdea } from './actions';
import { ChevronDown, X, Check } from 'lucide-react';
import ImageUploadDropzone from '@/components/ImageUploadDropzone';
import { resolveError, type ImageUploadDict } from '@/lib/feedback';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Tag = { id: string, name: string, color: string, description?: string | null };

// Formulario para enviar ideas. Se usa en el tablero público y en los widgets;
// el color de marca y el modo oscuro llegan por tokens CSS (ver lib/widget-theme).
export default function SubmitIdeaForm({
    boardId,
    boardSlug,
    dict,
    imageDict,
    tags,
    onSubmitted,
}: {
    boardId: string,
    boardSlug: string,
    dict: Record<string, string>,
    imageDict: ImageUploadDict,
    tags?: Tag[],
    onSubmitted?: () => void,
}) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);

        if (uploadedImageUrl) {
            formData.append('imageUrl', uploadedImageUrl);
        }

        try {
            const res = await submitIdea(boardId, boardSlug, formData);
            if (res && res.error) {
                setError(resolveError(res, dict));
            } else {
                formRef.current?.reset();
                setSelectedTagId(null);
                setUploadedImageUrl(null);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onSubmitted?.();
                }, 2500);
            }
        } catch (err: unknown) {
            setError(err instanceof Error && err.message ? err.message : dict.error_fallback);
        } finally {
            setIsPending(false);
        }
    }

    const selectedTag = tags?.find(t => t.id === selectedTagId);

    return (
        <form ref={formRef} action={handleSubmit} className="relative space-y-3">
            {showSuccess && (
                <div
                    role="status"
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-primary px-6 text-center text-primary-foreground animate-in fade-in duration-300"
                >
                    <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-foreground/15">
                        <Check className="h-7 w-7 stroke-[3] animate-in zoom-in duration-500" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold tracking-tight text-balance">{dict.success_title}</h3>
                    <p className="mt-1 max-w-[260px] text-sm font-medium opacity-90 text-balance">{dict.success_desc}</p>
                </div>
            )}

            <Input
                name="title"
                aria-label={dict.title_label}
                placeholder={dict.title_placeholder}
                required
                maxLength={100}
                autoComplete="off"
                enterKeyHint="next"
                className="h-11 text-base md:text-sm"
            />

            {tags && tags.length > 0 && (
                <div className="relative z-10" ref={dropdownRef}>
                    <input type="hidden" name="tagId" value={selectedTagId || ''} />
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(p => !p)}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                        className={cn(
                            'relative flex h-11 w-full items-center gap-2 rounded-lg border bg-card pl-3 pr-10 text-left text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:text-sm',
                            dropdownOpen ? 'border-primary' : 'border-input'
                        )}
                    >
                        {selectedTag ? (
                            <span className="flex items-center gap-2 text-foreground">
                                <span className="h-3 w-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: selectedTag.color }} />
                                {selectedTag.name}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">{dict.select_tag}</span>
                        )}
                        <ChevronDown className={cn('absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')} aria-hidden="true" />
                    </button>

                    {dropdownOpen && (
                        <div role="listbox" className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-pop animate-pop">
                            <button
                                type="button"
                                role="option"
                                aria-selected={!selectedTagId}
                                onClick={() => { setSelectedTagId(null); setDropdownOpen(false); }}
                                className="w-full px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
                            >
                                {dict.no_tag}
                            </button>
                            <TooltipProvider delayDuration={200}>
                                {tags.map(t => {
                                    const button = (
                                        <button
                                            key={t.id}
                                            type="button"
                                            role="option"
                                            aria-selected={selectedTagId === t.id}
                                            onClick={() => { setSelectedTagId(t.id); setDropdownOpen(false); }}
                                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                        >
                                            <span className="h-3 w-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: t.color }} />
                                            <span className="truncate">{t.name}</span>
                                        </button>
                                    );

                                    if (!t.description) return button;

                                    return (
                                        <Tooltip key={t.id}>
                                            <TooltipTrigger asChild>{button}</TooltipTrigger>
                                            <TooltipContent side="right" className="z-[60] ml-2 max-w-[200px] border border-border bg-popover text-xs font-medium text-muted-foreground shadow-pop">
                                                {t.description}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </TooltipProvider>
                        </div>
                    )}
                </div>
            )}

            <Textarea
                name="description"
                aria-label={dict.desc_label}
                placeholder={dict.desc_placeholder}
                required
                maxLength={1000}
                className="min-h-[110px] resize-y text-base md:text-sm"
            />

            {!uploadedImageUrl ? (
                <ImageUploadDropzone
                    boardId={boardId}
                    onUploadSuccess={(url) => setUploadedImageUrl(url)}
                    dict={imageDict}
                />
            ) : (
                <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedImageUrl} alt={dict.image_uploaded_alt} className="h-20 w-20 rounded-lg border border-border object-cover" />
                    <button
                        type="button"
                        onClick={() => setUploadedImageUrl(null)}
                        aria-label={dict.remove_image}
                        className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background shadow-soft transition-opacity hover:opacity-90"
                    >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                </div>
            )}

            {error && (
                <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive">
                    {error}
                </p>
            )}

            <Button disabled={isPending} type="submit" size="lg" className="w-full">
                {isPending ? dict.submitting : dict.submit_btn}
            </Button>
        </form>
    );
}
