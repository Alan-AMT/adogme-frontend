// modules/admin/components/AdminPortalLayout.tsx
// Layout del panel admin — reutiliza Navbar + Footer compartidos.
'use client'

import { type ReactNode } from 'react'
import Navbar from '@/modules/shared/components/layout/Navbar'
import Footer from '@/modules/shared/components/layout/Footer'

export function AdminPortalLayout({ children }: { children: ReactNode }) {
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
