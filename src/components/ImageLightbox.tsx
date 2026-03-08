'use client';

import * as React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ImageLightbox({ src, alt, className }: ImageLightboxProps) {
    if (!src) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={cn("relative cursor-zoom-in group overflow-hidden", className)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
            </DialogTrigger>
            <DialogContent
                className="max-w-none w-screen h-screen border-none bg-transparent p-0 shadow-none focus:outline-none z-[100] flex items-center justify-center overflow-hidden"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogTitle className="sr-only">
                    {alt}
                </DialogTitle>

                <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-200">
                    <DialogClose className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] rounded-full p-3 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-xl outline-none border border-white/10 group">
                        <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
                        <span className="sr-only">Cerrar</span>
                    </DialogClose>

                    <div className="relative w-full h-full flex items-center justify-center select-none" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
