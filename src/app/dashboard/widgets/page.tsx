import { db } from "@/db";
import { boards, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import WidgetsClient from "./WidgetsClient";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function WidgetsPage() {
    const { userId } = auth();
    if (!userId) redirect("/");

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    const userBoards = await db.query.boards.findMany({
        where: eq(boards.userId, userId),
        orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });

    return (
        <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:p-12 pt-24 md:pt-32">
            <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
                <header className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-none">Widgets Pro</h1>
                    <p className="text-zinc-500 font-bold text-base md:text-lg max-w-2xl">
                        Personaliza e incrusta tus tablones de feedback en cualquier sitio web. Haz que parezca parte de tu marca.
                    </p>
                </header>

                <WidgetsClient
                    boards={userBoards}
                    isPremium={user?.isPremium || false}
                />
            </div>
        </div>
    );
}
