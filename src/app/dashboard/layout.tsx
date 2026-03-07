import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import AdminHeader from "@/components/navigation/AdminHeader";
import { getDictionary } from "@/i18n";

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

    const t = await getDictionary();

    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            {/* Desktop Sidebar */}
            <AdminSidebar dict={t.navbar} />

            {/* Main Content Wrapper (offset for desktop sidebar) */}
            <div className="flex-1 flex flex-col md:pl-64">
                {/* Mobile Header */}
                <AdminHeader dict={t.navbar} />

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
