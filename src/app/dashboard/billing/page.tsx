import { SubscriptionButton } from './SubscriptionButton'
import { Check, Sparkles, Rocket, PartyPopper, Heart } from 'lucide-react'

export const metadata = {
    title: 'Sube de nivel | Pidemelo',
    description: 'Elige cómo quieres apoyarnos para que sigamos haciendo caso a tus ideas.',
}

export default function BillingPage() {
    const lifetimeProductId = process.env.NEXT_PUBLIC_POLAR_LIFETIME_PRODUCT_ID || ''
    const subscriptionProductId = process.env.NEXT_PUBLIC_POLAR_SUBSCRIPTION_PRODUCT_ID || ''

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12 pt-32">
            <div className="max-w-4xl mx-auto">
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
                            ¡15 días de gratis!
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

                <div className="mt-16 text-center">
                    <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        Hecho con <Heart className="w-4 h-4 fill-[#FF5C00] text-[#FF5C00]" /> por el equipo de Pidemelo
                    </p>
                </div>
            </div>
        </div>
    )
}
