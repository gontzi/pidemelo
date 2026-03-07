'use server'

import { db } from "@/db";
import { boards, ideas, votes, tags, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBoardSettings(boardId: string, newName: string, formDataSlug: string) {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    if (!newName) return { error: "Name cannot be empty" };
    if (!formDataSlug) return { error: "Slug cannot be empty" };

    // Formato: lowercase, sin espacios, solo guiones, alfanumerico
    const newSlug = formDataSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!newSlug) return { error: "Invalid slug format" };

    // Check unique
    const existing = await db.query.boards.findFirst({
        where: and(eq(boards.slug, newSlug), ne(boards.id, boardId))
    });

    if (existing) {
        return { error: "El slug ya está en uso." };
    }

    await db.update(boards)
        .set({ name: newName, slug: newSlug })
        .where(and(eq(boards.id, boardId), eq(boards.userId, userId)));

    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
}

export async function updateIdeaStatus(ideaId: string, newStatus: 'pending' | 'planned' | 'done', boardId: string) {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    // Verificar propiedad
    const idea = await db.query.ideas.findFirst({
        where: eq(ideas.id, ideaId),
        with: { board: true }
    });

    if (!idea || idea.board.userId !== userId) {
        return { error: "No permission" };
    }

    await db.update(ideas)
        .set({ status: newStatus })
        .where(eq(ideas.id, ideaId));

    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
}

export async function deleteIdea(ideaId: string, boardId: string) {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    // Verificar propiedad
    const idea = await db.query.ideas.findFirst({
        where: eq(ideas.id, ideaId),
        with: { board: true }
    });

    if (!idea || idea.board.userId !== userId) {
        return { error: "No permission" };
    }

    // Eliminar votos. El cascade ya lo hace si está configurado en Postgres, pero con Serverless a veces es mejor asegurarlo.
    await db.delete(votes).where(eq(votes.ideaId, ideaId));
    await db.delete(ideas).where(eq(ideas.id, ideaId));

    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
}

export async function deleteBoard(boardId: string) {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    const board = await db.query.boards.findFirst({
        where: and(eq(boards.id, boardId), eq(boards.userId, userId))
    });

    if (!board) return { error: "No permission" };

    // Automatic cascade delete on Postgres
    await db.delete(boards).where(and(eq(boards.id, boardId), eq(boards.userId, userId)));

    revalidatePath(`/dashboard`);
    return { success: true };
}

export async function createTag(boardId: string, name: string, color: string) {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    const board = await db.query.boards.findFirst({
        where: and(eq(boards.id, boardId), eq(boards.userId, userId)),
        with: { tags: true }
    });

    if (!board) return { error: "No permission" };

    if (!user?.isPremium && board.tags.length >= 6) {
        return { error: "Limit reached. Upgrade to Pro for unlimited tags." };
    }

    await db.insert(tags).values({
        boardId,
        name,
        color
    });

    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
}

export async function deleteTag(tagId: string, boardId: string) {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    const board = await db.query.boards.findFirst({
        where: and(eq(boards.id, boardId), eq(boards.userId, userId))
    });

    if (!board) return { error: "No permission" };

    await db.delete(tags).where(and(eq(tags.id, tagId), eq(tags.boardId, boardId)));

    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
}
