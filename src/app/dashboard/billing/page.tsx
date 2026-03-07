import { SubscriptionButton } from './SubscriptionButton'
import { Check, Sparkles, Rocket, PartyPopper, Heart, CreditCard, ExternalLink, ShieldCheck, Zap } from 'lucide-react'
import { auth } from "@clerk/nextjs/server";
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PricingSwitcher from './PricingSwitcher';
import { getDictionary } from '@/i18n';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Tu Plan | Pídemelo',
    description: 'Gestiona tu suscripción y sube de nivel.',
}

export default async function BillingPage() {
    const t = await getDictionary();
    const { userId } = auth();
    const lifetimeProductId = process.env.NEXT_PUBLIC_POLAR_LIFETIME_PRODUCT_ID || ''
    const subscriptionProductId = process.env.NEXT_PUBLIC_POLAR_SUBSCRIPTION_PRODUCT_ID || ''

    // Recuperamos el estado del usuario de la DB
    const userData = userId ? await db.query.users.findFirst({
        where: eq(users.id, userId)
    }) : null;

    const isPremium = userData?.isPremium || false;
    const plan = userData?.plan; // 'pro' o 'lifetime'

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-4 py-6 md:p-12 pt-24 md:pt-32">
            <div className="max-w-4xl mx-auto">

                {/* ESTADO 1: USUARIO PREMIUM (DETALLES) */}
                {isPremium ? (
                    <div className="space-y-8 md:space-y-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest animate-pulse">
                                <ShieldCheck className="w-4 h-4" />
                                {plan === 'lifetime' ? t.billing_page.plan_status_lifetime : t.billing_page.plan_status_pro}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                                {t.billing_page.title_thanks} <br /> <span className="text-[#FF5C00] italic">{t.billing_page.title_support}</span>
                            </h1>
                            <p className="text-zinc-500 text-base md:text-xl font-medium max-w-xl mx-auto">
                                {t.billing_page.subtitle_thanks_1} <span className="font-bold text-zinc-900 underline decoration-[#FF5C00]/30">Pídemelo</span> {t.billing_page.subtitle_thanks_2}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Card de Estado del Plan */}
                            <div className="md:col-span-2 p-6 md:p-8 rounded-[2rem] bg-zinc-900 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10">
                                    <Sparkles className="w-20 h-20 md:w-24 md:h-24" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#FF5C00] mb-5 flex items-center gap-2">
                                    <Zap className="w-4 h-4 fill-[#FF5C00]" />
                                    {t.billing_page.current_plan}
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-3xl md:text-4xl font-black italic tracking-tighter">
                                            {plan === 'lifetime' ? t.billing_page.plan_name_lifetime : t.billing_page.plan_name_pro}
                                        </p>
                                        <p className="text-zinc-400 font-medium mt-1 text-sm md:text-base">
                                            {plan === 'lifetime'
                                                ? t.billing_page.plan_desc_lifetime
                                                : t.billing_page.plan_desc_pro}
                                        </p>
                                    </div>

                                    <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.billing_page.payment_status_title}</p>
                                                <p className="text-sm font-bold text-green-400">{t.billing_page.payment_status_verified}</p>
                                            </div>
                                        </div>

                                        {plan === 'pro' && (
                                            <Link
                                                href={`https://polar.sh/${process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_SLUG || 'pidemelo'}/portal`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto justify-center"
                                            >
                                                {t.billing_page.manage_sub}
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card de Soporte VIP */}
                            <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-zinc-200/60 shadow-xl flex flex-col justify-center items-center text-center space-y-4">
                                <div className="h-14 w-14 md:h-16 md:w-16 rounded-3xl bg-orange-50 flex items-center justify-center">
                                    <Heart className="w-7 h-7 md:w-8 md:h-8 text-[#FF5C00] fill-[#FF5C00]/10" />
                                </div>
                                <h4 className="font-black text-xl italic tracking-tight leading-none">{t.billing_page.vip_member}</h4>
                                <p className="text-sm text-zinc-500 font-medium">{t.billing_page.vip_desc}</p>
                            </div>
                        </div>

                        {/* Extra para Lifetime */}
                        {plan === 'lifetime' && (
                            <div className="p-5 md:p-6 rounded-3xl bg-orange-50 border border-orange-100/50 text-center">
                                <p className="text-sm font-bold text-zinc-600">
                                    {t.billing_page.lifetime_extra} <span className="text-[#FF5C00]">{t.billing_page.lifetime_extra_highlight}</span>
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-10 md:mb-16 space-y-5 md:space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-[#FF5C00] text-xs font-black uppercase tracking-widest animate-bounce">
                                <Rocket className="w-4 h-4" />
                                {t.billing_page.free_status}
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 leading-none">
                                {t.billing_page.free_title_1} <br /> <span className="text-[#FF5C00] italic">{t.billing_page.free_title_2}</span>
                            </h1>
                            <p className="text-zinc-500 text-base md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                                {t.billing_page.free_subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-5xl mx-auto">
                            {/* Tarjeta 1: El del Montón (Free) */}
                            <div className="relative flex flex-col p-7 md:p-10 rounded-[2rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/20 opacity-80 hover:opacity-100 transition-all">
                                <div className="mb-8">
                                    <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2 italic text-zinc-400">{t.billing_page.free_card_title}</h3>
                                    <p className="text-zinc-300 text-[10px] font-black uppercase tracking-widest">{t.billing_page.free_card_subtitle}</p>
                                </div>

                                <div className="flex items-baseline mb-8">
                                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-300">0€</span>
                                    <span className="text-zinc-300 font-bold ml-2 uppercase tracking-widest text-sm">{t.billing_page.free_price_suffix}</span>
                                </div>

                                <div className="space-y-4 mb-10 flex-grow">
                                    {[
                                        { text: t.billing_page.free_feat_1, limit: true },
                                        { text: t.billing_page.free_feat_2, limit: true },
                                        { text: t.billing_page.free_feat_3, limit: true },
                                        { text: t.billing_page.free_feat_4, limit: true },
                                        { text: t.billing_page.free_feat_5, limit: false },
                                    ].map((feat, i) => (
                                        <div key={i} className={`flex items-start gap-3 font-medium ${feat.limit ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            <Check className={`w-5 h-5 shrink-0 mt-0.5 ${feat.limit ? 'text-zinc-200' : 'text-green-500'}`} />
                                            <span className="text-sm md:text-base">{feat.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="ghost" disabled className="h-14 rounded-2xl bg-zinc-50 text-zinc-400 font-black text-xs tracking-widest uppercase cursor-not-allowed">
                                    {t.billing_page.free_btn}
                                </Button>
                            </div>

                            {/* Tarjeta 2: Premium (Switcher) */}
                            <PricingSwitcher
                                monthlyProductId={subscriptionProductId}
                                lifetimeProductId={lifetimeProductId}
                                dict={t.pricing_switcher}
                                currentPlan={plan}
                                isPremium={isPremium}
                            />
                        </div>
                    </>
                )}

                <div className="mt-10 md:mt-16 text-center">
                    <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        {t.billing_page.footer_made} <Heart className="w-4 h-4 fill-[#FF5C00] text-[#FF5C00]" /> {t.billing_page.footer_by}
                    </p>
                </div>
            </div>
        </div>
    )
}
