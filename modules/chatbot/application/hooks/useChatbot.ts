// modules/chatbot/application/hooks/useChatbot.ts
// Estado del chatbot: historial de mensajes, envío, manejo de errores.
//
// Estrategia de resiliencia:
//  - Respuesta degradada (HTTP 200 + meta.degraded): se renderiza con badge,
//    flujo normal sigue.
//  - Error puntual (red, 5xx, timeout): el último mensaje del usuario queda
//    marcado 'failed' con botón Reintentar.
//  - Servicio caído (3 errores consecutivos): isServiceDown=true, banner
//    persistente, input deshabilitado, polling a /api/health cada 30s para
//    detectar recuperación.
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { chatbotService } from '../../infrastructure/ChatbotServiceFactory'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import type { UIMessage } from '../../domain/Chatbot'

// ─── Constantes de resiliencia ────────────────────────────────────────────────

const FAILURE_THRESHOLD     = 3       // errores consecutivos para marcar caído
const HEALTH_POLL_MS        = 30_000  // polling de health mientras está caído
const SLOW_RESPONSE_MS      = 5_000   // mostrar "tardando un poco más" tras 5s

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTime(): string {
  return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

let _idCounter = 1
function nextId(): number { return _idCounter++ }

// ─── Mensaje de bienvenida ────────────────────────────────────────────────────

function buildWelcome(): UIMessage {
  return {
    id:          nextId(),
    role:        'bot',
    text:        '¡Hola! 🐾 Soy el asistente de aDOGme. Estoy aquí para ayudarte a encontrar a tu nuevo mejor amigo. ¿En qué te puedo ayudar hoy?',
    time:        getTime(),
    suggestions: ['¿Cómo adopto?', '¿Cuáles son los requisitos?', 'Hacer el quiz de compatibilidad'],
  }
}

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export interface UseChatbotReturn {
  // Estado
  messages:           UIMessage[]
  input:              string
  isLoading:          boolean         // true mientras el bot responde
  isSlowResponse:     boolean         // true si llevamos > 5s esperando
  isServiceDown:      boolean         // true tras N errores consecutivos
  unreadCount:        number          // mensajes del bot no leídos (badge)
  sessionId:          string          // UUID de la sesión actual
  currentSuggestions: string[]        // chips del último mensaje bot

  // Acciones
  setInput:        (v: string) => void
  sendMessage:     (text: string) => void
  retryLastFailed: () => void          // reenvía el último mensaje del usuario que falló
  retryConnection: () => void          // fuerza un health check para salir del estado caído
  clearHistory:    () => void          // reinicia historial + sesión
  markRead:        () => void          // resetea unreadCount a 0
}

// ─── Helpers de localStorage ──────────────────────────────────────────────────

const historyKey = (sid: string) => `chatbot-session-${sid}`

function loadHistory(sid: string): UIMessage[] | null {
  try {
    const raw = localStorage.getItem(historyKey(sid))
    return raw ? (JSON.parse(raw) as UIMessage[]) : null
  } catch { return null }
}

function saveHistory(sid: string, msgs: UIMessage[]): void {
  try {
    localStorage.setItem(historyKey(sid), JSON.stringify(msgs))
  } catch { /* noop — storage lleno o privado */ }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatbot(): UseChatbotReturn {
  const user = useAuthStore(s => s.user)

  // sessionId estable por sesión de browser; persiste mientras no se limpia
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return crypto.randomUUID()
    return sessionStorage.getItem('chatbot-sid') ?? (() => {
      const sid = crypto.randomUUID()
      sessionStorage.setItem('chatbot-sid', sid)
      return sid
    })()
  })

  // Inicializar mensajes desde localStorage si existe el historial
  const [messages, setMessages] = useState<UIMessage[]>(() => {
    if (typeof window === 'undefined') return [buildWelcome()]
    const cached = loadHistory(
      sessionStorage.getItem('chatbot-sid') ?? ''
    )
    return cached ?? [buildWelcome()]
  })

  const [input,          setInput]          = useState('')
  const [isLoading,      setIsLoading]      = useState(false)
  const [isSlowResponse, setIsSlowResponse] = useState(false)
  const [isServiceDown,  setIsServiceDown]  = useState(false)
  const [unreadCount,    setUnreadCount]    = useState(1)

  const consecutiveErrors = useRef(0)
  const slowTimer         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const healthTimer       = useRef<ReturnType<typeof setInterval> | null>(null)

  // Persistir historial cada vez que cambian los mensajes
  useEffect(() => {
    saveHistory(sessionId, messages)
  }, [messages, sessionId])

  // ── Polling de health mientras isServiceDown ────────────────────────────────
  useEffect(() => {
    if (!isServiceDown) return

    const ping = async () => {
      try {
        const h = await chatbotService.healthCheck()
        // 'ok' o 'degraded' → el servicio responde, salimos del estado caído.
        // 'down' → seguimos esperando.
        if (h.status !== 'down') {
          consecutiveErrors.current = 0
          setIsServiceDown(false)
        }
      } catch { /* sigue caído */ }
    }

    healthTimer.current = setInterval(ping, HEALTH_POLL_MS)
    return () => {
      if (healthTimer.current) clearInterval(healthTimer.current)
    }
  }, [isServiceDown])

  // ── Cleanup del timer de slow-response al desmontar ─────────────────────────
  useEffect(() => {
    return () => {
      if (slowTimer.current) clearTimeout(slowTimer.current)
    }
  }, [])

  // ── Núcleo: enviar un texto del usuario ya colocado en el historial ────────
  const submitToBot = useCallback(async (userMsgId: number, text: string) => {
    setIsLoading(true)
    setIsSlowResponse(false)
    if (slowTimer.current) clearTimeout(slowTimer.current)
    slowTimer.current = setTimeout(() => setIsSlowResponse(true), SLOW_RESPONSE_MS)

    try {
      const response = await chatbotService.getResponse(text, sessionId, user?.id)

      consecutiveErrors.current = 0

      const botMsg: UIMessage = {
        id:          nextId(),
        role:        'bot',
        text:        response.text,
        time:        getTime(),
        links:       response.links,
        cards:       response.cards,
        suggestions: response.suggestions,
        meta:        response.meta,
      }

      // Marcar el mensaje del usuario como entregado y agregar respuesta del bot
      setMessages(prev => [
        ...prev.map(m => m.id === userMsgId ? { ...m, status: 'sent' as const } : m),
        botMsg,
      ])
      setUnreadCount(prev => prev + 1)
    } catch {
      consecutiveErrors.current += 1

      // Marcar el mensaje del usuario como fallido (habilita botón Reintentar)
      setMessages(prev =>
        prev.map(m => m.id === userMsgId ? { ...m, status: 'failed' as const } : m),
      )

      if (consecutiveErrors.current >= FAILURE_THRESHOLD) {
        setIsServiceDown(true)
      }
    } finally {
      setIsLoading(false)
      setIsSlowResponse(false)
      if (slowTimer.current) {
        clearTimeout(slowTimer.current)
        slowTimer.current = null
      }
    }
  }, [sessionId, user?.id])

  // ── sendMessage ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading || isServiceDown) return

    const userMsg: UIMessage = {
      id:     nextId(),
      role:   'user',
      text:   trimmed,
      time:   getTime(),
      status: 'sent',
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    submitToBot(userMsg.id, trimmed)
  }, [isLoading, isServiceDown, submitToBot])

  // ── retryLastFailed ─────────────────────────────────────────────────────────
  // Busca el último mensaje del usuario marcado 'failed' y lo reenvía.
  // No crea un nuevo mensaje: actualiza el existente al estado 'sent' tentativo.
  const retryLastFailed = useCallback(() => {
    if (isLoading || isServiceDown) return

    const lastFailed = [...messages].reverse().find(
      m => m.role === 'user' && m.status === 'failed',
    )
    if (!lastFailed) return

    setMessages(prev =>
      prev.map(m => m.id === lastFailed.id ? { ...m, status: 'sent' as const } : m),
    )
    submitToBot(lastFailed.id, lastFailed.text)
  }, [messages, isLoading, isServiceDown, submitToBot])

  // ── retryConnection ─────────────────────────────────────────────────────────
  // Llamado desde el banner "servicio caído". Hace un health check inmediato.
  const retryConnection = useCallback(async () => {
    try {
      const h = await chatbotService.healthCheck()
      if (h.status !== 'down') {
        consecutiveErrors.current = 0
        setIsServiceDown(false)
      }
    } catch { /* sigue caído */ }
  }, [])

  // ── clearHistory ────────────────────────────────────────────────────────────
  const clearHistory = useCallback(() => {
    try { localStorage.removeItem(historyKey(sessionId)) } catch { /* noop */ }
    const newSid = crypto.randomUUID()
    sessionStorage.setItem('chatbot-sid', newSid)
    setSessionId(newSid)
    setMessages([buildWelcome()])
    setInput('')
    setIsLoading(false)
    setIsSlowResponse(false)
    setUnreadCount(0)
    consecutiveErrors.current = 0
    setIsServiceDown(false)
  }, [sessionId])

  // ── markRead ────────────────────────────────────────────────────────────────
  const markRead = useCallback(() => setUnreadCount(0), [])

  // ── Sugerencias actuales (del último mensaje bot) ───────────────────────────
  const lastBotMsg         = [...messages].reverse().find(m => m.role === 'bot')
  const currentSuggestions = lastBotMsg?.suggestions ?? []

  return {
    messages,
    input,
    isLoading,
    isSlowResponse,
    isServiceDown,
    unreadCount,
    sessionId,
    currentSuggestions,
    setInput,
    sendMessage,
    retryLastFailed,
    retryConnection,
    clearHistory,
    markRead,
  }
}
