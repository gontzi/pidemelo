import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import AdminHeader from "@/components/navigation/AdminHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { getDictionary } from "@/i18n";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (user) {
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
            {/* Desktop Sidebar (Hidden on mobile) */}
            <div className="hidden lg:block">
                <AdminSidebar dict={t.navbar} />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col lg:pl-64 pb-32 lg:pb-0">
                {/* Mobile Header (Hidden as we use BottomNav, but keeping if needed for something else, though the request says hide it) */}
                <div className="lg:hidden">
                    {/* <AdminHeader dict={t.navbar} /> */}
                </div>

                <main className="flex-1">
                    {children}
                </main>

                {/* Mobile Navigation Bar */}
                <BottomNav dict={t} />
            </div>
        </div>
    );
}
