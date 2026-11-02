// Esqueleto de carga de los widgets. Usa tokens, así que respeta el tema
// (claro/oscuro) del contenedor en el que se pinta.
export default function WidgetSkeleton({ variant = 'form' }: { variant?: 'form' | 'board' }) {
    return (
        <div className="flex min-h-full animate-pulse flex-col bg-card p-4" aria-hidden="true">
            {variant === 'form' ? (
                <div className="flex-1 space-y-4">
                    <div className="space-y-2 pb-1">
                        <div className="h-5 w-1/3 rounded-full bg-muted" />
                        <div className="h-3 w-1/2 rounded-full bg-muted" />
                    </div>
                    <div className="h-11 w-full rounded-lg bg-muted" />
                    <div className="h-28 w-full rounded-lg bg-muted" />
                    <div className="h-11 w-full rounded-lg bg-muted" />
                    <div className="h-11 w-full rounded-lg bg-primary/20" />
                </div>
            ) : (
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-5 w-1/3 rounded-full bg-muted" />
                        <div className="h-9 w-28 rounded-lg bg-primary/20" />
                    </div>
                    <div className="h-9 w-full rounded-lg bg-muted" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 rounded-xl border border-border p-4">
                            <div className="h-14 w-12 shrink-0 rounded-lg bg-muted" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 w-3/4 rounded-full bg-muted" />
                                <div className="h-3 w-full rounded-full bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mx-auto mt-6 h-3 w-28 rounded-full bg-muted" />
        </div>
    );
}
