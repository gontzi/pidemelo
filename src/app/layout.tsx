import type { Metadata } from 'next'
import { Outfit, Instrument_Sans, Plus_Jakarta_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit'
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument'
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
})

export const metadata: Metadata = {
  title: 'Pidemelo.app 🚀 Recopila sugerencias en segundos',
  description: 'El tablón de peticiones definitivo para mentes inquietas.',
}

import ClientWrapper from '@/components/ClientWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${instrument.variable} ${outfit.variable} ${jakarta.variable} font-sans bg-[#FAFAFA] text-zinc-900 min-h-screen selection:bg-[#FF5C00]/20 selection:text-zinc-900`}>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  )
}
