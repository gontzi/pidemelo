'use client';

import { useState, useRef } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadImageAction } from '@/app/board/[slug]/uploadAction';
import { resolveUploadError, type ImageUploadDict } from '@/lib/feedback';

interface ImageUploadProps {
    boardId: string;
    isCurrentUserAdmin?: boolean;
    widgetVersion?: 'normal' | 'lite';
    onUploadSuccess: (url: string) => void;
    isDarkMode?: boolean;
    dict: ImageUploadDict;
}

export default function ImageUploadDropzone({
    boardId,
    onUploadSuccess,
    isDarkMode = false,
    dict
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            setError(dict.error_size);
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
                setError(resolveUploadError(result.error, dict));
            } else if (result.url) {
                onUploadSuccess(result.url);
            }
        } catch {
            setError(dict.error_connection);
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
                    {isUploading ? dict.uploading : dict.attach}
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
