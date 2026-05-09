// app/(public)/layout.tsx
// Páginas públicas: incluye Navbar + Footer
import Footer from '@/modules/shared/components/layout/Footer'
import Navbar from '@/modules/shared/components/layout/Navbar'
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Navbar />
      <div id="app-scroll-container" className="flex-1 overflow-y-auto">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
