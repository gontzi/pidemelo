import type { Metadata } from 'next';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';
import { getDictionary } from '@/i18n';
import PricingWrapper from '@/components/landing/PricingWrapper';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tablón de feedback y sugerencias para creadores y SaaS',
  description:
    'Recoge el feedback de tu comunidad, gestiona sugerencias y publica tu roadmap público sin complicaciones. La herramienta de feedback definitiva para creadores y SaaS independientes.',
  alternates: {
    canonical: 'https://pidemelo.app',
  },
}

export default async function Home() {
  const t = await getDictionary();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center overflow-hidden relative pt-28 md:pt-36">
        {/* Fondo de puntitos */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-4xl space-y-8 md:space-y-12 z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-xs md:text-sm font-bold text-zinc-600 shadow-sm transition-transform hover:rotate-1 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5C00] animate-pulse flex-shrink-0"></span>
            {t.landing.tagline}
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-zinc-900 leading-[0.95]">
            {t.landing.title_start} <br />
            <span className="text-[#FF5C00]">{t.landing.title_highlight}</span> {t.landing.title_end}
          </h1>

          <p className="text-base md:text-xl text-zinc-600 max-w-2xl mx-auto font-bold leading-tight px-2">
            {t.landing.subtitle}
          </p>

          <div className="pt-2 flex flex-col items-center gap-5">
            <SignedOut>
              <SignInButton mode="modal" signUpFallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <Button size="lg" className="h-16 md:h-20 px-8 md:px-12 text-lg md:text-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-2xl shadow-[#FF5C00]/30 rounded-full font-black transition-all hover:scale-110 active:scale-95 w-full sm:w-auto">
                  {t.landing.btn_get_started}
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-16 md:h-20 px-8 md:px-12 text-lg md:text-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-2xl shadow-[#FF5C00]/30 rounded-full font-black transition-all hover:scale-110 active:scale-95">
                  {t.landing.btn_dashboard}
                </Button>
              </Link>
            </SignedIn>

            <p className="text-xs text-zinc-400 font-medium italic opacity-60">
              {t.landing.quote}
            </p>
          </div>
        </div>

        {/* Sección de Beneficios */}
        <section id="que-es" aria-labelledby="beneficios-heading" className="mt-24 md:mt-48 max-w-5xl w-full text-left pb-16 md:pb-32">
          <h2 id="beneficios-heading" className="sr-only">{t.landing.features_sr}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="p-6 md:p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-4 hover:shadow-xl transition-shadow">
              <div className="text-3xl text-[#FF5C00]" aria-hidden="true">🤫</div>
              <h3 className="text-lg md:text-xl font-bold">{t.landing.feature1_title}</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">{t.landing.feature1_desc}</p>
            </div>
            <div className="p-6 md:p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-4 hover:shadow-xl transition-shadow md:rotate-1">
              <div className="text-3xl text-[#FF5C00]" aria-hidden="true">🗳️</div>
              <h3 className="text-lg md:text-xl font-bold">{t.landing.feature2_title}</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">{t.landing.feature2_desc}</p>
            </div>
            <div className="p-6 md:p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-4 hover:shadow-xl transition-shadow sm:col-span-2 md:col-span-1 md:-rotate-1">
              <div className="text-3xl text-[#FF5C00]" aria-hidden="true">⚡</div>
              <h3 className="text-lg md:text-xl font-bold">{t.landing.feature3_title}</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">{t.landing.feature3_desc}</p>
            </div>
          </div>
        </section>

        {/* Sección de Feedback en Vivo */}
        <section id="demo" className="w-full max-w-5xl mx-auto py-16 md:py-24 px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-zinc-900">
              {t.landing.demo_title}
            </h2>
            <p className="text-zinc-500 font-medium text-base md:text-lg max-w-2xl mx-auto">
              {t.landing.demo_desc}
            </p>
          </div>
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-2 sm:p-4">
            <iframe
              src="https://pidemelo.app/widget/pidemelo?color=%23FF5C00&textColor=%2318181b&darkMode=false"
              width="100%"
              height="600px"
              frameBorder="0"
              loading="lazy"
              title="Feedback Board Widget"
              className="rounded-[1.5rem] md:rounded-[2rem] w-full"
            ></iframe>
          </div>
        </section>

        {/* Sección de Precios */}
        <section id="precios" className="w-full max-w-5xl mx-auto py-16 md:py-32 px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-20 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
              {t.billing_page.free_title_1} <br /> <span className="text-[#FF5C00] italic">{t.billing_page.free_title_2}</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
              {t.billing_page.free_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-5xl mx-auto text-left">
            {/* Tarjeta 1: Free */}
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
                    <span className="text-zinc-200 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    <span className="text-sm md:text-base">{feat.text}</span>
                  </div>
                ))}
              </div>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="h-14 rounded-2xl bg-zinc-100 text-zinc-400 font-black text-xs tracking-widest uppercase w-full">
                    {t.navbar.start_now}
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="w-full">
                  <Button className="h-14 rounded-2xl bg-zinc-100 text-zinc-400 font-black text-xs tracking-widest uppercase w-full">
                    {t.navbar.dashboard}
                  </Button>
                </Link>
              </SignedIn>
            </div>

            {/* Tarjeta 2: Reusamos el componente de Precios cargado dinámicamente con streaming */}
            <Suspense fallback={<div className="h-[500px] w-full bg-zinc-100 animate-pulse rounded-[2rem]" />}>
              <PricingWrapper t={t} />
            </Suspense>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="max-w-3xl w-full text-left py-12 md:py-20 font-sans">
          <h2 id="faq-heading" className="text-2xl md:text-3xl font-heading font-black mb-8 md:mb-10 tracking-tight">{t.landing.faq_title}</h2>
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-zinc-100">
              <h3 className="font-bold text-base md:text-lg mb-2">{t.landing.faq1_q}</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">{t.landing.faq1_a}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-zinc-100">
              <h3 className="font-bold text-base md:text-lg mb-2">{t.landing.faq2_q}</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">{t.landing.faq2_a}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-zinc-100">
              <h3 className="font-bold text-base md:text-lg mb-2">{t.landing.faq3_q}</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">{t.landing.faq3_a}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 md:py-10 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold opacity-50">
          <span>pidemelo<span className="text-[#FF5C00]">.</span>app</span>
          <p className="text-center text-xs">
            {t.landing.footer_made} <a href="https://ka0s.site/me" target="_blank" className="text-[#FF5C00]">Gontzi</a> de <a href="https://tunuevosoftware.com" target="_blank" className="text-[#ffd400]">TuNuevoSoftware</a>
          </p>
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}


