'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Code, Lock, Monitor, Smartphone, Layout, Palette, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Board = {
    id: string;
    name: string;
    slug: string;
};

export default function WidgetsClient({
    boards,
    isPremium
}: {
    boards: Board[];
    isPremium: boolean
}) {
    const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || '');
    const [accentColor, setAccentColor] = useState('#FF5C00');
    const [textColor, setTextColor] = useState('#18181b');
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    const selectedBoard = useMemo(() =>
        boards.find(b => b.id === selectedBoardId),
        [selectedBoardId, boards]);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pidemelo.app';
    const widgetUrl = useMemo(() =>
        `${origin}/widget/${selectedBoard?.slug}?color=${encodeURIComponent(accentColor)}&textColor=${encodeURIComponent(textColor)}`,
        [origin, selectedBoard, accentColor, textColor]);

    const iframeCode = useMemo(() =>
        `<iframe src="${widgetUrl}" width="100%" height="600px" frameborder="0"></iframe>`,
        [widgetUrl]);

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
        { name: 'Ocean', hex: '#0ea5e9' },
    ];

    const textPresets = [
        { name: 'Zinc Deep', hex: '#18181b' },
        { name: 'Slate Gray', hex: '#334155' },
        { name: 'Cool Blue', hex: '#1e293b' },
        { name: 'Black Out', hex: '#000000' },
    ];

    if (boards.length === 0) {
        return (
            <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border border-zinc-200/60 shadow-xl shadow-zinc-200/10">
                <span className="text-6xl mb-6">🔌</span>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">Sin tableros activos</h3>
                <p className="text-zinc-500 font-bold mt-2 max-w-xs">Necesitas crear al menos un tablero para empezar a usar widgets.</p>
                <Link href="/dashboard" className="mt-8">
                    <Button className="bg-[#FF5C00] text-white hover:bg-[#E65300] font-black text-xs tracking-widest uppercase h-14 rounded-full px-10 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20">
                        CREAR TABLERO 🚀
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* PANEL DE CONFIGURACIÓN (IZQUIERDA) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8">

                {/* 1. SELECCIÓN DE TABLERO */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/60 shadow-lg shadow-zinc-200/10 space-y-6 relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-700">
                            <Monitor className="w-4 h-4" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Paso 1: ¿Cuál usamos?</h3>
                    </div>

                    <div className="grid gap-2">
                        {boards.map(board => (
                            <button
                                key={board.id}
                                onClick={() => setSelectedBoardId(board.id)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${selectedBoardId === board.id
                                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                                        : 'bg-zinc-50 border-zinc-100 text-zinc-600 hover:bg-white hover:border-zinc-300'
                                    }`}
                            >
                                <Layout className={`w-4 h-4 ${selectedBoardId === board.id ? 'text-orange-500' : 'text-zinc-400'}`} />
                                <span className="text-sm font-black truncate">{board.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. PERSONALIZACIÓN */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/60 shadow-lg shadow-zinc-200/10 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-700">
                            <Palette className="w-4 h-4" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Paso 2: A tu gusto</h3>
                    </div>

                    <div className="space-y-8">
                        {/* Acento */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-900 ml-1">Color Principal</label>
                            <div className="flex flex-wrap gap-2.5">
                                {colorPresets.map((preset) => (
                                    <button
                                        key={preset.hex}
                                        onClick={() => setAccentColor(preset.hex)}
                                        className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 active:scale-90 ${accentColor === preset.hex ? 'border-zinc-900 shadow-xl' : 'border-transparent'}`}
                                        style={{ backgroundColor: preset.hex }}
                                        title={preset.name}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="w-10 h-10 rounded-xl border-2 border-transparent cursor-pointer bg-white overflow-hidden shadow-inner flex-shrink-0"
                                />
                            </div>
                        </div>

                        {/* Texto */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-900 ml-1">Color de Texto</label>
                            <div className="flex flex-wrap gap-2.5">
                                {textPresets.map((preset) => (
                                    <button
                                        key={preset.hex}
                                        onClick={() => setTextColor(preset.hex)}
                                        className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 active:scale-90 ${textColor === preset.hex ? 'border-zinc-900 shadow-xl' : 'border-transparent'}`}
                                        style={{ backgroundColor: preset.hex }}
                                        title={preset.name}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="w-10 h-10 rounded-xl border-2 border-transparent cursor-pointer bg-white overflow-hidden shadow-inner flex-shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. CÓDIGO */}
                <section className="bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Code className="w-12 h-12 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Paso 3: Copia y pega</h4>
                        <p className="text-white font-black text-xl tracking-tighter">Listo para producción</p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-2xl font-mono text-[11px] leading-relaxed text-zinc-400 border border-zinc-800">
                        <span className="text-zinc-600">{'<!-- Integrar Pídemelo -->'}</span><br />
                        <span className="text-indigo-400">{'<'}</span>
                        <span className="text-pink-400">iframe</span><br />
                        <span className="text-zinc-400 ml-4">src=</span>
                        <span className="text-emerald-400">"{origin}/widget/{selectedBoard?.slug}?..."</span><br />
                        <span className="text-zinc-400 ml-4">width=</span><span className="text-emerald-400">"100%"</span><br />
                        <span className="text-zinc-400 ml-4">height=</span><span className="text-emerald-400">"600px"</span><br />
                        <span className="text-indigo-400">{'/>'}</span>
                    </div>

                    <Button
                        onClick={handleCopy}
                        disabled={!isPremium}
                        style={{ backgroundColor: accentColor }}
                        className={`w-full h-14 rounded-2xl transition-all font-black text-xs tracking-widest uppercase hover:opacity-90 shadow-2xl active:scale-95 text-white`}
                    >
                        {copied ? (
                            <><Check className="w-5 h-5 mr-3" /> ¡PUESTO EN EL PANEL!</>
                        ) : (
                            <><Copy className="w-5 h-5 mr-3" /> COPIAR CÓDIGO HTML</>
                        )}
                    </Button>
                </section>
            </div>

            {/* PREVIEW EN TIEMPO REAL (DERECHA) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                <div className="bg-white rounded-[3rem] p-4 flex flex-col h-[800px] border border-zinc-200/60 shadow-xl shadow-zinc-200/10 overflow-hidden relative group">

                    {/* Header de la Preview */}
                    <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2.2rem] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-zinc-400 shadow-sm">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-zinc-900">Previsualización</h4>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live Experience</p>
                            </div>
                        </div>

                        <div className="flex bg-zinc-200/50 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'desktop' ? 'bg-white text-zinc-900 shadow-xl' : 'text-zinc-500 hover:text-zinc-800'
                                    }`}
                            >
                                <Monitor className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'mobile' ? 'bg-white text-zinc-900 shadow-xl' : 'text-zinc-500 hover:text-zinc-800'
                                    }`}
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Frame Container */}
                    <div className="flex-1 rounded-[2.5rem] bg-zinc-100/50 border border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative">

                        {!isPremium && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[4px]">
                                <div className="bg-zinc-900 p-10 rounded-[3rem] shadow-2xl text-center space-y-6 max-w-sm animate-in fade-in zoom-in duration-300 mx-6">
                                    <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl shadow-orange-500/30">
                                        <Lock className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-white italic tracking-tighter">Acceso Pro</h4>
                                        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                            La previsualización y el código incrustable son exclusivos para suscriptores e inversores.
                                        </p>
                                    </div>
                                    <Link href="/dashboard/billing" className="block pt-2">
                                        <Button className="w-full bg-[#FF5C00] hover:bg-white hover:text-zinc-900 text-white font-black text-xs tracking-widest uppercase h-14 rounded-2xl transition-all shadow-xl shadow-orange-500/20">
                                            SUBIR DE NIVEL 🚀
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className={`transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] bg-white shadow-2xl shadow-black/5 ${viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[3rem]' : 'w-full h-full'
                            } overflow-hidden border border-zinc-200/50`}>
                            {isPremium ? (
                                <iframe
                                    src={widgetUrl}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    key={widgetUrl} // Force reload on change
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-50 flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale">
                                    <h4 className="text-2xl font-black text-zinc-900 mb-2">{selectedBoard?.name}</h4>
                                    <p className="text-zinc-400 font-bold text-sm italic">Simulando entorno de feedback...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
