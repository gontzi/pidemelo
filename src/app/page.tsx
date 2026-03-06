import type { Metadata } from 'next'
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Metadata específica para la Landing (hereda el template de layout.tsx)
export const metadata: Metadata = {
  title: 'Tablón de feedback y sugerencias para creadores y SaaS',
  description:
    'Recoge el feedback de tu comunidad, gestiona sugerencias y publica tu roadmap público sin complicaciones. La herramienta de feedback definitiva para creadores y SaaS independientes.',
  alternates: {
    canonical: 'https://pidemelo.app',
  },
}

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center overflow-hidden relative pt-28 md:pt-36">
        {/* Fondo de puntitos */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-4xl space-y-8 md:space-y-12 z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-xs md:text-sm font-bold text-zinc-600 shadow-sm transition-transform hover:rotate-1 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5C00] animate-pulse flex-shrink-0"></span>
            El tablón de anuncios de toda la vida, pero en fino.
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-zinc-900 leading-[0.95]">
            Deja de adivinar qué <br />
            <span className="text-[#FF5C00]">narices</span> quieren todos.
          </h1>

          <p className="text-base md:text-xl text-zinc-500 max-w-2xl mx-auto font-bold leading-tight px-2">
            Un tablón de sugerencias sincero para que tus clientes te den la chapa en un solo sitio y tú decidas si les haces caso o no.
          </p>

          <div className="pt-2 flex flex-col items-center gap-5">
            <SignedOut>
              <SignInButton mode="modal" signUpFallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <Button size="lg" className="h-16 md:h-20 px-8 md:px-12 text-lg md:text-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-2xl shadow-[#FF5C00]/30 rounded-full font-black transition-all hover:scale-110 active:scale-95 w-full sm:w-auto">
                  Montar mi chiringuito ya 👉
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-16 md:h-20 px-8 md:px-12 text-lg md:text-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-2xl shadow-[#FF5C00]/30 rounded-full font-black transition-all hover:scale-110 active:scale-95">
                  Ir a mis tinglaos 🚀
                </Button>
              </Link>
            </SignedIn>

            <p className="text-xs text-zinc-400 font-medium italic opacity-60">
              "Ideal para creadores que valoran su salud mental" — Un tío de Twitter.
            </p>
          </div>
        </div>

        {/* Sección de Beneficios */}
        <section id="que-es" aria-labelledby="beneficios-heading" className="mt-24 md:mt-48 max-w-5xl w-full text-left pb-16 md:pb-32">
          <h2 id="beneficios-heading" className="sr-only">Gestión de feedback sin fricciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="p-6 md:p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-4 hover:shadow-xl transition-shadow">
              <div className="text-3xl text-[#FF5C00]" aria-hidden="true">🤫</div>
              <h3 className="text-lg md:text-xl font-bold">Sin registros pesados</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">Para que tus usuarios se sientan libres de decirte que tu producto es un lío sin que les guardes rencor.</p>
            </div>
            <div className="p-6 md:p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-4 hover:shadow-xl transition-shadow md:rotate-1">
              <div className="text-3xl text-[#FF5C00]" aria-hidden="true">🗳️</div>
              <h3 className="text-lg md:text-xl font-bold">Votos de verdad</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">Deja que la democracia decida qué es lo siguiente, o ignóralos a todos. Tú eres el que manda aquí.</p>
            </div>
            <div className="p-6 md:p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-4 hover:shadow-xl transition-shadow sm:col-span-2 md:col-span-1 md:-rotate-1">
              <div className="text-3xl text-[#FF5C00]" aria-hidden="true">⚡</div>
              <h3 className="text-lg md:text-xl font-bold">Instalación en 1 min</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">Más rápido que pedir un café. Creas el tablón, pasas el link por el grupo de Telegram y a otra cosa.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="max-w-3xl w-full text-left py-12 md:py-20 font-sans">
          <h2 id="faq-heading" className="text-2xl md:text-3xl font-heading font-black mb-8 md:mb-10 tracking-tight">Dudas existenciales ❓</h2>
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-zinc-100">
              <h3 className="font-bold text-base md:text-lg mb-2">¿Es seguro?</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">Tan seguro como puede ser un tablón donde la gente entra a pedir cosas. Usamos Clerk y Drizzle, así que no te preocupes.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-zinc-100">
              <h3 className="font-bold text-base md:text-lg mb-2">¿Por qué es gratis?</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">Porque queremos que llenes tu lista de tareas con ideas brillantes antes de intentar cobrarte por algo que podrías hacer en un Excel (pero más feo).</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-zinc-100">
              <h3 className="font-bold text-base md:text-lg mb-2">¿Puedo borrar a los pesados?</h3>
              <p className="text-zinc-500 font-medium text-sm md:text-base">¡Claro! Tienes un panel de administrador para mover ideas al limbo o borrarlas si se ponen muy intensos.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 md:py-10 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold opacity-50">
          <span>pidemelo<span className="text-[#FF5C00]">.</span>app</span>
          <p className="text-center text-xs">
            Hecho con un poco de colacao y mucha ironía por <a href="https://ka0s.site/me" target="_blank" className="text-[#FF5C00]">Gontzi</a> de <a href="https://tunuevosoftware.com" target="_blank" className="text-[#ffd400]">TuNuevoSoftware</a>
          </p>
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}


