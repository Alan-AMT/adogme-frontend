// modules/messaging/components/ChatView.tsx
// Archivo 166 — orquestador del layout de mensajería.
//
// Desktop: ConversationList (320px) | ChatWindow (flex-grow)
// Mobile:  un panel a la vez — lista visible por defecto,
//          chat al seleccionar conversación (con botón "Volver").
//
// Navegación: al seleccionar una conversación usa router.push para actualizar la URL.
'use client'

import { useEffect, useState } from 'react'
import { useRouter }            from 'next/navigation'
import { useConversations }     from '../application/hooks/useConversations'
import ConversationList         from './ConversationList'
import ChatWindow               from './ChatWindow'
import '../styles/messaging.css'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatViewProps {
  conversationId: number   // viene del param de la URL (ya parseado)
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ChatView({ conversationId }: ChatViewProps) {
  const router   = useRouter()
  const { conversations, isLoading, totalUnread, markRead } = useConversations()

  // Mobile: controla si se muestra el panel de lista o el de chat
  const [mobileShowChat, setMobileShowChat] = useState(false)

  // Cuando llega un conversationId válido, mostrar el chat en mobile
  useEffect(() => {
    if (conversationId) setMobileShowChat(true)
  }, [conversationId])

  // Conversación seleccionada actual
  const selectedConversation = conversations.find(c => c.id === conversationId)

  // Al seleccionar conversación en la lista
  function handleSelect(id: number) {
    router.push(`/chat/${id}`)
    setMobileShowChat(true)
    markRead(id)
  }

  // Mobile — volver a la lista
  function handleBack() {
    setMobileShowChat(false)
    router.push(`/chat/${conversationId}`)   // mantiene URL pero muestra lista en mobile
  }

  return (
    <div className="ms-layout" style={{ position: 'relative' }}>

      {/* ── Sidebar — lista de conversaciones ── */}
      <div className={`ms-sidebar${mobileShowChat ? ' ms-sidebar--hidden' : ''}`}
           style={{ position: undefined }}>
        <ConversationList
          conversations={conversations}
          selectedId={conversationId}
          onSelect={handleSelect}
          isLoading={isLoading}
          totalUnread={totalUnread}
        />
      </div>

      {/* ── Área principal — chat o placeholder ── */}
      {conversationId ? (
        <ChatWindow
          conversationId={conversationId}
          conversation={selectedConversation}
          onBack={handleBack}
        />
      ) : (
        /* Estado vacío en desktop cuando no hay conversación seleccionada */
        <div className="ms-empty">
          <span
            className="material-symbols-outlined ms-empty__icon"
            style={{ fontVariationSettings: "'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48" }}
          >
            chat
          </span>
          <p className="ms-empty__title">Selecciona una conversación</p>
          <p className="ms-empty__sub">Elige un hilo de la lista para ver los mensajes</p>
        </div>
      )}

    </div>
  )
}
