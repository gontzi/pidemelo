import { UserProfile } from "@clerk/nextjs";
import { getDictionary } from "@/i18n";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const t = await getDictionary();

    return (
        <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:p-12 pt-24 md:pt-32">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-none">
                        {t.navbar.profile}
                    </h1>
                </header>

                <div className="flex justify-center">
                    <UserProfile
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "rounded-[2rem] border border-zinc-200/60 shadow-xl shadow-zinc-200/10 bg-white w-full",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
