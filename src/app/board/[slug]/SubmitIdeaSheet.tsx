'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogClose, DialogDescription, DialogTitle, DialogTrigger, SheetContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ImageUploadDict } from '@/lib/feedback';
import SubmitIdeaForm from './SubmitIdeaForm';

type Tag = { id: string; name: string; color: string; description?: string | null };

// Formulario de envío en hoja (inferior en móvil, lateral en escritorio).
// `fab`: botón flotante para el tablero público en móvil.
// `inline`: botón normal, p. ej. en la cabecera del widget de tablero.
export default function SubmitIdeaSheet({
    boardId,
    boardSlug,
    formTitle,
    formDesc,
    dict,
    imageDict,
    tags,
    triggerLabel,
    variant = 'fab',
}: {
    boardId: string;
    boardSlug: string;
    formTitle: string;
    formDesc: string;
    dict: Record<string, string>;
    imageDict: ImageUploadDict;
    tags?: Tag[];
    triggerLabel: string;
    variant?: 'fab' | 'inline';
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === 'fab' ? (
                    <button
                        type="button"
                        aria-label={triggerLabel}
                        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-brand transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 active:scale-95 lg:hidden"
                    >
                        <Plus className="h-7 w-7 stroke-[2.5]" aria-hidden="true" />
                    </button>
                ) : (
                    <Button size="sm" className="shrink-0">
                        <Plus aria-hidden="true" /> {triggerLabel}
                    </Button>
                )}
            </DialogTrigger>

            <SheetContent className="md:max-w-md">
                <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
                    <div className="min-w-0">
                        <DialogTitle className="font-heading text-lg font-bold tracking-tight text-foreground">{formTitle}</DialogTitle>
                        <DialogDescription className="mt-0.5 text-sm text-muted-foreground">{formDesc}</DialogDescription>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" aria-label={dict.close} className="-mr-2 shrink-0">
                            <X aria-hidden="true" />
                        </Button>
                    </DialogClose>
                </div>
                <div className="overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6">
                    <SubmitIdeaForm
                        boardId={boardId}
                        boardSlug={boardSlug}
                        dict={dict}
                        imageDict={imageDict}
                        tags={tags}
                        onSubmitted={() => setOpen(false)}
                    />
                </div>
            </SheetContent>
        </Dialog>
    );
}
