'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Confirmación para acciones destructivas e irreversibles.
export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    pendingLabel,
    cancelLabel,
    pending = false,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel: string;
    pendingLabel: string;
    cancelLabel: string;
    pending?: boolean;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] rounded-xl border border-border bg-card p-6 shadow-pop sm:max-w-sm [&>button:last-child]:hidden">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                    </div>
                    <DialogHeader className="sm:text-center">
                        <DialogTitle className="font-heading text-lg font-bold tracking-tight text-foreground">{title}</DialogTitle>
                        <DialogDescription className="pt-1 text-sm leading-relaxed text-muted-foreground">{description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex w-full flex-col gap-2 pt-2">
                        <Button variant="destructive" onClick={onConfirm} disabled={pending} className="w-full">
                            {pending ? pendingLabel : confirmLabel}
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending} className="w-full">
                            {cancelLabel}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
