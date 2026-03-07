'use client';

import { useState } from 'react';
import { Check, Sparkles, PartyPopper } from 'lucide-react';
import { SubscriptionButton } from './SubscriptionButton';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

interface PricingSwitcherProps {
    monthlyProductId: string;
    lifetimeProductId: string;
    dict: Record<string, string>;
    currentPlan?: string | null;
    isPremium?: boolean;
}

export default function PricingSwitcher({ monthlyProductId, lifetimeProductId, dict, currentPlan, isPremium }: PricingSwitcherProps) {
    const [plan, setPlan] = useState<'monthly' | 'lifetime'>(currentPlan === 'lifetime' ? 'lifetime' : 'monthly');

    const isCurrentPlan = (p: 'monthly' | 'lifetime') => {
        if (!isPremium) return false;
        return p === currentPlan;
    };

    const features = [
        dict.feat_1,
        dict.feat_2,
        dict.feat_3,
        dict.feat_4,
        dict.feat_5
    ];

    return (
        <div className="relative flex flex-col p-7 md:p-10 rounded-[2rem] bg-zinc-900 text-white shadow-2xl shadow-orange-500/20 transition-all overflow-hidden border border-white/5">
            {/* Adorno visual */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FF5C00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center mb-10 relative space-y-8">
                {/* 1. Notificación arriba */}
                <div>
                    <div className="bg-[#FF5C00] text-white text-[10px] md:text-[11px] font-black px-4 py-2 rounded-xl inline-block tracking-widest uppercase shadow-lg shadow-[#FF5C00]/20">
                        {dict.pill}
                    </div>
                </div>

                {/* 2. Selector debajo */}
                <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] w-fit border border-white/5 relative">
                    <button
                        onClick={() => setPlan('monthly')}
                        className={`relative px-6 py-3 rounded-xl text-xs font-black tracking-tight transition-all ${plan === 'monthly' ? 'bg-zinc-800 text-zinc-400 border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {dict.monthly}
                        {isCurrentPlan('monthly') && (
                            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-lg">TU PLAN</span>
                        )}
                    </button>
                    <button
                        onClick={() => setPlan('lifetime')}
                        className={`relative px-6 py-3 rounded-xl text-xs font-black tracking-tight transition-all flex items-center gap-2 ${plan === 'lifetime' ? 'bg-[#FF5C00] text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {dict.lifetime}
                        <span role="img" aria-label="fire" className="text-sm">🔥</span>
                        {isCurrentPlan('lifetime') && (
                            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-lg">TU PLAN</span>
                        )}
                    </button>
                </div>

                {/* 3. Título y subtítulo debajo */}
                <div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic leading-none">{dict.premium_title}</h3>
                    <p className="text-zinc-500 text-xs md:text-sm font-black uppercase tracking-[0.2em]">{dict.premium_subtitle}</p>
                </div>
            </div>

            <div className="flex items-baseline mb-8">
                <span className="text-5xl md:text-7xl font-black tracking-tighter">
                    {plan === 'monthly' ? '2,99€' : '29,95€'}
                </span>
                <span className="text-zinc-500 font-bold ml-2 text-sm uppercase tracking-widest">
                    {plan === 'monthly' ? dict.monthly_suffix : dict.lifetime_suffix}
                </span>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-zinc-300 font-medium">
                        {plan === 'lifetime' ? (
                            <PartyPopper className="w-5 h-5 text-[#FF5C00] shrink-0 mt-0.5" />
                        ) : (
                            <Check className="w-5 h-5 text-[#FF5C00] shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm md:text-base">{feature}</span>
                    </div>
                ))}
            </div>

            <SignedIn>
                {isCurrentPlan(plan) ? (
                    <Button disabled className="w-full h-14 rounded-2xl bg-zinc-800 text-zinc-500 font-bold text-sm tracking-widest uppercase cursor-not-allowed">
                        {dict.current_plan || "Tu plan actual"}
                    </Button>
                ) : (currentPlan === 'lifetime' && plan === 'monthly') ? (
                    <Button disabled className="w-full h-14 rounded-2xl bg-zinc-800 text-zinc-500 font-bold text-sm tracking-widest uppercase cursor-not-allowed">
                        Completado ✅
                    </Button>
                ) : (
                    <SubscriptionButton
                        productId={plan === 'monthly' ? monthlyProductId : lifetimeProductId}
                        label={plan === 'monthly' ? dict.btn_monthly : dict.btn_lifetime}
                    />
                )}
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button className="w-full h-14 rounded-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-lg shadow-orange-500/20 font-bold text-sm tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {plan === 'monthly' ? dict.btn_monthly : dict.btn_lifetime}
                    </Button>
                </SignInButton>
            </SignedOut>

            {plan === 'monthly' && (
                <p className="text-center text-[10px] text-zinc-500 font-bold mt-4 uppercase tracking-[0.2em]">
                    {dict.monthly_desc}
                </p>
            )}
            {plan === 'lifetime' && (
                <p className="text-center text-[10px] text-[#FF5C00] font-black mt-4 uppercase tracking-[0.2em] animate-pulse">
                    {dict.lifetime_desc}
                </p>
            )}
        </div>
    );
}
