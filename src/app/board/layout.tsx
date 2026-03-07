import React from "react";
import PublicHeader from "@/components/navigation/PublicHeader";
import { getDictionary } from "@/i18n";

export default async function BoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getDictionary();

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <PublicHeader dict={t.navbar} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
