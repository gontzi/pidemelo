'use server'

import { db } from "@/db";
import { boards, users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { slugify, randomSuffix } from "@/lib/feedback";

export async function createBoard(formData: FormData) {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    if (!name || !name.trim()) return;

    // Aseguramos que la fila del usuario existe (FK de boards.user_id).
    // Antes lo hacía el layout del dashboard en cada render; ahora solo al crear un tablero.
    let email: string | undefined;
    let displayName: string | undefined;
    try {
        const user = await currentUser();
        email = user?.emailAddresses[0]?.emailAddress;
        displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "";
    } catch (e) {
        console.log("No se pudo obtener datos del usuario en createBoard:", e instanceof Error ? e.message : String(e));
    }

    await db.insert(users).values({
        id: userId,
        email,
        name: displayName,
        updatedAt: new Date(),
    }).onConflictDoUpdate({
        target: users.id,
        set: {
            email,
            name: displayName,
            updatedAt: new Date(),
        }
    });

    // Slug seguro: si el nombre no genera uno válido, usamos uno con sufijo aleatorio
    const baseSlug = slugify(name) || `board-${randomSuffix()}`;

    // Comprobar si el slug limpio ya existe en la BBDD
    let slug = baseSlug;
    const existing = await db.query.boards.findFirst({ where: eq(boards.slug, baseSlug) });
    if (existing || slug.length < 2) {
        // Solo añadimos sufijo aleatorio si hay colisión
        let candidate = `${baseSlug}-${randomSuffix()}`;
        // Aseguramos que el candidato con sufijo también sea único
        while (await db.query.boards.findFirst({ where: eq(boards.slug, candidate) })) {
            candidate = `${baseSlug}-${randomSuffix()}`;
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