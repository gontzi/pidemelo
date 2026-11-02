import Link from "next/link";
import { notFound } from "next/navigation";
import { and, count, eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/db";
import { ideas } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n";
import { getOwnedBoard } from "./data";
import BoardTabs from "./BoardTabs";

export default async function BoardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const t = await getDictionary();
    const board = await getOwnedBoard(params.id);
    if (!board) notFound();

    const [{ value: toReview }] = await db
        .select({ value: count() })
        .from(ideas)
        .where(and(eq(ideas.boardId, board.id), eq(ideas.status, 'en_revision')));

    const base = `/dashboard/board/${board.id}`;

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-5 md:px-8 md:py-8">
            <header className="space-y-4">
                <div className="space-y-2">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.board_nav.back}
                    </Link>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {board.name}
                            </h1>
                            <p className="truncate text-sm text-muted-foreground">pidemelo.app/board/{board.slug}</p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="shrink-0">
                            <Link href={`/board/${board.slug}`} target="_blank" rel="noopener noreferrer">
                                <span className="hidden sm:inline">{t.board_nav.view_public}</span>
                                <span className="sm:hidden">{t.board_nav.view_public_short}</span>
                                <ExternalLink aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <BoardTabs
                    label={t.board_nav.tabs_label}
                    tabs={[
                        { href: base, label: t.board_nav.tab_ideas, badge: toReview },
                        { href: `${base}/share`, label: t.board_nav.tab_share },
                        { href: `${base}/settings`, label: t.board_nav.tab_settings },
                    ]}
                />
            </header>

            <div className="pt-5 md:pt-6">{children}</div>
        </div>
    );
}
