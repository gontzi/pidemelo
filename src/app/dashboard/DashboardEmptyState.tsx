'use client';

import { Button } from "@/components/ui/button";

interface DashboardEmptyStateProps {
    dict: {
        empty_title: string;
        empty_subtitle: string;
        create_first_btn: string;
    };
}

export default function DashboardEmptyState({ dict }: DashboardEmptyStateProps) {
    const handleFocusInput = () => {
        const input = document.getElementById('name');
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-zinc-50/50 rounded-[3rem] border border-dashed border-zinc-200">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-8 border border-zinc-100 transform -rotate-6">
                🏜️
            </div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 mb-2">
                {dict.empty_title}
            </h3>
            <p className="text-zinc-500 font-medium max-w-xs mx-auto mb-8">
                {dict.empty_subtitle}
            </p>
            <Button 
                variant="outline" 
                className="rounded-full border-zinc-200 font-black text-[10px] uppercase tracking-widest hover:bg-white px-8 transition-transform active:scale-95"
                onClick={handleFocusInput}
            >
                {dict.create_first_btn}
            </Button>
        </div>
    );
}
