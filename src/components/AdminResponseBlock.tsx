// Bloque de "Respuesta oficial" del administrador. Se reutiliza en el tablón
// público, el roadmap y el widget embebido (que comparten componentes).
export default function AdminResponseBlock({
    response,
    label,
}: {
    response: string;
    label: string;
}) {
    if (!response) return null;

    return (
        <div className="mt-3 rounded-xl border-l-4 border-[#FF5C00] bg-[#FFF7ED] px-3.5 py-2.5">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#FF5C00]">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-800 whitespace-pre-wrap break-words">
                {response}
            </p>
        </div>
    );
}