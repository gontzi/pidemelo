'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Code, Lock, Monitor, Smartphone, Layout, Palette, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import WidgetSkeleton from '@/components/WidgetSkeleton';

type Board = {
    id: string;
    name: string;
    slug: string;
};

export default function WidgetsClient({
    boards,
    dict
}: {
    boards: Board[];
    dict: Record<string, string>;
}) {
    const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || '');
    const [accentColor, setAccentColor] = useState('#FF5C00');
    const [textColor, setTextColor] = useState('#18181b');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [widgetType, setWidgetType] = useState<'form' | 'board'>('form');
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [widgetVersion, setWidgetVersion] = useState<'normal' | 'lite'>('normal');

    const selectedBoard = useMemo(() =>
        boards.find(b => b.id === selectedBoardId),
        [selectedBoardId, boards]);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pidemelo.app';

    const widgetUrl = useMemo(() =>
        `${origin}/widget/${widgetType}/${selectedBoard?.slug}?color=${encodeURIComponent(accentColor)}&textColor=${encodeURIComponent(textColor)}&darkMode=${isDarkMode}&lang=${lang}&version=${widgetVersion}`,
        [origin, widgetType, selectedBoard, accentColor, textColor, isDarkMode, lang, widgetVersion]);

    const iframeCode = useMemo(() =>
        `<iframe src="${widgetUrl}" width="100%" height="${widgetType === 'form' ? '400px' : '700px'}" frameborder="0" title="Feedback ${widgetType === 'form' ? 'Form' : 'Board'}"></iframe>`,
        [widgetUrl, widgetType]);

    const handleCopy = async () => {
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
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center border border-zinc-200/60 shadow-xl shadow-zinc-200/10 min-h-[400px]">
                <span className="text-5xl md:text-6xl mb-6">🔌</span>
                <h3 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tighter">{dict.no_boards_title}</h3>
                <p className="text-zinc-500 font-bold mt-2 max-w-xs text-sm md:text-base">{dict.no_boards_desc}</p>
                <Link href="/dashboard" className="mt-8 w-full sm:w-auto">
                    <Button className="w-full bg-[#FF5C00] text-white hover:bg-[#E65300] font-black text-xs tracking-widest uppercase h-14 rounded-full px-10 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20">
                        {dict.create_board}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20 mt-6 lg:mt-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900">{dict.studio_title}</h2>
                    <p className="text-zinc-500 font-medium text-sm mt-1">{dict.studio_desc}</p>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start w-full">

                {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y CÓDIGO (col-span-5) */}
                <div className="w-full lg:col-span-5 space-y-8 lg:sticky lg:top-24">

                    {/* 1. SELECCIÓN DE TABLERO */}
                    <section className="bg-white p-6 sm:p-8 rounded-[2rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/5 space-y-6 relative overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border border-orange-100/50">1</div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{dict.step_1_mini}</h3>
                                <p className="text-sm font-bold text-zinc-900">{dict.step_1_title}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {boards.map(board => (
                                <button
                                    key={board.id}
                                    onClick={() => setSelectedBoardId(board.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedBoardId === board.id
                                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-lg shadow-zinc-200/50 scale-[1.02] ring-2 ring-zinc-950 ring-offset-2'
                                        : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <Layout className={`w-4 h-4 flex-shrink-0 ${selectedBoardId === board.id ? 'text-orange-500' : 'text-zinc-400'}`} />
                                        <span className="text-sm font-bold truncate">{board.name}</span>
                                    </div>
                                    {selectedBoardId === board.id && (
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 2. PERSONALIZACIÓN VISUAL */}
                    <section className="bg-white p-6 sm:p-8 rounded-[2rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/5 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border border-orange-100/50">2</div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{dict.step_2_mini}</h3>
                                <p className="text-sm font-bold text-zinc-900">{dict.step_2_title}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Acento */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{dict.color_main}</label>
                                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{accentColor}</span>
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                                    {colorPresets.map((preset) => (
                                        <button
                                            key={preset.hex}
                                            onClick={() => setAccentColor(preset.hex)}
                                            className={`aspect-square w-full rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border border-black/5 ${accentColor === preset.hex ? 'ring-2 ring-zinc-950 ring-offset-2 shadow-sm' : ''}`}
                                            style={{ backgroundColor: preset.hex }}
                                            title={preset.name}
                                        >
                                            {accentColor === preset.hex && <Check className="w-3 h-3 text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                    <div className="relative aspect-square w-full">
                                        <input
                                            type="color"
                                            value={accentColor}
                                            onChange={(e) => setAccentColor(e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className={`absolute inset-0 rounded-xl border flex items-center justify-center transition-all ${!colorPresets.find(p => p.hex === accentColor) ? 'border-zinc-950 ring-2 ring-zinc-950 ring-offset-2 bg-zinc-50' : 'border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}>
                                            {!colorPresets.find(p => p.hex === accentColor) ? (
                                                <div className="w-full h-full rounded-xl" style={{ backgroundColor: accentColor }}></div>
                                            ) : (
                                                <span className="text-zinc-400 text-sm font-black">+</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Texto */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{dict.color_text}</label>
                                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{textColor}</span>
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                                    {textPresets.map((preset) => (
                                        <button
                                            key={preset.hex}
                                            onClick={() => setTextColor(preset.hex)}
                                            className={`aspect-square w-full rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border border-black/5 ${textColor === preset.hex ? 'ring-2 ring-zinc-950 ring-offset-2 shadow-sm' : ''}`}
                                            style={{ backgroundColor: preset.hex }}
                                            title={preset.name}
                                        >
                                            {textColor === preset.hex && <Check className="w-3 h-3 text-white mix-blend-difference drop-shadow-md" />}
                                        </button>
                                    ))}
                                    <div className="relative aspect-square w-full">
                                        <input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className={`absolute inset-0 rounded-xl border flex items-center justify-center transition-all ${!textPresets.find(p => p.hex === textColor) ? 'border-zinc-950 ring-2 ring-zinc-950 ring-offset-2 bg-zinc-50' : 'border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}>
                                            {!textPresets.find(p => p.hex === textColor) ? (
                                                <div className="w-full h-full rounded-xl" style={{ backgroundColor: textColor }}></div>
                                            ) : (
                                                <span className="text-zinc-400 text-sm font-black">+</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Theme */}
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">{dict.theme}</label>
                                <div className="flex bg-zinc-100/50 p-1.5 rounded-[1.25rem] w-full border border-zinc-200/50">
                                    <button
                                        onClick={() => setIsDarkMode(false)}
                                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-[1rem] text-[10px] uppercase tracking-widest font-black transition-all ${!isDarkMode ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        <Sun className="w-3.5 h-3.5" /> {dict.light}
                                    </button>
                                    <button
                                        onClick={() => setIsDarkMode(true)}
                                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-[1rem] text-[10px] uppercase tracking-widest font-black transition-all ${isDarkMode ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        <Moon className="w-3.5 h-3.5" /> {dict.dark}
                                    </button>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">{dict.language}</label>
                                <div className="flex bg-zinc-100/50 p-1.5 rounded-[1.25rem] w-full border border-zinc-200/50">
                                    <button
                                        onClick={() => setLang('es')}
                                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-[1rem] text-[10px] uppercase tracking-widest font-black transition-all ${lang === 'es' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        <span>🇪🇸</span> {dict.spanish}
                                    </button>
                                    <button
                                        onClick={() => setLang('en')}
                                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-[1rem] text-[10px] uppercase tracking-widest font-black transition-all ${lang === 'en' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        <span>🇺🇸</span> {dict.english}
                                    </button>
                                </div>
                            </div>

                            {/* Version */}
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-1">{dict.widget_version}</label>
                                <div className="flex bg-zinc-100/50 p-1.5 rounded-[1.25rem] w-full border border-zinc-200/50">
                                    <button
                                        onClick={() => setWidgetVersion('normal')}
                                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-[1rem] text-[10px] uppercase tracking-widest font-black transition-all ${widgetVersion === 'normal' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        <span>✨</span> {dict.version_normal}
                                    </button>
                                    <button
                                        onClick={() => setWidgetVersion('lite')}
                                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-[1rem] text-[10px] uppercase tracking-widest font-black transition-all ${widgetVersion === 'lite' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        <span>⚡</span> {dict.version_lite}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. TIPO DE WIDGET & CÓDIGO */}
                    <section className="bg-white p-6 sm:p-8 rounded-[2rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/5 space-y-6 block">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border border-orange-100/50">3</div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{dict.step_3_mini}</h3>
                                <p className="text-sm font-bold text-zinc-900">{dict.step_3_title}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setWidgetType('form')}
                                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all ${widgetType === 'form' ? 'border-[#FF5C00] bg-orange-50/30 shadow-sm ring-2 ring-[#FF5C00]/20 ring-offset-2' : 'border-zinc-100 hover:border-zinc-200 bg-white'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${widgetType === 'form' ? 'bg-[#FF5C00] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                    <Layout className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest text-center ${widgetType === 'form' ? 'text-zinc-950' : 'text-zinc-500'}`}>{dict.only_form}</span>
                            </button>

                            <button
                                onClick={() => setWidgetType('board')}
                                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all ${widgetType === 'board' ? 'border-[#FF5C00] bg-orange-50/30 shadow-sm ring-2 ring-[#FF5C00]/20 ring-offset-2' : 'border-zinc-100 hover:border-zinc-200 bg-white'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${widgetType === 'board' ? 'bg-[#FF5C00] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                    <Code className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest text-center ${widgetType === 'board' ? 'text-zinc-950' : 'text-zinc-500'}`}>{dict.voting_board}</span>
                            </button>
                        </div>

                        {/* CAJA DE CÓDIGO */}
                        <div className="bg-zinc-950 rounded-[1.5rem] p-1 shadow-xl shadow-zinc-200/50 overflow-hidden relative">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                </div>
                                <Button
                                    onClick={handleCopy}
                                    className="h-7 px-3 rounded-lg font-bold text-[10px] uppercase tracking-widest gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
                                >
                                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                    {copied ? dict.copied : dict.copy_code}
                                </Button>
                            </div>
                            <div className="relative p-5 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-[160px]">
                                {iframeCode}
                            </div>
                        </div>
                    </section>
                </div>

                {/* COLUMNA DERECHA: PREVIEW INTERACTIVO (col-span-7) */}
                <div className="w-full lg:col-span-7 space-y-6">
                    {/* Preview Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:px-6 rounded-[2rem] border border-zinc-200/60 shadow-lg shadow-zinc-200/5 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900">{dict.interactive_preview}</h3>
                        </div>

                        {/* ToggleGroup Simulado */}
                        <div className="flex bg-zinc-100 p-1 rounded-full border border-zinc-200/50">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`flex items-center justify-center w-12 h-9 rounded-full transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                title={dict.desktop_view}
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`flex items-center justify-center w-12 h-9 rounded-full transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                title={dict.mobile_view}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Contenedor del Escaparate */}
                    <div className="bg-zinc-50/50 rounded-[2.5rem] p-4 sm:p-8 min-h-[600px] md:min-h-[800px] flex items-center justify-center border border-zinc-200 overflow-hidden relative transition-all duration-500 bg-[url('https://res.cloudinary.com/dqrzi8qzi/image/upload/v1734975549/grid_hzp3to.svg')] bg-center">

                        {/* Contenedor Dinámico del Iframe */}
                        <div
                            className={`relative bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform flex flex-col ${viewMode === 'mobile'
                                ? 'w-[320px] sm:w-[375px] h-[568px] sm:h-[667px] border-[8px] sm:border-[12px] border-zinc-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl ring-1 ring-black/5 flex-shrink-0'
                                : 'w-full max-w-4xl h-[500px] md:h-[700px] border border-zinc-200 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl'
                                }`}
                        >
                            {/* Mobile Notch Sim */}
                            {viewMode === 'mobile' && (
                                <div className="absolute top-0 inset-x-0 h-5 sm:h-6 flex justify-center z-20 pointer-events-none">
                                    <div className="w-24 sm:w-32 h-5 sm:h-6 bg-zinc-900 rounded-b-xl sm:rounded-b-2xl"></div>
                                </div>
                            )}

                            {/* Iframe Real */}
                            <div className={`flex-1 flex flex-col relative overflow-hidden z-10 bg-white ${viewMode === 'mobile' ? 'rounded-[1.5rem] sm:rounded-[2rem]' : 'rounded-[1.5rem] sm:rounded-[2rem]'}`}>
                                {/* Skeleton Fallback underneath iframe */}
                                <div className="absolute inset-0 bg-white z-0 flex items-center justify-center pointer-events-none">
                                    <WidgetSkeleton />
                                </div>
                                <iframe
                                    src={widgetUrl}
                                    title={`Preview ${widgetType}`}
                                    className="w-full h-full relative z-10 bg-transparent border-none"
                                    key={widgetUrl}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
