import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Map as MapIcon, PartyPopper } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { getDictionary, getLocale } from "@/i18n";
import { getOwnedBoard } from "../data";
import CopyField from "./CopyField";
import WidgetStudio from "./WidgetStudio";

export const dynamic = 'force-dynamic';

export default async function BoardSharePage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { new?: string };
}) {
    const [t, locale, board] = await Promise.all([getDictionary(), getLocale(), getOwnedBoard(params.id)]);
    if (!board) notFound();

    const dict = t.share;
    const publicUrl = `https://pidemelo.app/board/${board.slug}`;

    return (
        <div className="space-y-4 md:space-y-6">
            {searchParams.new === '1' && (
                <Panel tone="mint" padding="sm" className="flex items-start gap-3 animate-pop">
                    <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-[#2F7457]" aria-hidden="true" />
                    <div className="space-y-0.5">
                        <p className="font-heading font-bold text-foreground">{dict.welcome_title}</p>
                        <p className="text-sm text-foreground/80">{dict.welcome_desc}</p>
                    </div>
                </Panel>
            )}

            <Panel tone="card" padding="none">
                <div className="space-y-4 p-4 md:p-6">
                    <div className="space-y-1">
                        <h2 className="font-heading text-base font-bold text-foreground">{dict.link_title}</h2>
                        <p className="text-sm text-muted-foreground">{dict.link_desc}</p>
                    </div>
                    <CopyField value={publicUrl} label={dict.link_title} copyLabel={dict.copy} copiedLabel={dict.copied} />
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                        <Link href={`/board/${board.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                            <ExternalLink className="h-4 w-4" aria-hidden="true" /> {dict.open}
                        </Link>
                        <Link href={`/board/${board.slug}/roadmap`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                            <MapIcon className="h-4 w-4" aria-hidden="true" /> {dict.roadmap}
                        </Link>
                    </div>
                </div>
            </Panel>

            <Panel tone="card" padding="none">
                <div className="space-y-5 p-4 md:p-6">
                    <div className="space-y-1">
                        <h2 className="font-heading text-base font-bold text-foreground">{dict.embed_title}</h2>
                        <p className="text-sm text-muted-foreground">{dict.embed_desc}</p>
                    </div>
                    <WidgetStudio boardSlug={board.slug} locale={locale} dict={dict} />
                </div>
            </Panel>
        </div>
    );
}
