'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import SubmitIdeaForm from './SubmitIdeaForm';
import type { ImageUploadDict } from '@/lib/feedback';

type Tag = { id: string; name: string; color: string; description?: string | null };

export default function MobileSubmitSheet({
    boardId,
    boardSlug,
    formTitle,
    formDesc,
    dict,
    imageDict,
    tags,
    isCurrentUserAdmin = false,
    fabLabel,
}: {
    boardId: string;
    boardSlug: string;
    formTitle: string;
    formDesc: string;
    dict: Record<string, string>;
    imageDict: ImageUploadDict;
    tags?: Tag[];
    isCurrentUserAdmin?: boolean;
    fabLabel: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={fabLabel}
                    className="lg:hidden fixed right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#FF5C00] text-white shadow-[0_12px_30px_rgba(255,92,0,0.45)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]/50 focus-visible:ring-offset-2"
                >
                    <Plus className="w-7 h-7 stroke-[2.5]" aria-hidden="true" />
                </button>
            </DialogTrigger>

            <DialogContent
                className="fixed inset-x-0 bottom-0 left-0 top-auto w-full max-w-none sm:max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-[2rem] sm:rounded-b-none sm:rounded-t-[2rem] border-none gap-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] max-h-[90dvh] overflow-y-auto shadow-2xl data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom data-[state=closed]:zoom-in-100 data-[state=open]:zoom-in-100"
            >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-zinc-200" aria-hidden="true" />
                <div className="mb-4 pr-8">
                    <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 leading-tight">
                        {formTitle}
                    </DialogTitle>
                    <p className="mt-1 text-sm font-medium text-zinc-500">{formDesc}</p>
                </div>

                <DialogClose
                    aria-label={dict.close || 'Close'}
                    className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </DialogClose>

                <SubmitIdeaForm
                    boardId={boardId}
                    boardSlug={boardSlug}
                    dict={dict}
                    imageDict={imageDict}
                    tags={tags}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                />
            </DialogContent>
        </Dialog>
    );
}
