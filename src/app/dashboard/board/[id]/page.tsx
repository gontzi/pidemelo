import { notFound } from "next/navigation";
import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { ideas, votes } from "@/db/schema";
import { getDictionary, getLocale } from "@/i18n";
import { getOwnedBoard } from "./data";
import IdeasInbox from "./IdeasInbox";
import type { InboxIdea } from "./types";

export const dynamic = 'force-dynamic';

export default async function BoardIdeasPage({ params }: { params: { id: string } }) {
    const [t, locale, board] = await Promise.all([getDictionary(), getLocale(), getOwnedBoard(params.id)]);
    if (!board) notFound();

    const boardIdeas = await db.query.ideas.findMany({
        where: eq(ideas.boardId, board.id),
        with: { tag: true },
        orderBy: [desc(ideas.createdAt)],
    });

    // Conteo de votos agregado en SQL (evita cargar todas las filas de votos)
    const ideaIds = boardIdeas.map(i => i.id);
    const voteRows = ideaIds.length > 0
        ? await db.select({ ideaId: votes.ideaId, count: count() })
            .from(votes)
            .where(inArray(votes.ideaId, ideaIds))
            .groupBy(votes.ideaId)
        : [];
    const voteCountMap = new Map(voteRows.map(r => [r.ideaId, r.count]));

    const inboxIdeas: InboxIdea[] = boardIdeas.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        imageUrl: idea.imageUrl,
        status: idea.status,
        votesCount: voteCountMap.get(idea.id) ?? 0,
        adminResponse: idea.adminResponse ?? null,
        createdAt: idea.createdAt.toISOString(),
        tag: idea.tag ? { id: idea.tag.id, name: idea.tag.name, color: idea.tag.color } : null,
    }));

    return <IdeasInbox initialIdeas={inboxIdeas} boardId={board.id} dict={t.inbox} locale={locale} />;
}
