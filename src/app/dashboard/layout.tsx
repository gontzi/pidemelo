import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (user) {
        // Sincronizamos el usuario en la base de datos si no existe
        // Esto se ejecuta en cada carga del dashboard, asegurando que el usuario esté presente
        try {
            const email = user.emailAddresses[0]?.emailAddress;
            const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "";

            await db.insert(users).values({
                id: user.id,
                email,
                name,
                updatedAt: new Date(),
            }).onConflictDoUpdate({
                target: users.id,
                set: {
                    email,
                    name,
                    updatedAt: new Date(),
                }
            });
        } catch (error) {
            console.error("Error syncing user to database:", error);
        }
    }

    return (
        <main>
            {children}
        </main>
    );
}
