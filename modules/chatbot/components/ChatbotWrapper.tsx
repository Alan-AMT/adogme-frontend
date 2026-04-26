// modules/chatbot/components/ChatbotWrapper.tsx
// Orquestador del chatbot.
// Visible para visitantes (sin sesión) y adoptantes ('applicant').
//     Refugios y admins NO ven el chatbot.
'use client'

import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { useUIStore }   from '@/modules/shared/infrastructure/store/uiStore'
import { useChatbot }   from '../application/hooks/useChatbot'
import BubbleChatbot    from './bubbleChatbot'
import ChatbotPanel     from './ChatbotPanel'
import '../styles/chatbot.css'

export default function ChatbotWrapper() {
  const { user }        = useAuthStore()
  const isChatbotOpen   = useUIStore(s => s.isChatbotOpen)
  const openChatbot     = useUIStore(s => s.openChatbot)
  const closeChatbot    = useUIStore(s => s.closeChatbot)

  const chatbot = useChatbot()

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
