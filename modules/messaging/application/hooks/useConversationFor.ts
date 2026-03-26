// modules/messaging/application/hooks/useConversationFor.ts
// B2 — Obtiene (o crea) la conversación entre el adoptante autenticado y un refugio.
// Usado en AdoptionDetailView para navegar al chat.

import { useEffect, useState } from 'react'
import { messageService } from '@/modules/messaging/infrastructure/MessageServiceFactory'
import type { CreateConversationData } from '@/modules/messaging/domain/IMessageService'

interface UseConversationForReturn {
  conversationId: number | null
  isLoading:      boolean
}

export function useConversationFor(
  context: CreateConversationData | null,
): UseConversationForReturn {
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [isLoading,      setIsLoading]      = useState(false)

  useEffect(() => {
    if (!context || !context.adoptanteId || !context.refugioId) return

    let cancelled = false
    setIsLoading(true)

    messageService.getOrCreateConversation(context)
      .then(conv => { if (!cancelled) setConversationId(conv.id) })
      .catch(() => { /* silencioso — el botón simplemente no navega */ })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [context?.adoptanteId, context?.refugioId, context?.solicitudId])

  return { conversationId, isLoading }
}
