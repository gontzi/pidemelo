import type { Metadata } from 'next';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';
import { getDictionary, getLocale } from '@/i18n';
import WidgetSkeleton from '@/components/WidgetSkeleton';

import JsonLd from '@/components/JsonLd';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.seo.title,
    description: t.seo.description,
    keywords: t.seo.keywords,
    alternates: {
      canonical: 'https://pidemelo.app',
      languages: {
        'es': 'https://pidemelo.app/?lang=es',
        'en': 'https://pidemelo.app/?lang=en',
        'x-default': 'https://pidemelo.app',
      }
    },
  }
}

export default async function Home() {
  const t = await getDictionary();
  const locale = await getLocale();

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pídemelo",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": t.seo.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  return (
    <>
      <JsonLd schema={softwareSchema} />
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
        <section id="que-es" aria-labelledby="beneficios-heading" className="mt-16 md:mt-48 max-w-5xl w-full text-left pb-16 md:pb-32">
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
          <div className="bg-white rounded-[2.2rem] md:rounded-[3rem] border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-1 sm:p-2 overflow-hidden relative">
            <div className="absolute inset-0 z-0">
              <WidgetSkeleton />
            </div>
            <iframe
              src={`https://pidemelo.app/widget/form/pidemelo?color=%23FF5C00&textColor=%2318181b&darkMode=false&lang=${locale}`}
              width="100%"
              height="820px"
              frameBorder="0"
              loading="lazy"
              title="Feedback Board Widget"
              className="rounded-[1.5rem] md:rounded-[2.2rem] w-full block relative z-10 h-[70dvh] min-h-[560px] md:h-[820px]"
              style={{ overflow: 'hidden' }}
            ></iframe>
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

      <footer className="py-8 md:py-12 border-t border-zinc-100 flex flex-col items-center gap-6">
        <a 
          href="https://buymeacoffee.com/gontzi" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5C00] hover:bg-[#E65300] text-white font-bold text-sm rounded-md transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          ☕ {t.common.support_project}
        </a>
        <div className="max-w-5xl mx-auto w-full px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold opacity-50">
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


