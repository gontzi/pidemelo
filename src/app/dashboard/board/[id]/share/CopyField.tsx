'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Campo de solo lectura con botón de copiar (enlace público, etc.)
export default function CopyField({
    value,
    label,
    copyLabel,
    copiedLabel,
}: {
    value: string;
    label: string;
    copyLabel: string;
    copiedLabel: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* portapapeles no disponible */
        }
    };

    return (
        <div className="flex gap-2">
            <input
                readOnly
                value={value}
                aria-label={label}
                onFocus={(e) => e.currentTarget.select()}
                className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-muted/50 px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <Button type="button" onClick={handleCopy} className="shrink-0">
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                {copied ? copiedLabel : copyLabel}
            </Button>
        </div>
    );
}
