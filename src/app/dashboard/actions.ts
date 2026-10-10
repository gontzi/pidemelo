'use server'

import { db } from "@/db";
import { boards } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

function slugify(text: string) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function createBoard(formData: FormData) {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");


    const name = formData.get('name') as string;
    if (!name) return;

    const baseSlug = slugify(name);

    // Comprobar si el slug limpio ya existe en la BBDD
    let slug = baseSlug;
    const existing = await db.query.boards.findFirst({ where: eq(boards.slug, baseSlug) });
    if (existing) {
        // Solo añadimos sufijo aleatorio si hay colisión
        let candidate = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        // Aseguramos que el candidato con sufijo también sea único
        while (await db.query.boards.findFirst({ where: eq(boards.slug, candidate) })) {
            candidate = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        }
        slug = candidate;
    }

    await db.insert(boards).values({
        userId,
        name,
        slug,
    });

    revalidatePath('/dashboard');
}
