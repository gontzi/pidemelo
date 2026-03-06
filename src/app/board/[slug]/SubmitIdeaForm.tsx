'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitIdea } from './actions';

export default function SubmitIdeaForm({
    boardId,
    boardSlug,
    accentColor = "#FF5C00"
}: {
    boardId: string,
    boardSlug: string,
    accentColor?: string
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
                setError(err.message || "Algo salió mal");
            } else {
                setError("Algo salió mal");
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
                    placeholder="Ej. Poner un botón que me dé café gratis..."
                    required
                    maxLength={100}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                    className="h-14 shadow-none border-zinc-200 bg-[#FAFAFA] rounded-2xl focus-visible:ring-1 focus-visible:bg-white font-medium px-4"
                />
            </div>
            <div>
                <textarea
                    name="description"
                    placeholder="Cuéntame tu drama, a ver si podemos hacer algo..."
                    required
                    maxLength={1000}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                    className="w-full shadow-none border border-zinc-200 bg-[#FAFAFA] p-4 rounded-2xl min-h-[140px] outline-none font-medium text-sm focus-visible:ring-1 focus-visible:border-zinc-300 focus-visible:bg-white text-zinc-900 resize-y"
                />
            </div>
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 text-center">
                    {error}
                </div>
            )}
            <Button
                disabled={isPending}
                type="submit"
                style={{ backgroundColor: accentColor, boxShadow: `0 4px 6px -1px ${accentColor}33, 0 2px 4px -1px ${accentColor}1A` }}
                className="w-full h-14 text-white hover:opacity-90 rounded-full font-bold transition-transform active:scale-95 text-lg disabled:opacity-70 disabled:hover:scale-100 shadow-md"
            >
                {isPending ? 'Mandándolo a la nube...' : 'Soltar mi idea 💣'}
            </Button>
        </form>
    );
}
