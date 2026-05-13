// modules/chatbot/components/ChatbotWrapper.tsx
// Orquestador del chatbot.
// Visible para visitantes (sin sesión) y adoptantes ('applicant').
//     Refugios y admins NO ven el chatbot.
//
// Maneja también las transiciones de autenticación:
//  - Cualquier cambio en user.id (login, logout, switch) limpia el chat.
//  - Si justo antes del login el usuario había hecho click en "Iniciar sesión"
//    desde el chatbot, retoma su intención automáticamente al volver logueado.
'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { useUIStore }   from '@/modules/shared/infrastructure/store/uiStore'
import { useChatbot }   from '../application/hooks/useChatbot'
import { consumePendingAction } from '../application/pendingAction'
import BubbleChatbot    from './bubbleChatbot'
import ChatbotPanel     from './ChatbotPanel'
import '../styles/chatbot.css'

export default function ChatbotWrapper() {
  const { user }        = useAuthStore()
  const isChatbotOpen   = useUIStore(s => s.isChatbotOpen)
  const openChatbot     = useUIStore(s => s.openChatbot)
  const closeChatbot    = useUIStore(s => s.closeChatbot)

  const chatbot = useChatbot()

  // ── Transición de auth (login/logout/switch) ────────────────────────────────
  // Trackeamos el último user.id observado. La primera ejecución se considera
  // hidratación del authStore (no es una transición real) y solo registra el
  // valor inicial.
  const lastSeenUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const current = user?.id ?? null

    // Primera vez: solo registramos. Cualquier subsecuente cambio sí es real.
    if (lastSeenUserId.current === undefined) {
      lastSeenUserId.current = current
      return
    }
    if (lastSeenUserId.current === current) return

    lastSeenUserId.current = current

    // Borrar chat anterior en cualquier transición (login, logout, switch user).
    chatbot.clearHistory()

    // Logout: nada más que hacer.
    if (current === null) return

    // Login: si había una intención pendiente (click previo en "Iniciar sesión"
    // desde el chatbot), retomarla automáticamente.
    const pending = consumePendingAction()
    if (!pending) return

    openChatbot()
    chatbot.markRead()

    // Pequeño delay para que el clearHistory anterior se asiente antes de enviar.
    const t = setTimeout(() => chatbot.sendMessage(pending), 200)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // ── Guardia de rol — visitantes y adoptantes pueden usar el chatbot ─────────
  const role = user?.role ?? 'visitor'
  if (role !== 'applicant' && role !== 'visitor') return null

  function handleOpen() {
    openChatbot()
    chatbot.markRead()
  }

  return (
    <>
      {!isChatbotOpen && (
        <BubbleChatbot
          onClick={handleOpen}
          unreadCount={chatbot.unreadCount}
        />
      )}

      {isChatbotOpen && (
        <ChatbotPanel
          messages={chatbot.messages}
          input={chatbot.input}
          isLoading={chatbot.isLoading}
          isSlowResponse={chatbot.isSlowResponse}
          isServiceDown={chatbot.isServiceDown}
          rateLimitRemaining={chatbot.rateLimitRemaining}
          currentSuggestions={chatbot.currentSuggestions}
          onClose={closeChatbot}
          setInput={chatbot.setInput}
          sendMessage={chatbot.sendMessage}
          retryLastFailed={chatbot.retryLastFailed}
          retryConnection={chatbot.retryConnection}
          clearHistory={chatbot.clearHistory}
        />
      )}
    </>
  )
}
