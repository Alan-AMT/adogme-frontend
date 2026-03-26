// modules/messaging/application/hooks/useChat.ts
// Archivo 163 — mensajes de una conversación.
//
// • Carga mensajes al montar y marca la conversación como leída.
// • Polling cada 4s: compara el length del array — si crece, actualiza estado.
// • Envío optimista: agrega el mensaje localmente antes de que el servicio confirme;
//   reemplaza con el confirmado en éxito, o elimina en error.
// • messagesEndRef: el componente lo adjunta al div final para hacer scroll auto.
'use client'

import { useState, useEffect, useRef, useCallback, RefObject } from 'react'
import { useAuthStore }   from '@/modules/shared/infrastructure/store/authStore'
import { messageService }  from '../../infrastructure/MessageServiceFactory'
import type { Message }    from '@/modules/shared/domain/Message'

// ─── Constantes ───────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 4_000

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export interface UseChatReturn {
  messages:       Message[]
  isLoading:      boolean
  isSending:      boolean
  error:          string | null
  messagesEndRef: RefObject<HTMLDivElement | null>
  sendMessage:    (texto: string) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChat(conversationId: number): UseChatReturn {
  const { user }                          = useAuthStore()
  const [messages,  setMessages]          = useState<Message[]>([])
  const [isLoading, setIsLoading]         = useState(true)
  const [isSending, setIsSending]         = useState(false)
  const [error,     setError]             = useState<string | null>(null)
  const messagesEndRef                     = useRef<HTMLDivElement>(null)

  // Ref para comparar sin re-crear el intervalo cuando messages cambia
  const lastCountRef = useRef(0)

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return

    setIsLoading(true)
    setMessages([])
    lastCountRef.current = 0

    messageService.getMessages(conversationId).then(msgs => {
      setMessages(msgs)
      lastCountRef.current = msgs.length
      setIsLoading(false)
      // Marcar como leída al abrir
      messageService.markAsRead(conversationId, 'applicant').catch(() => { /* noop */ })
    }).catch(() => {
      setError('Error al cargar mensajes')
      setIsLoading(false)
    })
  }, [conversationId])

  // ── Polling cada 4 s ──────────────────────────────────────────────────────
  // Revisa si llegaron mensajes nuevos (auto-reply del mock) comparando length.
  useEffect(() => {
    if (!conversationId || isLoading) return

    const interval = setInterval(async () => {
      try {
        const fresh = await messageService.getMessages(conversationId)
        if (fresh.length > lastCountRef.current) {
          setMessages([...fresh])
          lastCountRef.current = fresh.length
          // Los nuevos mensajes del refugio se marcan como leídos automáticamente
          messageService.markAsRead(conversationId, 'applicant').catch(() => { /* noop */ })
        }
      } catch { /* noop — polling silencioso */ }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [conversationId, isLoading])

  // ── Scroll al último mensaje ──────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── sendMessage (optimista) ───────────────────────────────────────────────
  const sendMessage = useCallback(async (texto: string) => {
    if (!texto.trim() || !user || isSending) return

    setIsSending(true)
    setError(null)

    // 1. Mensaje optimista — ID temporal
    const tempId        = Date.now()
    const optimisticMsg: Message = {
      id:             tempId,
      conversationId,
      senderId:       user.id,
      senderRole:    'applicant',
      senderNombre:   user.nombre,
      senderAvatar:   user.avatarUrl,
      texto:          texto.trim(),
      leidoEn:        new Date().toISOString(),
      creadoEn:       new Date().toISOString(),
    }

    setMessages(prev => [...prev, optimisticMsg])
    lastCountRef.current += 1

    try {
      // 2. Confirmación del servicio
      const confirmed = await messageService.sendMessage(
        conversationId,
        user.id,
        texto.trim(),
        user.nombre,
        user.avatarUrl,
      )
      // 3. Reemplazar optimista con el mensaje confirmado (ID real del servicio)
      setMessages(prev => prev.map(m => m.id === tempId ? confirmed : m))
    } catch {
      // 4. Revertir en error — eliminar el mensaje optimista
      setMessages(prev => prev.filter(m => m.id !== tempId))
      lastCountRef.current -= 1
      setError('Error al enviar el mensaje. Intenta de nuevo.')
    } finally {
      setIsSending(false)
    }
  }, [conversationId, user, isSending])

  return { messages, isLoading, isSending, error, messagesEndRef, sendMessage }
}
