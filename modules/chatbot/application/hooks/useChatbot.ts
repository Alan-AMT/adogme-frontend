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
import { ChatbotRateLimitError } from '../../infrastructure/ChatbotErrors'
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
  messages:               UIMessage[]
  input:                  string
  isLoading:              boolean         // true mientras el bot responde
  isSlowResponse:         boolean         // true si llevamos > 5s esperando
  isServiceDown:          boolean         // true tras N errores consecutivos
  rateLimitRemaining:     number | null   // segundos hasta poder enviar; null = no limitado
  unreadCount:            number          // mensajes del bot no leídos (badge)
  sessionId:              string          // UUID de la sesión actual
  currentSuggestions:     string[]        // chips del último mensaje bot

  // Acciones
  setInput:        (v: string) => void
  sendMessage:     (text: string) => void
  retryLastFailed: () => void          // reenvía el último mensaje del usuario que falló
  retryConnection: () => void          // fuerza un health check para salir del estado caído
  clearHistory:    () => void          // reinicia historial + sesión
  markRead:        () => void          // resetea unreadCount a 0
}

// ─── Limpieza de datos legacy ────────────────────────────────────────────────
// El chatbot ya NO persiste el historial (refresh = welcome de nuevo). Esta
// función borra cualquier residuo de versiones previas que sí persistían en
// localStorage / sessionStorage. Se ejecuta una vez al montar el hook.
function pruneLegacyChatbotData(): void {
  if (typeof window === 'undefined') return
  try {
    const toRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('chatbot-session-')) toRemove.push(key)
    }
    toRemove.forEach(k => localStorage.removeItem(k))
    sessionStorage.removeItem('chatbot-sid')
  } catch { /* noop */ }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatbot(): UseChatbotReturn {
  const user = useAuthStore(s => s.user)

  // sessionId fresco en cada montaje del hook (= cada page load). No se
  // persiste a propósito: refresh = conversación nueva.
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID())

  // Mensajes solo en memoria. Refresh borra todo, queda solo el welcome.
  const [messages, setMessages] = useState<UIMessage[]>(() => [buildWelcome()])

  const [input,              setInput]              = useState('')
  const [isLoading,          setIsLoading]          = useState(false)
  const [isSlowResponse,     setIsSlowResponse]     = useState(false)
  const [isServiceDown,      setIsServiceDown]      = useState(false)
  const [unreadCount,        setUnreadCount]        = useState(1)
  // timestamp (ms) hasta el cual el chat está rate-limited; null si no aplica
  const [rateLimitedUntil,   setRateLimitedUntil]   = useState<number | null>(null)
  // segundos restantes; derivado del anterior con un setInterval
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null)

  const consecutiveErrors = useRef(0)
  const slowTimer         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const healthTimer       = useRef<ReturnType<typeof setInterval> | null>(null)

  // Contador de "generación" de requests. Cada request guarda su valor al iniciar;
  // si cuando resuelve ya no coincide con el actual (porque hubo un reset o un nuevo
  // envío), descartamos su resultado para no contaminar el estado nuevo.
  const requestGen = useRef(0)

  // One-shot al montar: limpiar residuos de versiones previas que persistían
  // el chat en localStorage. Se puede borrar este useEffect en unos meses
  // cuando ya nadie tenga datos viejos.
  useEffect(() => { pruneLegacyChatbotData() }, [])

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

  // ── Countdown de rate limit ─────────────────────────────────────────────────
  // Tickea cada segundo mientras rateLimitedUntil esté seteado. Cuando llega a
  // 0, libera el input.
  useEffect(() => {
    if (rateLimitedUntil === null) {
      setRateLimitRemaining(null)
      return
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((rateLimitedUntil - Date.now()) / 1000))
      if (remaining === 0) {
        setRateLimitedUntil(null)
        setRateLimitRemaining(null)
      } else {
        setRateLimitRemaining(remaining)
      }
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [rateLimitedUntil])

  // ── Núcleo: enviar un texto del usuario ya colocado en el historial ────────
  const submitToBot = useCallback(async (userMsgId: number, text: string) => {
    const myGen = ++requestGen.current

    setIsLoading(true)
    setIsSlowResponse(false)
    if (slowTimer.current) clearTimeout(slowTimer.current)
    slowTimer.current = setTimeout(() => {
      // No prender el aviso si en este momento ya no es nuestra generación
      // (otro reset o un nuevo envío reemplazó la request).
      if (myGen === requestGen.current) setIsSlowResponse(true)
    }, SLOW_RESPONSE_MS)

    try {
      const response = await chatbotService.getResponse(text, sessionId, user?.id)
      if (myGen !== requestGen.current) return  // descartado: hubo reset/envío nuevo

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
    } catch (err) {
      if (myGen !== requestGen.current) return  // descartado: hubo reset/envío nuevo

      // Rate limit (429): throttling intencional del backend, NO cuenta como fallo.
      // El mensaje del usuario sí llegó, el bot solo nos pide esperar.
      if (err instanceof ChatbotRateLimitError) {
        consecutiveErrors.current = 0
        setRateLimitedUntil(Date.now() + err.info.retryAfterSeconds * 1000)

        const botMsg: UIMessage = {
          id:   nextId(),
          role: 'bot',
          text: `⏳ ${err.info.message}`,
          time: getTime(),
        }
        setMessages(prev => [
          // El user message queda como 'sent' (sí llegó al backend)
          ...prev.map(m => m.id === userMsgId ? { ...m, status: 'sent' as const } : m),
          botMsg,
        ])
        setUnreadCount(prev => prev + 1)
        return  // no caer al manejo de error genérico
      }

      consecutiveErrors.current += 1

      // Marcar el mensaje del usuario como fallido (habilita botón Reintentar)
      setMessages(prev =>
        prev.map(m => m.id === userMsgId ? { ...m, status: 'failed' as const } : m),
      )

      if (consecutiveErrors.current >= FAILURE_THRESHOLD) {
        setIsServiceDown(true)
      }
    } finally {
      // Solo apagar el spinner/timer si seguimos siendo la generación vigente:
      // si no, una request más nueva los está usando y no queremos pisarla.
      if (myGen === requestGen.current) {
      setIsLoading(false)
      setIsSlowResponse(false)
      if (slowTimer.current) {
        clearTimeout(slowTimer.current)
        slowTimer.current = null
        }
      }
    }
  }, [sessionId, user?.id])

  // ── sendMessage ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading || isServiceDown || rateLimitedUntil !== null) return

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
  }, [isLoading, isServiceDown, rateLimitedUntil, submitToBot])

  // ── retryLastFailed ─────────────────────────────────────────────────────────
  // Busca el último mensaje del usuario marcado 'failed' y lo reenvía.
  // No crea un nuevo mensaje: actualiza el existente al estado 'sent' tentativo.
  const retryLastFailed = useCallback(() => {
    if (isLoading || isServiceDown || rateLimitedUntil !== null) return

    const lastFailed = [...messages].reverse().find(
      m => m.role === 'user' && m.status === 'failed',
    )
    if (!lastFailed) return

    setMessages(prev =>
      prev.map(m => m.id === lastFailed.id ? { ...m, status: 'sent' as const } : m),
    )
    submitToBot(lastFailed.id, lastFailed.text)
  }, [messages, isLoading, isServiceDown, rateLimitedUntil, submitToBot])

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
    // Invalidar cualquier request en vuelo: cuando resuelva, su generación ya
    // no coincidirá y no contaminará el nuevo estado.
    requestGen.current += 1
    if (slowTimer.current) {
      clearTimeout(slowTimer.current)
      slowTimer.current = null
    }

    // Nada que borrar en storage: el chat solo vive en memoria.
    setSessionId(crypto.randomUUID())
    setMessages([buildWelcome()])
    setInput('')
    setIsLoading(false)
    setIsSlowResponse(false)
    setUnreadCount(0)
    consecutiveErrors.current = 0
    setIsServiceDown(false)
  }, [])

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
    rateLimitRemaining,
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
