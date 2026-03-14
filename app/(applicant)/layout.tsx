'use client'
// app/(applicant)/layout.tsx
// Middleware ya garantiza que haya token — este layout verifica el ROL.
// Si el rol no es 'applicant', redirige al destino correcto.

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Navbar  from '@/modules/shared/components/layout/Navbar'
import Footer  from '@/modules/shared/components/layout/Footer'
import { Spinner } from '@/modules/shared/components/ui/Spinner'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'

export default function ApplicantLayout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const hydrate  = useAuthStore(s => s.hydrate)
  const user     = useAuthStore(s => s.user)
  const [ready, setReady] = useState(false)

  // Hidrata el store una sola vez al montar
  useEffect(() => {
    hydrate()
    setReady(true)
  }, [hydrate])

  // Una vez hidratado, verifica el rol
  useEffect(() => {
    if (!ready) return
    if (!user) {
      const redirect = encodeURIComponent(window.location.pathname)
      router.replace(`/login?redirect=${redirect}`)
      return
    }
    if (user.role === 'shelter') { router.replace('/refugio/dashboard'); return }
    if (user.role === 'admin')   { router.replace('/admin'); return }
  }, [ready, user, router])

  // Spinner mientras se hidrata o mientras se verifica el rol
  if (!ready || !user || user.role !== 'applicant') {
    return (
      <>
        <Navbar />
        <main className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</main>
      <Footer />
    </div>
  )
}
