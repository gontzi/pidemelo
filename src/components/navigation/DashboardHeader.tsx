import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Coffee } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Dictionary } from "@/i18n/types";

// Barra superior del panel. Sin navegación lateral: el panel solo tiene
// "Tableros" y, dentro de cada tablero, sus pestañas.
export default function DashboardHeader({ dict }: { dict: Dictionary['navbar'] }) {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card/90 pt-safe backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 md:px-8">
                <Link
                    href="/dashboard"
                    aria-label={dict.boards}
                    className="flex items-center rounded-md font-heading text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                    <span className="text-foreground">pidemelo</span>
                    <span className="text-[#FF5C00]">.</span>
                    <span className="text-foreground">app</span>
                </Link>

                <div className="flex items-center gap-2 md:gap-3">
                    <a
                        href="https://buymeacoffee.com/gontzi"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={dict.support}
                        className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                        <Coffee className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{dict.support}</span>
                    </a>
                    <LanguageSwitcher />
                    <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-border" } }} />
                </div>
            </div>
        </header>
    );
}
