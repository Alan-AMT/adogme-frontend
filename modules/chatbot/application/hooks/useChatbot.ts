// modules/chatbot/application/hooks/useChatbot.ts
// Estado del chatbot: historial de mensajes, envío, detección de intent.
// C3: pasa sessionId y userId al servicio.
// C4: persiste historial en localStorage por sessionId.
// Latencia simulada 800–1400 ms para naturalidad.
'use client'

import { useState, useCallback, useEffect } from 'react'
import { chatbotService } from '../../infrastructure/ChatbotServiceFactory'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import type { UIMessage } from '../../domain/Chatbot'

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
  unreadCount:        number          // mensajes del bot no leídos (badge)
  sessionId:          string          // UUID de la sesión actual
  currentSuggestions: string[]        // chips del último mensaje bot

  // Acciones
  setInput:      (v: string) => void
  sendMessage:   (text: string) => void
  clearHistory:  () => void           // reinicia historial + sesión
  markRead:      () => void           // resetea unreadCount a 0
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
  // C3 — leer userId del store para pasarlo al servicio
  const user = useAuthStore(s => s.user)

  // C4 — sessionId estable por sesión de browser; persiste mientras no se limpia
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return crypto.randomUUID()
    return sessionStorage.getItem('chatbot-sid') ?? (() => {
      const sid = crypto.randomUUID()
      sessionStorage.setItem('chatbot-sid', sid)
      return sid
    })()
  })

  // C4 — Inicializar mensajes desde localStorage si existe el historial
  const [messages, setMessages] = useState<UIMessage[]>(() => {
    if (typeof window === 'undefined') return [buildWelcome()]
    const cached = loadHistory(
      sessionStorage.getItem('chatbot-sid') ?? ''
    )
    return cached ?? [buildWelcome()]
  })

  const [input,       setInput]       = useState('')
  const [isLoading,   setIsLoading]   = useState(false)
  const [unreadCount, setUnreadCount] = useState(1)   // 1 = bienvenida no leída

  // C4 — Persistir historial cada vez que cambian los mensajes
  useEffect(() => {
    saveHistory(sessionId, messages)
  }, [messages, sessionId])

  // ── sendMessage ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: UIMessage = {
      id:   nextId(),
      role: 'user',
      text: trimmed,
      time: getTime(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const delay = 800 + Math.random() * 600
    setTimeout(async () => {
      // C3 — pasar sessionId y userId al servicio
      const response = await chatbotService.getResponse(trimmed, sessionId, user?.id)
      const botMsg: UIMessage = {
        id:          nextId(),
        role:        'bot',
        text:        response.text,
        time:        getTime(),
        links:       response.links,
        suggestions: response.suggestions,
      }
      setMessages(prev => [...prev, botMsg])
      setIsLoading(false)
      // Solo incrementa si el panel está cerrado (el wrapper maneja markRead al abrir)
      setUnreadCount(prev => prev + 1)
    }, delay)
  }, [isLoading])

  // ── clearHistory ────────────────────────────────────────────────────────────
  const clearHistory = useCallback(() => {
    // C4 — limpiar historial en localStorage y generar nueva sesión
    try { localStorage.removeItem(historyKey(sessionId)) } catch { /* noop */ }
    const newSid = crypto.randomUUID()
    sessionStorage.setItem('chatbot-sid', newSid)
    setSessionId(newSid)
    setMessages([buildWelcome()])
    setInput('')
    setIsLoading(false)
    setUnreadCount(0)
  }, [sessionId])

  // ── markRead ────────────────────────────────────────────────────────────────
  const markRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  // ── Sugerencias actuales (del último mensaje bot) ───────────────────────────
  const lastBotMsg         = [...messages].reverse().find(m => m.role === 'bot')
  const currentSuggestions = lastBotMsg?.suggestions ?? []

  return {
    messages,
    input,
    isLoading,
    unreadCount,
    sessionId,
    currentSuggestions,
    setInput,
    sendMessage,
    clearHistory,
    markRead,
  }
}
