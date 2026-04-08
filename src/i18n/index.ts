import { cookies, headers } from 'next/headers';

export type Locale = 'es' | 'en';
export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

import es from './locales/es';
import en from './locales/en';

// Importamos los diccionarios (cargados estáticamente para evitar problemas con Edge en dev)
const dictionaries = {
    es: () => es,
    en: () => en,
};

export async function getLocale() {
    const cookieLocale = cookies().get('NEXT_LOCALE')?.value as Locale;
    if (cookieLocale && locales.includes(cookieLocale)) {
        return cookieLocale;
    }
    const acceptLanguage = headers().get('accept-language');
    if (acceptLanguage && acceptLanguage.includes('en')) {
        return 'en';
    }
    return defaultLocale;
}

export async function getDictionary(locale?: Locale) {
    // Si no nos pasan un locale explícito, intentamos leerlo de la cookie o el navegador
    if (!locale) {
        locale = await getLocale();
    }

    // Devolvemos el diccionario correspondiente o el por defecto
    return dictionaries[locale]() ?? dictionaries[defaultLocale]();
}
