'use client'
// app/(applicant)/layout.tsx
// Middleware guarantees a token exists — this layout verifies the ROLE.
// If the role is not 'applicant', redirects to the correct destination.

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Navbar  from '@/modules/shared/components/layout/Navbar'
import Footer  from '@/modules/shared/components/layout/Footer'
import { Spinner } from '@/modules/shared/components/ui/Spinner'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'

export default function ApplicantLayout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const user     = useAuthStore(s => s.user)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

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
