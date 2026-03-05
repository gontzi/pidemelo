import { SubscriptionButton } from './SubscriptionButton'
import { Check, Sparkles, Rocket, PartyPopper, Heart, CreditCard, ExternalLink, ShieldCheck, Zap } from 'lucide-react'
import { auth } from "@clerk/nextjs/server";
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Tu Plan | Pídemelo',
    description: 'Gestiona tu suscripción y sube de nivel.',
}

export default async function BillingPage() {
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
        <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12 pt-32">
            <div className="max-w-4xl mx-auto">

                {/* ESTADO 1: USUARIO PREMIUM (DETALLES) */}
                {isPremium ? (
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest animate-pulse">
                                <ShieldCheck className="w-4 h-4" />
                                {plan === 'lifetime' ? 'Acceso Vitalicio Activado' : 'Suscripción Pro Activa'}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                                ¡Gracias por <br /> <span className="text-[#FF5C00] italic">apoyarnos!</span>
                            </h1>
                            <p className="text-zinc-500 text-xl font-medium max-w-xl mx-auto">
                                Eres parte del 1% de mentes inquietas que hacen que <span className="font-bold text-zinc-900 underline decoration-[#FF5C00]/30">Pídemelo</span> siga vivo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card de Estado del Plan */}
                            <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-zinc-900 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles className="w-24 h-24" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#FF5C00] mb-6 flex items-center gap-2">
                                    <Zap className="w-4 h-4 fill-[#FF5C00]" />
                                    Tu Plan Actual
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-4xl font-black italic tracking-tighter">
                                            {plan === 'lifetime' ? 'El Inversor 🔥' : 'El Suscriptor 🚀'}
                                        </p>
                                        <p className="text-zinc-400 font-medium mt-1">
                                            {plan === 'lifetime'
                                                ? 'Acceso infinito para toda la eternidad.'
                                                : 'Acceso a todas las funciones premium de forma recurrente.'}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Estado de pago</p>
                                                <p className="text-sm font-bold text-green-400">Verificado ✅</p>
                                            </div>
                                        </div>

                                        {/* Link de gestión (para Pro) */}
                                        {plan === 'pro' && (
                                            <Link
                                                href={`https://polar.sh/${process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_SLUG || 'pidemelo'}/portal`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                                            >
                                                Gestionar suscripción
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card de Soporte VIP */}
                            <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200/60 shadow-xl flex flex-col justify-center items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-3xl bg-orange-50 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-[#FF5C00] fill-[#FF5C00]/10" />
                                </div>
                                <h4 className="font-black text-xl italic tracking-tight leading-none">Miembro VIP</h4>
                                <p className="text-sm text-zinc-500 font-medium">Tienes pase preferente para sugerir mejoras y arreglos.</p>
                            </div>
                        </div>

                        {/* Extra para Lifetime */}
                        {plan === 'lifetime' && (
                            <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100/50 text-center">
                                <p className="text-sm font-bold text-zinc-600">
                                    No tienes pagos pendientes. <span className="text-[#FF5C00]">Pídemelo es tuyo para siempre.</span>
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ESTADO 2: USUARIO GRATIS (PLANES) */
                    <>
                        <div className="text-center mb-16 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-[#FF5C00] text-xs font-black uppercase tracking-widest animate-bounce">
                                <Rocket className="w-4 h-4" />
                                Planazo a la vista
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 leading-none">
                                Deja de ser un <br /> <span className="text-[#FF5C00] italic">usuario del montón</span>
                            </h1>
                            <p className="text-zinc-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                                Elige cómo quieres apoyarnos para que sigamos haciendo caso a tus ideas. O no, tú verás.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                            {/* Tarjeta 1: El Suscriptor */}
                            <div className="relative flex flex-col p-10 rounded-[2.5rem] bg-white border border-zinc-200/60 shadow-xl shadow-zinc-200/20 transition-all hover:scale-[1.02]">
                                <div className="absolute -top-4 right-8 bg-[#FF5C00] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 tracking-widest uppercase">
                                    <Sparkles className="w-3 h-3" />
                                    ¡15 días gratis!
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-black tracking-tight mb-2 italic">El Suscriptor</h3>
                                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Para los que van paso a paso</p>
                                </div>

                                <div className="flex items-baseline mb-8">
                                    <span className="text-6xl font-black tracking-tighter">2,99€</span>
                                    <span className="text-zinc-400 font-bold ml-2">/mes</span>
                                </div>

                                <div className="space-y-4 mb-10 flex-grow">
                                    {[
                                        "Acceso a todo (sin filtros)",
                                        "Si no te mola, cancelas y tan amigos",
                                        "Danos la chapa con tus ideas",
                                        "Soporte rápido (si no estamos durmiendo)"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 text-zinc-600 font-medium">
                                            <Check className="w-5 h-5 text-[#FF5C00] shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <SubscriptionButton
                                    productId={subscriptionProductId}
                                    label="Probar 15 días gratis 🏃‍♂️"
                                    variant="outline"
                                />
                            </div>

                            {/* Tarjeta 2: El Inversor (Lifetime) */}
                            <div className="relative flex flex-col p-10 rounded-[2.5rem] bg-zinc-900 text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-[1.02] overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FF5C00]/10 rounded-full blur-3xl" />

                                <div className="mb-8 relative">
                                    <div className="bg-[#FF5C00] text-white text-[10px] font-black px-3 py-1 rounded-md mb-4 inline-block tracking-widest uppercase">
                                        LO MÁS TOP
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight mb-2 italic">El Inversor</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Pagas una vez y te olvidas</p>
                                </div>

                                <div className="flex items-baseline mb-8">
                                    <span className="text-6xl font-black tracking-tighter">29,95€</span>
                                    <span className="text-zinc-500 font-bold ml-2 text-sm uppercase tracking-widest">Único pago</span>
                                </div>

                                <div className="space-y-4 mb-10 flex-grow">
                                    {[
                                        "Pagas una vez, te aguantamos toda la vida",
                                        "Acceso premium infinito",
                                        "Eres el VIP del tablón",
                                        "Todas las locuras que saquemos",
                                        "Icono de inversor (próximamente™)"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 text-zinc-300 font-medium">
                                            <PartyPopper className="w-5 h-5 text-[#FF5C00] shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <SubscriptionButton
                                    productId={lifetimeProductId}
                                    label="Soltar la pasta una vez 💸"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-16 text-center">
                    <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        Hecho con <Heart className="w-4 h-4 fill-[#FF5C00] text-[#FF5C00]" /> por el equipo de Pídemelo
                    </p>
                </div>
            </div>
        </div>
    )
}

