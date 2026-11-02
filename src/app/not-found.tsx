import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";
import { getDictionary } from '@/i18n';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
    const t = await getDictionary();
    return (
        <main className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="max-w-xl space-y-8 z-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border/70 shadow-card mb-2 rotate-3">
                    <Ghost className="w-12 h-12 text-[#FF5C00] animate-float" aria-hidden="true" />
                </div>

                <div className="space-y-4">
                    <h1 className="font-heading text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-none">
                        404 — <br />
                        <span className="text-[#FF5C00]">{t.not_found.title}</span>
                    </h1>

                    <p className="text-xl text-muted-foreground font-medium leading-tight max-w-sm mx-auto">
                        {t.not_found.desc}
                    </p>
                </div>

                <div className="pt-6">
                    <Link href="/">
                        <Button size="xl" className="group">
                            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                            {t.not_found.back}
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground/70 font-medium italic">
                    {t.not_found.quote}
                </p>
            </div>
        </main>
    );
}
