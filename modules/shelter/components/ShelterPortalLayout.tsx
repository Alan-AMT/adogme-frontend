// modules/shelter/components/ShelterPortalLayout.tsx
// Layout del portal del refugio — Navbar + contenido + Footer (sin sidebar).
'use client'

import { type ReactNode } from 'react'
import Navbar from '@/modules/shared/components/layout/Navbar'
import Footer from '@/modules/shared/components/layout/Footer'

export function ShelterPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div className="container-page section">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
