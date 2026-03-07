'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n';

export default function LanguageSwitcher() {
    const router = useRouter();

    const changeLanguage = (locale: Locale) => {
        // Establecer la cookie NEXT_LOCALE manualmente para forzar el idioma
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

        // Recargar la página actual para que el servidor lea la nueva cookie y vuelva a generar la ruta
        router.refresh();
    };

    return (
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => changeLanguage('es')}
                className="rounded-full h-7 px-3 text-[10px] font-black hover:bg-white hover:shadow-sm"
            >
                ES
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => changeLanguage('en')}
                className="rounded-full h-7 px-3 text-[10px] font-black hover:bg-white hover:shadow-sm"
            >
                EN
            </Button>
        </div>

    );
}
