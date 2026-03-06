// app/(auth)/layout.tsx — SERVER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// Route group layout para auth.
// Ahora INCLUYE Navbar + Footer para consistencia global.
// AuthLayout ya NO debe asumir "sin navbar/footer".
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'

import Footer from '@/modules/shared/components/layout/Footer'
import Navbar from '@/modules/shared/components/layout/Navbar'

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Área principal que crece entre navbar y footer */}
      <main className="flex-1 bg-[#f4f6f9]">
        {children}
      </main>

      <Footer />
    </div>
  )
}
