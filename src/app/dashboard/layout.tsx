import DashboardHeader from "@/components/navigation/DashboardHeader";
import { getDictionary } from "@/i18n";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getDictionary();

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader dict={t.navbar} />
            <main className="flex-1 pb-safe">{children}</main>
        </div>
    );
}
