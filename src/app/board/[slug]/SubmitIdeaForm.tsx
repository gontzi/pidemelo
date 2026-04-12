'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitIdea } from './actions';
import { ChevronDown, X, Check } from 'lucide-react';
import ImageUploadDropzone from '@/components/ImageUploadDropzone';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Tag = { id: string, name: string, color: string, description?: string | null };

export default function SubmitIdeaForm({
    boardId,
    boardSlug,
    accentColor = "#FF5C00",
    textColor = "#18181b",
    isDarkMode = false,
    dict,
    imageDict,
    tags,
    isCurrentUserAdmin = false,
    widgetVersion = 'normal'
}: {
    boardId: string,
    boardSlug: string,
    accentColor?: string,
    textColor?: string,
    isDarkMode?: boolean,
    dict: any,
    imageDict: any,
    tags?: Tag[],
    isCurrentUserAdmin?: boolean,
    widgetVersion?: 'normal' | 'lite'
}) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);
        setShowError(false);

        if (uploadedImageUrl) {
            formData.append('imageUrl', uploadedImageUrl);
        }

        try {
            const res = await submitIdea(boardId, boardSlug, formData);
            if (res && res.error) {
                setError(res.error);
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
            } else {
                formRef.current?.reset();
                setSelectedTagId(null);
                setUploadedImageUrl(null);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || dict.error_fallback);
            } else {
                setError(dict.error_fallback);
            }
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 relative">
            {/* Full-screen animations (only really show over the widget since widget is an iframe) */}
            {(showSuccess || showError) && (
                <div 
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden" 
                    style={{ 
                        backgroundColor: showSuccess ? accentColor : (isDarkMode ? '#09090b' : '#ffffff')
                    }}
                >
                    {showSuccess && (
                         <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none" />
                    )}
                    {showSuccess ? (
                        <div className="flex flex-col items-center text-center px-6 animate-in slide-in-from-bottom-8 duration-700 ease-out relative z-10 w-full max-w-sm mx-auto">
                            <div className="w-16 h-16 mb-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/30">
                                <Check className="w-8 h-8 text-white stroke-[3] animate-in zoom-in duration-500 delay-150" />
                            </div>
                            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm w-full text-balance">
                                {dict.success_title || '¡Idea recibida!'}
                            </h3>
                            <p className="text-sm md:text-base font-medium text-white/90 max-w-[260px] mx-auto leading-relaxed text-balance">
                                {dict.success_desc || 'Ya está guardada. Ojalá llegue muy lejos.'}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center px-6 animate-in zoom-in-95 duration-500 relative z-10 w-full max-w-sm mx-auto">
                            <div className="w-16 h-16 mb-6 rounded-[2rem] bg-red-100 flex items-center justify-center shadow-sm border border-red-200">
                                <X className="w-8 h-8 text-red-600 stroke-[3]" />
                            </div>
                            <h3 className={`font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-tight mb-2 text-balance ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
                                Ups, algo falló
                            </h3>
                            <p className="text-sm font-medium opacity-80 max-w-[260px] mx-auto text-balance" style={{ color: isDarkMode ? '#a1a1aa' : '#52525b' }}>
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <div>
                <Input
                    name="title"
                    placeholder={dict.title_placeholder}
                    required
                    maxLength={100}
                    style={{ '--tw-ring-color': accentColor, color: isDarkMode ? '#f4f4f5' : '#18181b' } as React.CSSProperties}
                    className={`h-12 md:h-14 shadow-none ${isDarkMode ? 'border-zinc-800 bg-zinc-900 placeholder:text-zinc-600 focus-visible:bg-zinc-800' : 'border-zinc-200 bg-[#FAFAFA] focus-visible:bg-white'} rounded-2xl focus-visible:ring-1 font-medium px-4 text-base transition-colors`}
                />
            </div>
            {tags && tags.length > 0 && (
                <div className="relative z-10" ref={dropdownRef}>
                    <input type="hidden" name="tagId" value={selectedTagId || ''} />
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(p => !p)}
                        style={{
                            borderColor: dropdownOpen ? accentColor : (isDarkMode ? '#27272a' : '#e4e4e7'),
                            color: isDarkMode ? '#f4f4f5' : '#18181b',
                            backgroundColor: isDarkMode ? '#18181b' : '#FAFAFA'
                        }}
                        className="w-full h-12 md:h-14 pl-4 pr-10 rounded-2xl border text-base md:text-sm font-medium focus:outline-none transition-all cursor-pointer shadow-sm flex items-center gap-2 relative"
                    >
                        {selectedTagId ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: tags.find(t => t.id === selectedTagId)?.color }} />
                                {tags.find(t => t.id === selectedTagId)?.name}
                            </span>
                        ) : (
                            <span style={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>{dict.select_tag}</span>
                        )}
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 opacity-50 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 border"
                            style={{
                                backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                                borderColor: isDarkMode ? '#27272a' : '#e4e4e7',
                                boxShadow: isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => { setSelectedTagId(null); setDropdownOpen(false); }}
                                style={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${isDarkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'}`}
                            >
                                {dict.no_tag}
                            </button>
                            <TooltipProvider delayDuration={200}>
                                {tags.map(t => {
                                    const button = (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => { setSelectedTagId(t.id); setDropdownOpen(false); }}
                                            style={{ color: isDarkMode ? '#f4f4f5' : '#18181b' }}
                                            className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'}`}
                                        >
                                            <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: t.color }} />
                                            <span className="truncate">{t.name}</span>
                                        </button>
                                    );

                                    if (!t.description) return button;

                                    return (
                                        <Tooltip key={t.id}>
                                            <TooltipTrigger asChild>
                                                {button}
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                className={`max-w-[200px] text-xs font-medium border shadow-lg z-[60] ml-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600'}`}
                                            >
                                                {t.description}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </TooltipProvider>
                        </div>
                    )}
                </div>
            )}
            <div>
                <textarea
                    name="description"
                    placeholder={dict.desc_placeholder}
                    required
                    maxLength={1000}
                    style={{ '--tw-ring-color': accentColor, color: isDarkMode ? '#f4f4f5' : '#18181b' } as React.CSSProperties}
                    className={`w-full shadow-none border ${isDarkMode ? 'border-zinc-800 bg-zinc-900 placeholder:text-zinc-600 focus-visible:border-zinc-700 focus-visible:bg-zinc-800' : 'border-zinc-200 bg-[#FAFAFA] focus-visible:border-zinc-300 focus-visible:bg-white'} p-4 rounded-2xl min-h-[120px] md:min-h-[140px] outline-none font-medium text-base md:text-sm focus-visible:ring-1 resize-y transition-colors`}
                />
            </div>

            {/* Subida de Imágenes */}
            {!uploadedImageUrl ? (
                <ImageUploadDropzone
                    boardId={boardId}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                    onUploadSuccess={(url) => setUploadedImageUrl(url)}
                    isDarkMode={isDarkMode}
                    dict={imageDict}
                />
            ) : (
                <div className="relative inline-block mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedImageUrl} alt="Imagen subida" className="h-24 w-24 object-cover rounded-xl border-2 border-zinc-200 shadow-sm" />
                    <button
                        type="button"
                        onClick={() => setUploadedImageUrl(null)}
                        className="absolute -top-2 -right-2 bg-zinc-900 text-white rounded-full p-1 shadow-md hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

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
