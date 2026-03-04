'use server'

import { db } from "@/db";
import { boards } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function createBoard(formData: FormData) {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

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
