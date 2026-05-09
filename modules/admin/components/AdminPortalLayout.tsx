// modules/admin/components/AdminPortalLayout.tsx
// Layout del panel admin — reutiliza Navbar + Footer compartidos.
'use client'

import { type ReactNode } from 'react'
import Navbar from '@/modules/shared/components/layout/Navbar'
import Footer from '@/modules/shared/components/layout/Footer'

export function AdminPortalLayout({ children }: { children: ReactNode }) {
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
