'use client';

import { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IframeGenerator({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);

    // Usamos window.location.origin para que funcione en cualquier entorno (dev/prod)
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pidemelo.app';
    const iframeCode = `<iframe src="${origin}/widget/${slug}" width="100%" height="600px" frameborder="0"></iframe>`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(iframeCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    return (
        <section className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FF5C00]/5 rounded-full blur-3xl transition-all group-hover:bg-[#FF5C00]/10" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="space-y-4 max-w-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-[#FF5C00]">
                            <Code className="w-5 h-5" />
                        </div>
                        <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FF5C00]">Integración Pro</h2>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tighter text-zinc-900 leading-none">Inserta tu tablón en segundos</h3>
                        <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                            Copia el código mágico y pégalo en tu web. Tus usuarios podrán darte feedback sin salir de tu sitio. ¡Brutal!
                        </p>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-2xl">
                    <div className="bg-zinc-900 rounded-[1.5rem] p-6 shadow-2xl relative group/code">
                        <div className="flex items-center gap-1.5 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                        </div>

                        <div className="font-mono text-[11px] leading-relaxed overflow-x-auto scrollbar-hide py-2">
                            <span className="text-indigo-400">{'<'}</span>
                            <span className="text-pink-400">iframe</span>
                            <span className="text-zinc-400"> src=</span>
                            <span className="text-green-400">"{origin}/widget/{slug}"</span>
                            <br />
                            <span className="text-zinc-400 ml-4"> width=</span>
                            <span className="text-green-400">"100%"</span>
                            <span className="text-zinc-400"> height=</span>
                            <span className="text-green-400">"600px"</span>
                            <br />
                            <span className="text-zinc-400 ml-4"> frameborder=</span>
                            <span className="text-green-400">"0"</span>
                            <span className="text-indigo-400">{'>'}</span>
                            <span className="text-indigo-400">{'</'}</span>
                            <span className="text-pink-400">iframe</span>
                            <span className="text-indigo-400">{'>'}</span>
                        </div>

                        <Button
                            onClick={handleCopy}
                            className={`mt-6 w-full h-12 rounded-xl transition-all font-black text-xs tracking-widest uppercase ${copied
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-white text-zinc-900 hover:bg-[#FF5C00] hover:text-white'
                                }`}
                        >
                            {copied ? (
                                <><Check className="w-4 h-4 mr-2" /> ¡COPIADO AL PORTAPAPELES!</>
                            ) : (
                                <><Copy className="w-4 h-4 mr-2" /> COPIAR CÓDIGO HTML</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
