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
  metadataBase: new URL('https://pidemelo.app'),
  title: {
    default: 'Pídemelo — Tablón de sugerencias para creadores',
    template: '%s | Pídemelo',
  },
  description:
    'Recoge el feedback de tu comunidad, gestiona sugerencias y publica tu roadmap público sin complicaciones. La herramienta de feedback definitiva para creadores y SaaS.',
  keywords: [
    'feedback tool',
    'tablón de sugerencias',
    'roadmap público',
    'gestión de feedback',
    'feature requests',
    'herramienta feedback SaaS',
    'votar ideas',
    'product roadmap',
  ],
  authors: [{ name: 'Gontzi', url: 'https://ka0s.site/me' }],
  creator: 'Gontzi — TuNuevoSoftware',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://pidemelo.app',
    siteName: 'Pídemelo',
    title: 'Pídemelo — Tablón de sugerencias para creadores',
    description:
      'Recoge el feedback de tu comunidad, gestiona sugerencias y publica tu roadmap público sin complicaciones.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pídemelo — Tablón de sugerencias para creadores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pídemelo — Tablón de sugerencias para creadores',
    description:
      'Recoge el feedback de tu comunidad, gestiona sugerencias y publica tu roadmap público sin complicaciones.',
    images: ['/og-image.png'],
    creator: '@gontzi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import ClientWrapper from '@/components/ClientWrapper'
import Navbar from '@/components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${instrument.variable} ${outfit.variable} ${jakarta.variable} font-sans bg-[#FAFAFA] text-zinc-900 min-h-screen selection:bg-[#FF5C00]/20 selection:text-zinc-900`}>
          <ClientWrapper navbar={<Navbar />}>
            {children}
          </ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  )
}
