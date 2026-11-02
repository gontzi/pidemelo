import { db } from "@/db";
import { boards, ideas, votes } from "@/db/schema";
import { eq, desc, ne, count, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicBoardClient from "../../../board/[slug]/PublicBoardClient";
import SubmitIdeaSheet from "../../../board/[slug]/SubmitIdeaSheet";
import { getDictionary } from "@/i18n";
import { getVotedIdeaIds } from "@/lib/voter";
import { getWidgetTheme, type WidgetSearchParams, type WidgetTheme } from "@/lib/widget-theme";
import { Suspense } from "react";
import WidgetSkeleton from "@/components/WidgetSkeleton";
import WidgetShell, { WidgetFrame } from "../../WidgetShell";

export const dynamic = 'force-dynamic';

export default function WidgetBoardPage({
    params,
    searchParams
}: {
    params: { slug: string },
    searchParams: WidgetSearchParams
}) {
    const theme = getWidgetTheme(searchParams);

    return (
        <WidgetFrame theme={theme}>
            <Suspense fallback={<WidgetSkeleton variant="board" />}>
                <BoardContent slug={params.slug} theme={theme} />
            </Suspense>
        </WidgetFrame>
    );
}

async function BoardContent({ slug, theme }: { slug: string; theme: WidgetTheme }) {
    const t = await getDictionary(theme.lang);

    const board = await db.query.boards.findFirst({
        where: eq(boards.slug, slug),
        with: {
            tags: true,
            ideas: {
                where: ne(ideas.status, 'archivado'),
                with: { tag: true },
                orderBy: [desc(ideas.createdAt)]
            }
        }
    });

    if (!board) notFound();

    const ideaIds = board.ideas.map(i => i.id);
    const voteRows = ideaIds.length > 0
        ? await db.select({ ideaId: votes.ideaId, count: count() })
            .from(votes)
            .where(inArray(votes.ideaId, ideaIds))
            .groupBy(votes.ideaId)
        : [];
    const voteCountMap = new Map(voteRows.map(r => [r.ideaId, r.count]));
    const votedIdeaIds = await getVotedIdeaIds(ideaIds);

    const sortedIdeas = board.ideas.sort((a, b) => (voteCountMap.get(b.id) ?? 0) - (voteCountMap.get(a.id) ?? 0));

    return (
        <WidgetShell
            theme={theme}
            title={board.name}
            subtitle={t.widget_page.board_subtitle}
            action={
                <SubmitIdeaSheet
                    variant="inline"
                    boardId={board.id}
                    boardSlug={board.slug}
                    formTitle={t.public_board_page.form_title}
                    formDesc={t.public_board_page.form_desc}
                    dict={t.submit_idea_form}
                    imageDict={t.image_upload}
                    tags={board.tags}
                    triggerLabel={t.widget_page.suggest}
                />
            }
            footerLink={{ href: `https://pidemelo.app/board/${board.slug}/roadmap`, label: t.widget_page.see_roadmap }}
            poweredBy={t.public_board_client.powered_by}
        >
            <PublicBoardClient
                initialIdeas={sortedIdeas.map(i => ({
                    ...i,
                    status: i.status as 'en_revision' | 'planeado' | 'en_progreso' | 'completado' | 'descartado',
                    votesCount: voteCountMap.get(i.id) ?? 0
                }))}
                boardSlug={board.slug}
                widgetVersion={theme.version}
                embedded
                votedIdeaIds={votedIdeaIds}
                dict={t.public_board_client}
            />
        </WidgetShell>
    );
}
