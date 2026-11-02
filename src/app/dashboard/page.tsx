import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { boards } from "@/db/schema";
import { getDictionary } from '@/i18n';
import { isClosedStatus } from "@/lib/idea-status";
import BoardsBrowser, { type BoardSummary } from "./BoardsBrowser";
import CreateBoardForm from "./CreateBoardForm";
import DashboardEmptyState from "./DashboardEmptyState";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const t = await getDictionary();
    const { userId } = auth();
    if (!userId) return null;

    const userBoards = await db.query.boards.findMany({
        where: eq(boards.userId, userId),
        with: {
            ideas: { columns: { status: true, createdAt: true } },
        },
        orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });

    const summaries: BoardSummary[] = userBoards.map(board => {
        const open = board.ideas.filter(i => !isClosedStatus(i.status));
        return {
            id: board.id,
            name: board.name,
            slug: board.slug,
            openCount: open.length,
            toReviewCount: board.ideas.filter(i => i.status === 'en_revision').length,
            ideaCreatedAts: board.ideas.map(i => i.createdAt.toISOString()),
        };
    });

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
            <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {t.dashboard_index.title}
                    </h1>
                    <p className="text-sm text-muted-foreground md:text-base">
                        {t.dashboard_index.subtitle}
                    </p>
                </div>
                {summaries.length > 0 && <CreateBoardForm dict={t.dashboard_index} className="md:w-96" />}
            </header>

            {summaries.length === 0 ? (
                <DashboardEmptyState dict={t.dashboard_index} />
            ) : (
                <BoardsBrowser boards={summaries} dict={t.dashboard_index} />
            )}
        </div>
    );
}
