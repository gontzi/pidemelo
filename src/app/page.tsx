import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center overflow-hidden relative pt-32">
        {/* Fondo de puntitos retro-moderno */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-4xl space-y-12 z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-sm font-bold text-zinc-600 mb-4 shadow-sm transition-transform hover:rotate-1 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5C00] animate-pulse"></span>
            El tablón de anuncios de toda la vida, pero en fino.
          </div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-zinc-900 leading-[0.95]">
            Deja de adivinar qué <br />
            <span className="text-[#FF5C00]">narices</span> quieren todos.
          </h1>

          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto font-bold leading-tight">
            Un tablón de sugerencias sincero para que tus clientes te den la chapa en un solo sitio y tú decidas si les haces caso o no.
          </p>

          <div className="pt-4 flex flex-col items-center gap-6">
            <SignedOut>
              <SignInButton mode="modal" signUpFallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <Button size="lg" className="h-20 px-12 text-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-2xl shadow-[#FF5C00]/30 rounded-full font-black transition-all hover:scale-110 active:scale-95">
                  Montar mi chiringuito ya 👉
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="h-20 px-12 text-2xl bg-[#FF5C00] text-white hover:bg-[#E65300] shadow-2xl shadow-[#FF5C00]/30 rounded-full font-black transition-all hover:scale-110 active:scale-95">
                  Ir a mis tinglaos 🚀
                </Button>
              </Link>
            </SignedIn>

            <div className="flex flex-col items-center gap-2 opacity-60">
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Cero euros al mes. Cero tonterías.</p>
              <p className="text-xs text-zinc-400 font-medium italic">"Ideal para creadores que valoran su salud mental" — Un tío de Twitter.</p>
            </div>
          </div>
        </div>

        {/* Sección de "Beneficios" (si se pueden llamar así) */}
        <section id="que-es" className="mt-48 max-w-5xl w-full grid md:grid-cols-3 gap-8 text-left pb-32">
          <div className="p-8 bg-white border border-zinc-200 rounded-[2.5rem] space-y-4 hover:shadow-xl transition-shadow">
            <div className="text-3xl text-[#FF5C00]">🤫</div>
            <h3 className="text-xl font-bold">Sin registros pesados</h3>
            <p className="text-zinc-500 font-medium">Para que tus usuarios se sientan libres de decirte que tu producto es un lío sin que les guardes rencor.</p>
          </div>
          <div className="p-8 bg-white border border-zinc-200 rounded-[2.5rem] space-y-4 hover:shadow-xl transition-shadow rotate-1">
            <div className="text-3xl text-[#FF5C00]">🗳️</div>
            <h3 className="text-xl font-bold">Votos de verdad</h3>
            <p className="text-zinc-500 font-medium">Deja que la democracia decida qué es lo siguiente, o ignóralos a todos. Tú eres el que manda aquí.</p>
          </div>
          <div className="p-8 bg-white border border-zinc-200 rounded-[2.5rem] space-y-4 hover:shadow-xl transition-shadow -rotate-1">
            <div className="text-3xl text-[#FF5C00]">⚡</div>
            <h3 className="text-xl font-bold">Instalación en 1 min</h3>
            <p className="text-zinc-500 font-medium">Más rápido que pedir un café. Creas el tablón, pasas el link por el grupo de Telegram y a otra cosa.</p>
          </div>
        </section>

        {/* FAQ - Dudas existenciales */}
        <section id="faq" className="max-w-3xl w-full text-left py-20 font-sans">
          <h2 className="text-3xl font-heading font-black mb-10 tracking-tight">Dudas existenciales ❓</h2>
          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-lg mb-2">¿Es seguro?</h4>
              <p className="text-zinc-500 font-medium">Tan seguro como puede ser un tablón donde la gente entra a pedir cosas. Usamos Clerk y Drizzle, así que no te preocupes.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">¿Por qué es gratis?</h4>
              <p className="text-zinc-500 font-medium">Porque queremos que llenes tu lista de tareas con ideas brillantes antes de intentar cobrarte por algo que podrías hacer en un Excel (pero más feo).</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">¿Puedo borrar a los pesados?</h4>
              <p className="text-zinc-500 font-medium">¡Claro! Tienes un panel de administrador para mover ideas al limbo o borrarlas si se ponen muy intensos.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center border-t border-zinc-100 opacity-50 text-sm font-bold">
        Hecho con un poco de café y mucha ironía. pidemelo.app © {new Date().getFullYear()}
      </footer>
    </>
  );
}
