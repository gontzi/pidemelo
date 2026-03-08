'use client';

import { useState, useRef } from 'react';
import { ImagePlus, Loader2, Lock } from 'lucide-react';
import { uploadImageAction } from '@/app/board/[slug]/uploadAction';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ImageUploadProps {
    boardId: string;
    isBoardPremium: boolean;
    isCurrentUserAdmin: boolean;
    onUploadSuccess: (url: string) => void;
    isDarkMode?: boolean;
}

export default function ImageUploadDropzone({
    boardId,
    isBoardPremium,
    isCurrentUserAdmin,
    onUploadSuccess,
    isDarkMode = false
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Si NO es premium, mostramos la zona deshabilitada con un Popover persuasivo
    if (!isBoardPremium) {
        return (
            <div className="w-full mb-4">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            onMouseEnter={() => setIsPopoverOpen(true)}
                            onMouseLeave={() => setIsPopoverOpen(false)}
                            className={`w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 opacity-50 cursor-not-allowed transition-all outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-500' : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 text-zinc-400'}`}
                        >
                            <ImagePlus className="w-5 h-5" />
                            <span className="text-sm font-medium text-left">
                                Adjuntar imagen (Solo Pro)
                            </span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        align="center"
                        className="w-72 p-4 rounded-2xl shadow-xl border-zinc-200 animate-in fade-in zoom-in-95 duration-200 z-[100]"
                        onMouseEnter={() => setIsPopoverOpen(true)}
                        onMouseLeave={() => setIsPopoverOpen(false)}
                    >
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-[#FF5C00]" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-zinc-900 leading-tight">Función Pro / Lifetime</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    El dueño de este tablero no dispone de un plan premium activo para permitir el envío de imágenes.
                                </p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }

    // Tablero Premium -> Subida funcional
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            setError("La imagen pesa más de 1MB.");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('boardId', boardId);

        try {
            const result = await uploadImageAction(formData);

            if (result.error) {
                setError(result.error);
            } else if (result.url) {
                onUploadSuccess(result.url);
            }
        } catch (err) {
            setError("Fallo en la conexión al servidor.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full mb-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp, image/jpg"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50 active:scale-[0.98] ${isDarkMode ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400' : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-600'}`}
            >
                {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <ImagePlus className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                    {isUploading ? "Subiendo imagen..." : "Adjuntar imagen o captura (máx 1MB)"}
                </span>
            </button>

            {error && (
                <p className="mt-2 text-xs font-semibold text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}
