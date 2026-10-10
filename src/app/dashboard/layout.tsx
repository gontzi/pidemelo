import AdminSidebar from "@/components/navigation/AdminSidebar";
import BottomNav from "@/components/navigation/BottomNav";
import { getDictionary } from "@/i18n";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getDictionary();

    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            {/* Desktop Sidebar (Hidden on mobile) */}
            <div className="hidden lg:block">
                <AdminSidebar dict={t.navbar} />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col lg:pl-64 pb-nav lg:pb-0">
                <main className="flex-1">
                    {children}
                </main>

                {/* Mobile Navigation Bar */}
                <BottomNav dict={t} />
            </div>
        </div>
    );
}
