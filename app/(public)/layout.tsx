// app/(public)/layout.tsx
// Páginas públicas: incluye Navbar + Footer
import Footer from '@/modules/shared/components/layout/Footer'
import Navbar from '@/modules/shared/components/layout/Navbar'
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
