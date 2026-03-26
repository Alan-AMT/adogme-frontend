// modules/messaging/application/hooks/useConversations.ts
// Archivo 162 — lista de conversaciones del adoptante autenticado.
//
// • Carga al montar y expone refetch() para actualizar manualmente.
// • Ordena por ultimoMensajeEn desc (el servicio ya lo hace).
// • totalUnread = suma de noLeidosPorAdoptante de todas las conversaciones.
// • markRead(id) llama al servicio y actualiza el estado local sin refetch.
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore }  from '@/modules/shared/infrastructure/store/authStore'
import { messageService } from '../../infrastructure/MessageServiceFactory'
import type { Conversation } from '@/modules/shared/domain/Message'

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export interface UseConversationsReturn {
  conversations: Conversation[]
  isLoading:     boolean
  error:         string | null
  totalUnread:   number
  refetch:       () => Promise<void>
  markRead:      (conversationId: number) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useConversations(): UseConversationsReturn {
  const { user }                            = useAuthStore()
  const [conversations, setConversations]   = useState<Conversation[]>([])
  const [isLoading,     setIsLoading]       = useState(true)
  const [error,         setError]           = useState<string | null>(null)

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const refetch = useCallback(async () => {
    if (!user?.id) { setIsLoading(false); return }

    setIsLoading(true)
    try {
      const data = await messageService.getConversations(user.id)
      setConversations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar conversaciones')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => { refetch() }, [refetch])

  // ── markRead ─────────────────────────────────────────────────────────────────
  // Llama al servicio y actualiza el contador local sin recargar toda la lista.
  const markRead = useCallback(async (conversationId: number) => {
    try {
      await messageService.markAsRead(conversationId, 'applicant')
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, noLeidosPorAdoptante: 0 } : c
        )
      )
    } catch { /* noop — no es crítico */ }
  }, [])

  // ── Derivados ────────────────────────────────────────────────────────────────
  const totalUnread = conversations.reduce((acc, c) => acc + c.noLeidosPorAdoptante, 0)

  return { conversations, isLoading, error, totalUnread, refetch, markRead }
}
