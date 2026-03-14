// app/layout.tsx — SERVER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// Root Layout: base compartida por TODOS los route groups.
//
// Estructura de layouts por grupo:
//   (public)/layout.tsx    → Navbar + <main> + Footer  (home, catálogo, refugios)
//   (auth)/layout.tsx      → solo children             (AuthLayout es full-screen)
//   (shelter)/layout.tsx   → sidebar refugio + main    (dashboard del refugio)
//   (admin)/layout.tsx     → sidebar admin + main      (panel de administración)
//
// Componentes globales montados en Providers:
//   • ToastContainer  — notificaciones en toda la app
//   • BubbleChatbot   — asistente flotante en toda la app
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'

import './globals.css'
import Providers from './providers'

// ─── Fuentes ──────────────────────────────────────────────────────────────────

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
})

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  'aDOGme — Adopta con amor en la GAM',
    template: '%s · aDOGme',
  },
  description:
    'Plataforma de adopción canina responsable en la Gustavo A. Madero. ' +
    'Conectamos adoptantes con refugios verificados para facilitar adopciones seguras.',
  keywords: ['adopción perros', 'refugios GAM', 'adopción canina', 'aDOGme', 'Ciudad de México'],
  authors:  [{ name: 'aDOGme' }],
  openGraph: {
    type:        'website',
    locale:      'es_MX',
    siteName:    'aDOGme',
    title:       'aDOGme — Adopta con amor en la GAM',
    description: 'Adopta de forma responsable. Refugios verificados en la Ciudad de México.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#ff6b6b',
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Material Symbols — variable font (FILL, wght, GRAD, opsz) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>

      <body className="min-h-screen antialiased">
        {/* Providers: hidrata stores + monta ToastContainer y BubbleChatbot */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
