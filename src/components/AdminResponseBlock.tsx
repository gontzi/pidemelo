// Bloque de "Respuesta oficial" del administrador. Se reutiliza en el tablón
// público, el roadmap y el widget embebido (que comparten componentes).
// Usa `primary`, así que en los widgets adopta el color de marca del cliente.
export default function AdminResponseBlock({
    response,
    label,
}: {
    response: string;
    label: string;
}) {
    if (!response) return null;

    return (
        <div className="mt-3 rounded-lg border-l-4 border-primary bg-primary/5 px-3.5 py-2.5">
            <p className="text-[11px] font-bold text-primary">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                {response}
            </p>
        </div>
    );
}
