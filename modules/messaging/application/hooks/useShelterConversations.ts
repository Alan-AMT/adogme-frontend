// modules/messaging/application/hooks/useShelterConversations.ts
// Hook para el lado-refugio del sistema de mensajería.
// Carga conversaciones donde el refugio es el receptor.
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Conversation } from '@/modules/shared/domain/Message'
import { messageService } from '../../infrastructure/MessageServiceFactory'

const CURRENT_SHELTER_ID = 1

export interface UseShelterConversationsReturn {
  conversations: Conversation[]
  isLoading:     boolean
  error:         string | null
  totalUnread:   number
  markRead:      (id: number) => Promise<void>
}

export function useShelterConversations(): UseShelterConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [error,         setError]         = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await messageService.getConversationsByShelterId(CURRENT_SHELTER_ID)
      setConversations(data)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al cargar mensajes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const totalUnread = conversations.reduce((acc, c) => acc + c.noLeidosPorRefugio, 0)

  const markRead = useCallback(async (id: number) => {
    await messageService.markAsRead(id, 'shelter')
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, noLeidosPorRefugio: 0 } : c)
    )
  }, [])

  return { conversations, isLoading, error, totalUnread, markRead }
}
