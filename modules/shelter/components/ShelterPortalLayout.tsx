// modules/shelter/components/ShelterPortalLayout.tsx
// Layout del portal del refugio — Navbar + contenido + Footer (sin sidebar).
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import Navbar from '@/modules/shared/components/layout/Navbar'
import Footer from '@/modules/shared/components/layout/Footer'

export function ShelterPortalLayout({ children }: { children: ReactNode }) {
  const hydrate  = useAuthStore(s => s.hydrate)
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hydrate()
    setReady(true)
  }, [hydrate])

  if (!ready) return null

  // Mensajes usa su propio layout full-width (ms-layout)
  const isMessages = pathname.includes('/mensajes')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {isMessages ? children : (
          <div className="container-page section">
            {children}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
