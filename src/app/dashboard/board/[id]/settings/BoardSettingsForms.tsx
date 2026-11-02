'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { Dictionary } from '@/i18n/types';
import { updateBoardSettings, deleteBoard, updateBoardNotificationPreference } from '../actions';

type SettingsDict = Dictionary['board_settings'];
type ErrorsDict = Dictionary['errors'];

function errorMessage(code: string, errors: ErrorsDict): string {
    return (errors as Record<string, string>)[code] ?? errors.generic;
}

export function GeneralSettingsForm({
    boardId,
    name,
    slug,
    dict,
    errors,
}: {
    boardId: string;
    name: string;
    slug: string;
    dict: SettingsDict;
    errors: ErrorsDict;
}) {
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [pending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const res = await updateBoardSettings(boardId, String(formData.get('name') ?? '').trim(), String(formData.get('slug') ?? ''));
            if (res?.error) {
                setError(errorMessage(res.error, errors));
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="board-name">{dict.name}</Label>
                <Input id="board-name" name="name" defaultValue={name} required maxLength={80} />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="board-slug">{dict.slug}</Label>
                <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                        /board/
                    </span>
                    <Input id="board-slug" name="slug" defaultValue={slug} required className="rounded-l-none" aria-describedby="board-slug-hint" />
                </div>
                <p id="board-slug-hint" className="text-xs text-muted-foreground">{dict.slug_hint}</p>
            </div>
            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
            <div className="flex items-center gap-3">
                <Button type="submit" disabled={pending}>
                    {pending ? dict.saving : dict.save}
                </Button>
                {saved && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2F7457]">
                        <Check className="h-4 w-4" aria-hidden="true" /> {dict.saved}
                    </span>
                )}
            </div>
        </form>
    );
}

export function NotifyToggle({
    boardId,
    initial,
    dict,
}: {
    boardId: string;
    initial: boolean;
    dict: SettingsDict;
}) {
    const [notify, setNotify] = useState(initial);
    const [pending, startTransition] = useTransition();

    const handleChange = (checked: boolean) => {
        setNotify(checked);
        startTransition(async () => {
            const res = await updateBoardNotificationPreference(boardId, checked);
            if (res?.error) setNotify(!checked);
        });
    };

    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
                <Label htmlFor="board-notify">{dict.notify_email}</Label>
                <p className="text-sm text-muted-foreground">{dict.notify_desc}</p>
            </div>
            <Switch id="board-notify" checked={notify} onCheckedChange={handleChange} disabled={pending} />
        </div>
    );
}

export function DangerZone({ boardId, dict }: { boardId: string; dict: SettingsDict }) {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteBoard(boardId);
            if (res.success) router.push('/dashboard');
        });
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{dict.delete_board}</p>
                <p className="text-sm text-muted-foreground">{dict.delete_warning}</p>
            </div>
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
                className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
                {dict.delete_board}
            </Button>
            <ConfirmDialog
                open={open}
                onOpenChange={setOpen}
                title={dict.delete_confirm_title}
                description={dict.delete_confirm_desc}
                confirmLabel={dict.yes_delete}
                pendingLabel={dict.deleting}
                cancelLabel={dict.changed_my_mind}
                pending={pending}
                onConfirm={handleDelete}
            />
        </div>
    );
}
