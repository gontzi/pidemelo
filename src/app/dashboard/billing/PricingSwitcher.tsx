'use client';

import { useState } from 'react';
import { Check, Sparkles, PartyPopper } from 'lucide-react';
import { SubscriptionButton } from './SubscriptionButton';

interface PricingSwitcherProps {
    monthlyProductId: string;
    lifetimeProductId: string;
}

export default function PricingSwitcher({ monthlyProductId, lifetimeProductId }: PricingSwitcherProps) {
    const [plan, setPlan] = useState<'monthly' | 'lifetime'>('monthly');

    const features = [
        "Pide todos los tablones que quieras (infinitos)",
        "Widgets tuneables a tu gusto",
        "Inserta tu tablón en cualquier web (iFrame)",
        "Soporte rápido (prioridad absoluta)",
        "Todas las locuras que saquemos nuevas"
    ];

    return (
        <div className="relative flex flex-col p-7 md:p-10 rounded-[2rem] bg-zinc-900 text-white shadow-2xl shadow-orange-500/20 transition-all overflow-hidden border border-white/5">
            {/* Adorno visual */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FF5C00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center mb-10 relative space-y-8">
                {/* 1. Notificación arriba */}
                <div>
                    <div className="bg-[#FF5C00] text-white text-[10px] md:text-[11px] font-black px-4 py-2 rounded-xl inline-block tracking-widest uppercase shadow-lg shadow-[#FF5C00]/20">
                        VITALICIO O MENSUAL, TÚ MANDAS
                    </div>
                </div>

                {/* 2. Selector debajo */}
                <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] w-fit border border-white/5">
                    <button
                        onClick={() => setPlan('monthly')}
                        className={`px-6 py-3 rounded-xl text-xs font-black tracking-tight transition-all ${plan === 'monthly' ? 'bg-zinc-800 text-zinc-400 border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        MENSUAL
                    </button>
                    <button
                        onClick={() => setPlan('lifetime')}
                        className={`px-6 py-3 rounded-xl text-xs font-black tracking-tight transition-all flex items-center gap-2 ${plan === 'lifetime' ? 'bg-[#FF5C00] text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        LIFETIME
                        <span role="img" aria-label="fire" className="text-sm">🔥</span>
                    </button>
                </div>

                {/* 3. Título y subtítulo debajo */}
                <div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic leading-none">El Premium</h3>
                    <p className="text-zinc-500 text-xs md:text-sm font-black uppercase tracking-[0.2em]">Para los que van en serio</p>
                </div>
            </div>

            <div className="flex items-baseline mb-8">
                <span className="text-5xl md:text-7xl font-black tracking-tighter">
                    {plan === 'monthly' ? '2,99€' : '29,95€'}
                </span>
                <span className="text-zinc-500 font-bold ml-2 text-sm uppercase tracking-widest">
                    {plan === 'monthly' ? '/mes' : 'Único pago'}
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

            <SubscriptionButton
                productId={plan === 'monthly' ? monthlyProductId : lifetimeProductId}
                label={plan === 'monthly' ? 'Probar 15 días gratis 🏃‍♂️' : 'Soltar la pasta una vez 💸'}
            />

            {plan === 'monthly' && (
                <p className="text-center text-[10px] text-zinc-500 font-bold mt-4 uppercase tracking-[0.2em]">
                    Cancela cuando quieras. Sin dramas.
                </p>
            )}
            {plan === 'lifetime' && (
                <p className="text-center text-[10px] text-[#FF5C00] font-black mt-4 uppercase tracking-[0.2em] animate-pulse">
                    Acceso para toda la eternidad
                </p>
            )}
        </div>
    );
}
