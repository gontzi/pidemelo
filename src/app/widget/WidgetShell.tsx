import { cn } from "@/lib/utils";
import type { WidgetTheme } from "@/lib/widget-theme";
import WidgetAutoResize from "./WidgetAutoResize";

// Raíz de los widgets: tema (tokens en :root) y fondo. Va fuera del Suspense
// para que el esqueleto de carga ya salga con los colores del cliente.
export function WidgetFrame({ theme, children }: { theme: WidgetTheme; children: React.ReactNode }) {
    return (
        <div className={cn('min-h-screen bg-card text-foreground', theme.isDarkMode && 'widget-dark')}>
            {/* Solo tripletes HSL calculados a partir de colores hex validados */}
            <style dangerouslySetInnerHTML={{ __html: `${theme.css}html,body{background:hsl(var(--card))}` }} />
            {children}
        </div>
    );
}

// Contenido común: cabecera opcional, pie con marca y autoajuste de altura.
export default function WidgetShell({
    theme,
    title,
    subtitle,
    action,
    footerLink,
    poweredBy,
    children,
}: {
    theme: WidgetTheme;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    footerLink?: { href: string; label: string };
    poweredBy: string;
    children: React.ReactNode;
}) {
    const isLite = theme.version === 'lite';

    return (
        <WidgetAutoResize>
            <main className={cn('space-y-4', isLite ? 'p-3' : 'p-4 md:p-5')}>
                {!isLite && title && (
                    <header className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="truncate font-heading text-lg font-bold tracking-tight">{title}</h1>
                            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                        {action}
                    </header>
                )}
                {isLite && action && <div className="flex justify-end">{action}</div>}

                {children}

                <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 text-xs">
                    {footerLink ? (
                        <a
                            href={footerLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded"
                        >
                            {footerLink.label} →
                        </a>
                    ) : <span />}
                    <a
                        href="https://pidemelo.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 font-medium text-muted-foreground/80 transition-colors hover:text-muted-foreground"
                    >
                        {poweredBy}
                        <span className="font-heading font-extrabold">
                            pidemelo<span className="text-[#FF5C00]">.</span>app
                        </span>
                    </a>
                </footer>
            </main>
        </WidgetAutoResize>
    );
}
