// modules/shelter/components/ShelterPortalLayout.tsx
// Layout del portal del refugio — Navbar + contenido + Footer (sin sidebar).
'use client'

import { type ReactNode } from 'react'
import Navbar from '@/modules/shared/components/layout/Navbar'
import Footer from '@/modules/shared/components/layout/Footer'

export function ShelterPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Navbar />
      <div id="app-scroll-container" className="flex-1 overflow-y-auto">
        <main>
          <div className="container-page section">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
