'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export default function LanguageSwitcher() {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('es');

    useEffect(() => {
        const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
        if (match && (match[1] === 'es' || match[1] === 'en')) {
            setLocale(match[1] as Locale);
        }
    }, []);

    const changeLanguage = (next: Locale) => {
        // Establecer la cookie NEXT_LOCALE manualmente para forzar el idioma
        document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
        setLocale(next);
        // Recargar la página actual para que el servidor lea la nueva cookie
        router.refresh();
    };

    return (
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            {(['es', 'en'] as Locale[]).map((l) => (
                <Button
                    key={l}
                    variant="ghost"
                    size="sm"
                    onClick={() => changeLanguage(l)}
                    aria-label={l === 'es' ? 'Español' : 'English'}
                    aria-pressed={locale === l}
                    className={cn(
                        'rounded-full h-7 px-3 text-[10px] font-bold transition-colors',
                        locale === l
                            ? 'bg-card text-foreground shadow-soft'
                            : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    )}
                >
                    {l.toUpperCase()}
                </Button>
            ))}
        </div>
    );
}
