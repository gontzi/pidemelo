'use client';

import { useState } from 'react';
import { Copy, Check, Code, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function IframeGenerator({ slug, isPremium }: { slug: string; isPremium: boolean }) {
    const [copied, setCopied] = useState(false);
    const [color, setColor] = useState('#FF5C00');

    // Usamos window.location.origin para que funcione en cualquier entorno (dev/prod)
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pidemelo.app';
    const iframeCode = `<iframe src="${origin}/widget/${slug}?color=${encodeURIComponent(color)}" width="100%" height="600px" frameborder="0"></iframe>`;

    const handleCopy = async () => {
        if (!isPremium) return;
        try {
            await navigator.clipboard.writeText(iframeCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const colorPresets = [
        { name: 'Pídemelo', hex: '#FF5C00' },
        { name: 'Indigo', hex: '#6366f1' },
        { name: 'Emerald', hex: '#10b981' },
        { name: 'Rose', hex: '#f43f5e' },
        { name: 'Purple', hex: '#a855f7' },
        { name: 'Dark', hex: '#18181b' },
    ];

    return (
        <section className={`bg-white p-10 md:p-12 rounded-[2.5rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/20 overflow-hidden relative group transition-all ${!isPremium ? 'grayscale-[0.5]' : ''}`}>
            <div
                className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl transition-all duration-700"
                style={{ backgroundColor: `${color}10` }}
            />

            {/* Overlay para No-Premium */}
            {!isPremium && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                    <div className="bg-zinc-900 p-8 rounded-[2rem] shadow-2xl text-center space-y-6 max-w-sm animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg shadow-orange-500/30">
                            <Lock className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-white italic">Función Premium</h4>
                            <p className="text-zinc-400 text-sm font-medium">
                                Personaliza el color de tu widget y úsalo en tu web. Exclusivo para suscriptores.
                            </p>
                        </div>
                        <Link href="/dashboard/billing">
                            <Button className="w-full bg-[#FF5C00] hover:bg-white hover:text-zinc-900 text-white font-black text-xs tracking-widest uppercase h-12 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                                SUBIR DE NIVEL 🚀
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            <div className={`relative z-10 flex flex-col xl:flex-row gap-12 transition-all ${!isPremium ? 'blur-[2px] pointer-events-none' : ''}`}>
                <div className="space-y-10 max-w-xl">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-[#FF5C00]" style={{ backgroundColor: `${color}15`, color: color }}>
                                <Code className="w-5 h-5" />
                            </div>
                            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black" style={{ color: color }}>Personalización Pro</h2>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black tracking-tighter text-zinc-900 leading-none">Tu widget, tus colores</h3>
                            <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                                Elige el color que mejor le siente a tu marca. Los botones y detalles del widget se adaptarán mágicamente.
                            </p>
                        </div>
                    </div>

                    {/* Selector de Color */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-3">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.hex}
                                    onClick={() => setColor(preset.hex)}
                                    className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 active:scale-90 ${color === preset.hex ? 'border-zinc-900 shadow-lg' : 'border-transparent'}`}
                                    style={{ backgroundColor: preset.hex }}
                                    title={preset.name}
                                />
                            ))}
                            <div className="relative group/picker">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-10 h-10 rounded-xl border-2 border-transparent cursor-pointer bg-white overflow-hidden shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-100 w-fit">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Hex</span>
                            <input
                                type="text"
                                value={color.toUpperCase()}
                                onChange={(e) => setColor(e.target.value)}
                                className="bg-transparent text-sm font-bold text-zinc-900 outline-none w-20"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-2xl">
                    <div className="bg-zinc-900 rounded-[2rem] p-8 shadow-2xl relative group/code overflow-hidden border border-zinc-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-green-500/40" />
                            </div>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">index.html</span>
                        </div>

                        <div className="font-mono text-[12px] leading-relaxed overflow-x-auto scrollbar-hide py-4 border-y border-zinc-800/50 mb-6">
                            <span className="text-zinc-600">{'<!-- '}</span>
                            <span className="text-zinc-600">Incrusta este código en tu web</span>
                            <span className="text-zinc-600">{' -->'}</span>
                            <br />
                            <span className="text-indigo-400">{'<'}</span>
                            <span className="text-pink-400">iframe</span>
                            <br />
                            <span className="text-zinc-400 ml-6 truncate"> src=</span>
                            <span className="text-green-400">"{origin}/widget/{slug}?color=<span className="bg-zinc-800 px-1 rounded text-white">{encodeURIComponent(color)}</span>"</span>
                            <br />
                            <span className="text-zinc-400 ml-6"> width=</span>
                            <span className="text-green-400">"100%"</span>
                            <br />
                            <span className="text-zinc-400 ml-6"> height=</span>
                            <span className="text-green-400">"600px"</span>
                            <br />
                            <span className="text-zinc-400 ml-6"> frameborder=</span>
                            <span className="text-green-400">"0"</span>
                            <br />
                            <span className="text-indigo-400">{'/>'}</span>
                        </div>

                        <Button
                            onClick={handleCopy}
                            disabled={!isPremium}
                            style={{ backgroundColor: color }}
                            className={`w-full h-14 rounded-2xl transition-all font-black text-xs tracking-widest uppercase hover:opacity-90 shadow-2xl active:scale-95 text-white shadow-zinc-950/20`}
                        >
                            {copied ? (
                                <><Check className="w-5 h-5 mr-3" /> ¡COPIADO AL PORTAPAPELES!</>
                            ) : (
                                <><Copy className="w-5 h-5 mr-3" /> COPIAR CÓDIGO HTML</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
