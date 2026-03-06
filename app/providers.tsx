'use client'
// app/providers.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Envuelve toda la app. Responsabilidades:
//   1. Hidratar los stores de Zustand (auth desde cookie, favoritos desde LS)
//   2. Montar componentes globales de UI (ToastContainer, chatbot bubble)
//   3. Punto de entrada para futuros providers (React Query, theme, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import ChatbotWrapper from '@/modules/chatbot/components/ChatbotWrapper'
import { ToastContainer } from '@/modules/shared/components/ui/ToastContainer'
import { useAuthStore }      from '@/modules/shared/infrastructure/store/authStore'
import { useFavoritesStore } from '@/modules/shared/infrastructure/store/favoritesStore'
import { useEffect, type ReactNode } from 'react'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProvidersProps {
  children: ReactNode
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Providers({ children }: ProvidersProps) {
  const hydrateAuth      = useAuthStore(s => s.hydrate)
  const hydrateFavorites = useFavoritesStore(s => s.hydrate)

  // Hidratación única al montar — solo en el cliente
  // authStore lee el token de la cookie de sesión
  // favoritesStore lee los IDs guardados en localStorage
  useEffect(() => {
    hydrateAuth()
    hydrateFavorites()
  }, [hydrateAuth, hydrateFavorites])

  return (
    <>
      {children}

      {/* ── UI global — visible en todas las páginas ── */}
      <ToastContainer />
      <ChatbotWrapper />
    </>
  )
}
