'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Lock, Pencil } from 'lucide-react';
import { createTag, deleteTag, updateTag } from './actions';
import Link from 'next/link';

type Tag = {
    id: string;
    name: string;
    color: string;
    description?: string | null;
};

export default function TagsManager({
    boardId,
    tags,
    dict
}: {
    boardId: string;
    tags: Tag[];
    dict: Record<string, string>;
}) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#FF5C00');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);



    const handleSubmit = () => {
        if (!name.trim()) return;
        setError(null);
        startTransition(async () => {
            let res;
            if (editingId) {
                res = await updateTag(editingId, boardId, name, color, description);
            } else {
                res = await createTag(boardId, name, color, description);
            }
            if (res?.error) {
                setError(res.error);
            } else {
                setName('');
                setDescription('');
                setColor('#FF5C00');
                setEditingId(null);
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

    const handleCancelEdit = () => {
        setEditingId(null);
        setName('');
        setColor('#FF5C00');
        setDescription('');
        setError(null);
    };

    const handleDelete = (tagId: string) => {
        startTransition(async () => {
            await deleteTag(tagId, boardId);
        });
    };

    const colorPresets = [
        '#FF5C00', '#6366f1', '#10b981', '#f43f5e', '#a855f7', '#18181b', '#0ea5e9', '#eab308'
    ];

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg md:text-xl text-zinc-900 tracking-tight">{dict.tags_title}</h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                        ∞
                    </span>
                </div>
                <p className="text-xs md:text-sm font-medium text-zinc-500">{dict.tags_desc}</p>
            </div>

            <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] p-4 flex flex-col gap-3 overflow-y-auto max-h-[250px] shadow-inner">
                {tags.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 gap-2 min-h-[100px]">
                        <span className="text-xs font-bold uppercase tracking-widest">{dict.no_tags}</span>
                    </div>
                ) : (
                    tags.map(tag => (
                        <div key={tag.id} className="flex flex-col gap-2 bg-white px-4 py-3 rounded-xl border border-zinc-100 shadow-sm transition-all hover:border-zinc-200">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: tag.color }} />
                                    <span className="font-bold text-sm text-zinc-900">{tag.name}</span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(tag)}
                                        disabled={isPending || editingId === tag.id}
                                        className="text-zinc-300 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tag.id)}
                                        disabled={isPending}
                                        className="text-zinc-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {tag.description && (
                                <p className="text-xs text-zinc-500 pl-7">{tag.description}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="relative mt-auto pt-4 border-t border-zinc-100">
                <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="space-y-1.5 flex-1">
                            <Label htmlFor="tag-name" className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">{dict.new_tag_name}</Label>
                            <Input
                                id="tag-name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder={dict.new_tag_ph}
                                disabled={isPending}
                                className="h-12 rounded-xl shadow-none border-zinc-200 bg-white focus-visible:ring-[#FF5C00] font-medium px-4 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="tag-desc" className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">{dict.tag_desc || 'Descripción (Opcional)'}</Label>
                            <Input
                                id="tag-desc"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                maxLength={100}
                                placeholder={dict.tag_desc_ph}
                                disabled={isPending}
                                className="h-10 rounded-xl shadow-none border-zinc-200 bg-white focus-visible:ring-[#FF5C00] text-xs px-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">{dict.color}</Label>
                            <div className="flex flex-wrap gap-2">
                                {colorPresets.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => setColor(preset)}
                                        className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 active:scale-90 ${color === preset ? 'border-zinc-900 shadow-sm' : 'border-transparent'}`}
                                        style={{ backgroundColor: preset }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    disabled={isPending}
                                    className="w-8 h-8 rounded-lg border-2 border-transparent cursor-pointer bg-white overflow-hidden shadow-inner flex-shrink-0 p-0"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-[10px] text-red-500 font-medium">{(dict as any).errors?.[error] || error}</p>}

                    <div className="flex gap-2">
                        {editingId && (
                            <Button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isPending}
                                variant="outline"
                                className="w-1/3 h-12 rounded-xl text-zinc-600 font-medium transition-all active:scale-95 text-xs shadow-sm bg-white"
                            >
                                {dict.cancel}
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending || !name.trim()}
                            className={`${editingId ? 'w-2/3' : 'w-full'} h-12 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md`}
                        >
                            {!editingId && <Plus className="w-4 h-4" />}
                            {editingId ? dict.save : dict.add_tag}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
