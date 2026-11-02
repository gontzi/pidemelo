'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Monitor, Smartphone, MessageSquarePlus, ListChecks, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetSkeleton from '@/components/WidgetSkeleton';
import { cn, readableTextColor } from '@/lib/utils';
import type { Dictionary } from '@/i18n/types';

type ShareDict = Dictionary['share'];
type WidgetType = 'form' | 'board';
type Lang = 'es' | 'en';
type Version = 'normal' | 'lite';

// Altura inicial del iframe; el script del código de inserción la ajusta al contenido
const DEFAULT_HEIGHT: Record<WidgetType, number> = { form: 640, board: 720 };
const RESIZE_MESSAGE = 'pidemelo:resize';

// Script mínimo que acompaña al iframe: escucha la altura que publica el widget
// (src/app/widget/WidgetAutoResize.tsx) y la aplica solo a su propio iframe.
const RESIZE_SCRIPT = `<script>(function(f){addEventListener("message",function(e){if(e.source===f.contentWindow&&e.data&&e.data.type==="${RESIZE_MESSAGE}")f.style.height=e.data.height+"px"})})(document.currentScript.previousElementSibling)</script>`;

const ACCENT_PRESETS = ['#FF5C00', '#EA655F', '#65AD8C', '#F5C35B', '#8051D9', '#151B35'];
const TEXT_PRESETS = ['#151B35', '#3F4A63', '#0B0F22'];

function Segmented<T extends string>({
    value,
    options,
    onChange,
    label,
}: {
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
    label: string;
}) {
    return (
        <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-lg border border-border bg-muted p-0.5">
            {options.map(option => (
                <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={value === option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'h-8 flex-1 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                        value === option.value ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

function Swatches({
    value,
    presets,
    onChange,
    label,
    customLabel,
}: {
    value: string;
    presets: string[];
    onChange: (value: string) => void;
    label: string;
    customLabel: string;
}) {
    const isCustom = !presets.includes(value);
    return (
        <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-2">
            {presets.map(hex => (
                <button
                    key={hex}
                    type="button"
                    role="radio"
                    aria-checked={value === hex}
                    aria-label={hex}
                    onClick={() => onChange(hex)}
                    className={cn(
                        'grid h-8 w-8 place-items-center rounded-full border border-black/10 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
                        value === hex && 'ring-2 ring-foreground ring-offset-2'
                    )}
                    style={{ backgroundColor: hex }}
                >
                    {value === hex && <Check className="h-3.5 w-3.5" style={{ color: readableTextColor(hex) }} aria-hidden="true" />}
                </button>
            ))}
            <label
                className={cn(
                    'relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-dashed border-border bg-muted focus-within:ring-2 focus-within:ring-ring/40',
                    isCustom && 'border-solid ring-2 ring-foreground ring-offset-2'
                )}
                style={isCustom ? { backgroundColor: value } : undefined}
                title={customLabel}
            >
                <span className="sr-only">{customLabel}</span>
                {!isCustom && <span className="grid h-full w-full place-items-center text-sm font-bold text-muted-foreground" aria-hidden="true">+</span>}
                <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
            </label>
        </div>
    );
}

export default function WidgetStudio({
    boardSlug,
    locale,
    dict,
}: {
    boardSlug: string;
    locale: Lang;
    dict: ShareDict;
}) {
    const [widgetType, setWidgetType] = useState<WidgetType>('form');
    const [accentColor, setAccentColor] = useState(ACCENT_PRESETS[0]);
    const [textColor, setTextColor] = useState(TEXT_PRESETS[0]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [lang, setLang] = useState<Lang>(locale);
    const [version, setVersion] = useState<Version>('normal');
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState('https://pidemelo.app');
    const [previewHeight, setPreviewHeight] = useState<number | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => { setOrigin(window.location.origin); }, []);

    // La vista previa se comporta igual que en la web del cliente: crece con el contenido
    useEffect(() => {
        const onMessage = (e: MessageEvent<{ type?: string; height?: number }>) => {
            if (e.source !== iframeRef.current?.contentWindow) return;
            if (e.data?.type === RESIZE_MESSAGE && typeof e.data.height === 'number') setPreviewHeight(e.data.height);
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, []);

    const widgetUrl = useMemo(() =>
        `${origin}/widget/${widgetType}/${boardSlug}?color=${encodeURIComponent(accentColor)}&textColor=${encodeURIComponent(textColor)}&darkMode=${isDarkMode}&lang=${lang}&version=${version}`,
        [origin, widgetType, boardSlug, accentColor, textColor, isDarkMode, lang, version]);

    const iframeCode = useMemo(() =>
        `<iframe src="${widgetUrl}" width="100%" height="${DEFAULT_HEIGHT[widgetType]}" style="border:0;width:100%;display:block" loading="lazy" title="${widgetType === 'form' ? 'Feedback' : 'Feedback board'}"></iframe>
${RESIZE_SCRIPT}`,
        [widgetUrl, widgetType]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(iframeCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* portapapeles no disponible */
        }
    };

    const typeOptions: { value: WidgetType; label: string; desc: string; Icon: typeof ListChecks }[] = [
        { value: 'form', label: dict.type_form, desc: dict.type_form_desc, Icon: MessageSquarePlus },
        { value: 'board', label: dict.type_board, desc: dict.type_board_desc, Icon: ListChecks },
    ];

    return (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr] lg:gap-6">
            {/* Configuración */}
            <div className="space-y-5">
                <fieldset className="space-y-2">
                    <legend className="mb-2 text-sm font-semibold text-foreground">{dict.type_label}</legend>
                    <div className="grid grid-cols-2 gap-2">
                        {typeOptions.map(({ value, label, desc, Icon }) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={widgetType === value}
                                onClick={() => setWidgetType(value)}
                                className={cn(
                                    'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                    widgetType === value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'
                                )}
                            >
                                <Icon className={cn('h-4 w-4', widgetType === value ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true" />
                                <span className="text-sm font-semibold text-foreground">{label}</span>
                                <span className="text-xs text-muted-foreground">{desc}</span>
                            </button>
                        ))}
                    </div>
                </fieldset>

                <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{dict.color_main}</p>
                    <Swatches value={accentColor} presets={ACCENT_PRESETS} onChange={setAccentColor} label={dict.color_main} customLabel={dict.color_custom} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">{dict.theme}</p>
                        <Segmented
                            label={dict.theme}
                            value={isDarkMode ? 'dark' : 'light'}
                            onChange={(v) => setIsDarkMode(v === 'dark')}
                            options={[{ value: 'light', label: dict.light }, { value: 'dark', label: dict.dark }]}
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">{dict.language}</p>
                        <Segmented
                            label={dict.language}
                            value={lang}
                            onChange={setLang}
                            options={[{ value: 'es', label: 'ES' }, { value: 'en', label: 'EN' }]}
                        />
                    </div>
                </div>

                <details className="group rounded-lg border border-border bg-card">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                        {dict.advanced}
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="space-y-4 border-t border-border p-3">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">{dict.color_text}</p>
                            <Swatches value={textColor} presets={TEXT_PRESETS} onChange={setTextColor} label={dict.color_text} customLabel={dict.color_custom} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">{dict.version}</p>
                            <Segmented
                                label={dict.version}
                                value={version}
                                onChange={setVersion}
                                options={[{ value: 'normal', label: dict.version_normal }, { value: 'lite', label: dict.version_lite }]}
                            />
                        </div>
                    </div>
                </details>

                <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{dict.code_label}</p>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-[#151B35] p-3 font-mono text-xs leading-relaxed text-white/80">
                        {iframeCode}
                    </pre>
                    <p className="text-xs text-muted-foreground">{dict.code_hint}</p>
                    <Button type="button" onClick={handleCopy} className="w-full">
                        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                        {copied ? dict.copied : dict.copy_code}
                    </Button>
                </div>
            </div>

            {/* Vista previa */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{dict.preview}</p>
                    <div className="hidden w-48 md:block">
                        <Segmented
                            label={dict.preview}
                            value={viewMode}
                            onChange={setViewMode}
                            options={[{ value: 'desktop', label: dict.desktop_view }, { value: 'mobile', label: dict.mobile_view }]}
                        />
                    </div>
                </div>
                <div className="flex items-start justify-center rounded-xl border border-border bg-muted/40 p-3 md:p-6">
                    <div
                        className={cn(
                            'relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-card transition-[max-width,height] duration-300',
                            viewMode === 'mobile' && 'md:max-w-[375px]'
                        )}
                        style={{ height: viewMode === 'mobile' ? 640 : (previewHeight ?? DEFAULT_HEIGHT[widgetType]) }}
                    >
                        <div className="pointer-events-none absolute inset-0">
                            <WidgetSkeleton variant={widgetType} />
                        </div>
                        <iframe
                            ref={iframeRef}
                            key={widgetUrl}
                            src={widgetUrl}
                            title={dict.preview}
                            className="relative z-10 h-full w-full border-none bg-transparent"
                        />
                    </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {viewMode === 'mobile' ? <Smartphone className="h-3.5 w-3.5" aria-hidden="true" /> : <Monitor className="h-3.5 w-3.5" aria-hidden="true" />}
                    {dict.preview_hint}
                </p>
            </div>
        </div>
    );
}
