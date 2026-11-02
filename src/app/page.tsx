import type { Metadata } from 'next';
import { ShieldCheck, Vote, Zap, Coffee, Heart } from 'lucide-react';
import { getDictionary, getLocale } from '@/i18n';
import WidgetSkeleton from '@/components/WidgetSkeleton';
import LandingAuthCta from '@/components/LandingAuthCta';
import { Card } from '@/components/ui/card';

import JsonLd from '@/components/JsonLd';

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

  const features = [
    { icon: ShieldCheck, title: t.landing.feature1_title, desc: t.landing.feature1_desc, chip: 'bg-[#FFF0E8] text-[#FF5C00]' },
    { icon: Vote, title: t.landing.feature2_title, desc: t.landing.feature2_desc, chip: 'bg-[#FDECEB] text-[#EA655F]' },
    { icon: Zap, title: t.landing.feature3_title, desc: t.landing.feature3_desc, chip: 'bg-mint text-[#2F7457]' },
  ];

  return (
    <>
      <JsonLd schema={softwareSchema} />
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center overflow-hidden relative pt-24 md:pt-32">
        <div className="max-w-3xl space-y-7 md:space-y-8 z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border text-xs md:text-sm font-semibold text-muted-foreground shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
            {t.landing.tagline}
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.02] text-balance">
            {t.landing.title_start} <br />
            <span className="text-[#FF5C00]">{t.landing.title_highlight}</span> {t.landing.title_end}
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed px-2">
            {t.landing.subtitle}
          </p>

          <div className="pt-1 flex flex-col items-center gap-4">
            <LandingAuthCta signInLabel={t.landing.btn_get_started} dashboardLabel={t.landing.btn_dashboard} />

            <p className="text-xs text-muted-foreground/80 font-medium italic">
              {t.landing.quote}
            </p>
          </div>
        </div>

        {/* Sección de Beneficios */}
        <section id="que-es" aria-labelledby="beneficios-heading" className="mt-16 md:mt-36 max-w-5xl w-full text-left pb-16 md:pb-24">
          <h2 id="beneficios-heading" className="sr-only">{t.landing.features_sr}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Card
                key={i}
                className="p-6 space-y-4 transition-shadow hover:shadow-card sm:last:col-span-2 md:last:col-span-1"
              >
                <div className={`w-11 h-11 rounded-lg grid place-items-center ${f.chip}`}>
                  <f.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Sección de Feedback en Vivo */}
        <section id="demo" className="w-full max-w-5xl mx-auto py-14 md:py-20 px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-10 space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
              {t.landing.demo_title}
            </h2>
            <p className="text-muted-foreground font-medium text-base md:text-lg max-w-2xl mx-auto">
              {t.landing.demo_desc}
            </p>
          </div>
          <Card className="rounded-xl p-1.5 sm:p-2 overflow-hidden relative">
            <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
              <WidgetSkeleton variant="form" />
            </div>
            <iframe
              src={`https://pidemelo.app/widget/form/pidemelo?color=%23FF5C00&textColor=%23151B35&darkMode=false&lang=${locale}`}
              width="100%"
              height="820px"
              frameBorder="0"
              loading="lazy"
              title="Feedback Board Widget"
              className="rounded-lg w-full block relative z-10 h-[70dvh] min-h-[560px] md:h-[820px]"
              style={{ overflow: 'hidden' }}
            ></iframe>
          </Card>
        </section>


        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="max-w-3xl w-full text-left py-12 md:py-20">
          <h2 id="faq-heading" className="text-2xl md:text-3xl font-heading font-bold mb-8 md:mb-10 tracking-tight text-foreground">{t.landing.faq_title}</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-heading font-bold text-base md:text-lg mb-2">{t.landing.faq1_q}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{t.landing.faq1_a}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-heading font-bold text-base md:text-lg mb-2">{t.landing.faq2_q}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{t.landing.faq2_a}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-heading font-bold text-base md:text-lg mb-2">{t.landing.faq3_q}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{t.landing.faq3_a}</p>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-8 md:py-12 border-t border-border flex flex-col items-center gap-6">
        <a
          href="https://buymeacoffee.com/gontzi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 h-10 border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Coffee className="w-4 h-4" aria-hidden="true" /> {t.common.support_project}
        </a>
        <div className="max-w-5xl mx-auto w-full px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-semibold text-muted-foreground">
          <span className="font-heading">pidemelo<span className="text-[#FF5C00]">.</span>app</span>
          <p className="text-center text-xs inline-flex items-center gap-1 flex-wrap justify-center">
            {t.landing.footer_made} <a href="https://ka0s.site/me" target="_blank" className="text-primary hover:underline">Gontzi</a> <Heart className="w-3 h-3 text-[#EA655F]" aria-hidden="true" /> <a href="https://tunuevosoftware.com" target="_blank" className="text-primary hover:underline">TuNuevoSoftware</a>
          </p>
          <p className="text-xs text-muted-foreground/80">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}
