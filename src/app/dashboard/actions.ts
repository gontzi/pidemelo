'use server'

import { db } from "@/db";
import { boards, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";

function slugify(text: string) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function createBoard(formData: FormData) {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    // Límite para usuarios gratuitos
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const isPremium = user?.isPremium || false;

    if (!isPremium) {
        const boardCount = await db.select({ count: count() }).from(boards).where(eq(boards.userId, userId));
        if (boardCount[0].count >= 1) {
            redirect("/dashboard/billing?limit=true");
        }
    }

    const name = formData.get('name') as string;
    if (!name) return;

    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    await db.insert(boards).values({
        userId,
        name,
        slug,
    });

    revalidatePath('/dashboard');
}
