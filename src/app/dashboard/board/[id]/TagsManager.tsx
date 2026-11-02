'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Pencil, Check } from 'lucide-react';
import { cn, readableTextColor } from '@/lib/utils';
import type { Dictionary } from '@/i18n/types';
import { createTag, deleteTag, updateTag } from './actions';

type Tag = {
    id: string;
    name: string;
    color: string;
    description?: string | null;
};

const COLOR_PRESETS = ['#FF5C00', '#EA655F', '#65AD8C', '#F5C35B', '#8051D9', '#151B35', '#E4E5E8'];
const DEFAULT_COLOR = COLOR_PRESETS[0];

export default function TagsManager({
    boardId,
    tags,
    dict,
    errors,
}: {
    boardId: string;
    tags: Tag[];
    dict: Dictionary['board_settings'];
    errors: Dictionary['errors'];
}) {
    const [name, setName] = useState('');
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const reset = () => {
        setEditingId(null);
        setName('');
        setColor(DEFAULT_COLOR);
        setDescription('');
        setError(null);
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        setError(null);
        startTransition(async () => {
            const res = editingId
                ? await updateTag(editingId, boardId, name.trim(), color, description.trim() || null)
                : await createTag(boardId, name.trim(), color, description.trim() || null);
            if (res?.error) {
                setError((errors as Record<string, string>)[res.error] ?? errors.generic);
            } else {
                reset();
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
            }
        });
    };

    const handleEdit = (tag: Tag) => {
        setEditingId(tag.id);
        setName(tag.name);
        setColor(tag.color);
        setDescription(tag.description || '');
        setError(null);
    };

    const handleDelete = (tagId: string) => {
        startTransition(async () => {
            await deleteTag(tagId, boardId);
            if (editingId === tagId) reset();
        });
    };

    return (
        <div className="space-y-5">
            {tags.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                    {dict.no_tags}
                </p>
            ) : (
                <ul className="divide-y divide-border rounded-lg border border-border">
                    {tags.map(tag => (
                        <li key={tag.id} className={cn('flex items-center justify-between gap-3 px-3 py-2', editingId === tag.id && 'bg-muted/50')}>
                            <div className="min-w-0 space-y-0.5">
                                <span
                                    className="inline-flex rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-bold"
                                    style={{ backgroundColor: tag.color, color: readableTextColor(tag.color) }}
                                >
                                    {tag.name}
                                </span>
                                {tag.description && <p className="truncate text-xs text-muted-foreground">{tag.description}</p>}
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(tag)}
                                    disabled={isPending}
                                    aria-label={`${dict.edit_tag}: ${tag.name}`}
                                    className="h-9 w-9 text-muted-foreground"
                                >
                                    <Pencil aria-hidden="true" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(tag.id)}
                                    disabled={isPending}
                                    aria-label={`${dict.delete_tag}: ${tag.name}`}
                                    className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 aria-hidden="true" />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-3 md:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="tag-name">{dict.new_tag_name}</Label>
                        <Input
                            id="tag-name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder={dict.new_tag_ph}
                            maxLength={30}
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tag-desc">{dict.tag_desc}</Label>
                        <Input
                            id="tag-desc"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={100}
                            placeholder={dict.tag_desc_ph}
                            disabled={isPending}
                        />
                    </div>
                </div>

                <fieldset className="space-y-1.5">
                    <legend className="text-sm font-medium text-foreground">{dict.color}</legend>
                    <div className="flex flex-wrap items-center gap-2">
                        {COLOR_PRESETS.map(preset => (
                            <button
                                key={preset}
                                type="button"
                                disabled={isPending}
                                onClick={() => setColor(preset)}
                                aria-label={preset}
                                aria-pressed={color === preset}
                                className={cn(
                                    'grid h-8 w-8 place-items-center rounded-full border border-black/10 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
                                    color === preset && 'ring-2 ring-foreground ring-offset-2'
                                )}
                                style={{ backgroundColor: preset }}
                            >
                                {color === preset && <Check className="h-3.5 w-3.5" style={{ color: readableTextColor(preset) }} aria-hidden="true" />}
                            </button>
                        ))}
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            disabled={isPending}
                            aria-label={dict.color}
                            className="h-8 w-8 cursor-pointer rounded-full border border-border bg-card p-0"
                        />
                        {name.trim() && (
                            <span
                                className="ml-auto inline-flex rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-bold"
                                style={{ backgroundColor: color, color: readableTextColor(color) }}
                            >
                                {name.trim()}
                            </span>
                        )}
                    </div>
                </fieldset>

                {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

                <div className="flex items-center gap-2">
                    <Button type="button" onClick={handleSubmit} disabled={isPending || !name.trim()}>
                        {!editingId && <Plus aria-hidden="true" />}
                        {editingId ? dict.save_tag : dict.add_tag}
                    </Button>
                    {editingId && (
                        <Button type="button" variant="ghost" onClick={reset} disabled={isPending}>
                            {dict.cancel}
                        </Button>
                    )}
                    {saved && (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2F7457]">
                            <Check className="h-4 w-4" aria-hidden="true" /> {dict.saved}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
