import React from "react";
import Navbar from '@/components/Navbar'
import { getDictionary } from "@/i18n";

export default async function BoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getDictionary();

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <Navbar dict={t.navbar} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
