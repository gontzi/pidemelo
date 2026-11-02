// Fecha relativa localizada ("hace 3 horas", "2 days ago").
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
];

export function formatRelative(date: string | Date, locale: string, now: number = Date.now()): string {
    const seconds = Math.round((new Date(date).getTime() - now) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) {
            return rtf.format(Math.round(seconds / size), unit);
        }
    }
    return rtf.format(0, 'second');
}
