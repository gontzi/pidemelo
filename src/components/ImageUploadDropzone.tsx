'use client';

import { useState, useRef } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadImageAction } from '@/app/board/[slug]/uploadAction';
import { resolveUploadError, type ImageUploadDict } from '@/lib/feedback';

interface ImageUploadProps {
    boardId: string;
    onUploadSuccess: (url: string) => void;
    dict: ImageUploadDict;
}

export default function ImageUploadDropzone({
    boardId,
    onUploadSuccess,
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
        <div className="w-full">
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
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-card px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.98] disabled:opacity-70"
            >
                {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                )}
                {isUploading ? dict.uploading : dict.attach}
            </button>

            {error && (
                <p role="alert" className="mt-2 text-center text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}
