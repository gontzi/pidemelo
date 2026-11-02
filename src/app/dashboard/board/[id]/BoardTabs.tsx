'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Tab = { href: string; label: string; badge?: number };

// Pestañas del tablero. Único componente cliente del layout (necesita la ruta activa).
export default function BoardTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
    const pathname = usePathname();

    return (
        <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 hide-scrollbar md:mx-0 md:px-0">
            <ul className="flex min-w-max gap-1 border-b border-border">
                {tabs.map((tab, index) => {
                    const active = index === 0 ? pathname === tab.href : pathname.startsWith(tab.href);
                    return (
                        <li key={tab.href}>
                            <Link
                                href={tab.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    '-mb-px inline-flex h-11 items-center gap-2 rounded-t-md border-b-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                    active
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {tab.label}
                                {tab.badge !== undefined && tab.badge > 0 && (
                                    <span className="rounded-full bg-[#FFF0E8] px-1.5 text-xs font-bold tabular-nums text-[#C24A00]">
                                        {tab.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
