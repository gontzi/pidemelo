'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitIdea } from './actions';

export default function SubmitIdeaForm({
    boardId,
    boardSlug,
    accentColor = "#FF5C00",
    textColor = "#18181b",
    isDarkMode = false,
    dict
}: {
    boardId: string,
    boardSlug: string,
    accentColor?: string,
    textColor?: string,
    isDarkMode?: boolean,
    dict: Record<string, string>
}) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);

        try {
            const res = await submitIdea(boardId, boardSlug, formData);
            if (res && res.error) {
                setError(res.error);
            } else {
                formRef.current?.reset();
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || dict.error_fallback);
            } else {
                setError(dict.error_fallback);
            }
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div>
                <Input
                    name="title"
                    placeholder={dict.title_placeholder}
                    required
                    maxLength={100}
                    style={{ '--tw-ring-color': accentColor, color: isDarkMode ? '#f4f4f5' : textColor } as React.CSSProperties}
                    className={`h-12 md:h-14 shadow-none ${isDarkMode ? 'border-zinc-800 bg-zinc-900 placeholder:text-zinc-600 focus-visible:bg-zinc-800' : 'border-zinc-200 bg-[#FAFAFA] focus-visible:bg-white'} rounded-2xl focus-visible:ring-1 font-medium px-4 text-base transition-colors`}
                />
            </div>
            <div>
                <textarea
                    name="description"
                    placeholder={dict.desc_placeholder}
                    required
                    maxLength={1000}
                    style={{ '--tw-ring-color': accentColor, color: isDarkMode ? '#f4f4f5' : textColor } as React.CSSProperties}
                    className={`w-full shadow-none border ${isDarkMode ? 'border-zinc-800 bg-zinc-900 placeholder:text-zinc-600 focus-visible:border-zinc-700 focus-visible:bg-zinc-800' : 'border-zinc-200 bg-[#FAFAFA] focus-visible:border-zinc-300 focus-visible:bg-white'} p-4 rounded-2xl min-h-[120px] md:min-h-[140px] outline-none font-medium text-base md:text-sm focus-visible:ring-1 resize-y transition-colors`}
                />
            </div>
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-[10px] md:text-sm font-bold rounded-xl border border-red-100 text-center uppercase tracking-widest">
                    {error}
                </div>
            )}
            <Button
                disabled={isPending}
                type="submit"
                style={{ color: textColor, backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}33` }}
                className="w-full h-12 md:h-14 text-white hover:opacity-90 rounded-full font-black tracking-widest uppercase transition-all active:scale-95 text-xs md:text-sm disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
            >
                {isPending ? dict.submitting : dict.submit_btn}
            </Button>
        </form>
    );
}
