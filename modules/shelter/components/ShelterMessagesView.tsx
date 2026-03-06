// modules/shelter/components/ShelterMessagesView.tsx
// Vista de mensajería del lado del refugio.
// Reutiliza ConversationList y ChatWindow del módulo de mensajería.
// La URL activa de conversación se maneja con un estado local en vez de URL params,
// ya que el refugio tiene su propio layout de dashboard.
'use client'

import { useState, useEffect } from 'react'
import { useShelterConversations } from '@/modules/messaging/application/hooks/useShelterConversations'
import ConversationList from '@/modules/messaging/components/ConversationList'
import ChatWindow       from '@/modules/messaging/components/ChatWindow'
import '@/modules/messaging/styles/messaging.css'

export default function ShelterMessagesView() {
  const { conversations, isLoading, totalUnread, markRead } = useShelterConversations()
  const [selectedId,      setSelectedId]      = useState<number>(0)
  const [mobileShowChat,  setMobileShowChat]  = useState(false)

  // Seleccionar primera conversación al cargar
  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id)
    }
  }, [conversations, selectedId])

  const selectedConversation = conversations.find(c => c.id === selectedId)

  function handleSelect(id: number) {
    setSelectedId(id)
    setMobileShowChat(true)
    markRead(id)
  }

  function handleBack() {
    setMobileShowChat(false)
  }

  return (
    <div
      className="ms-layout"
      style={{
        // En el dashboard, el layout ya tiene padding/header propios.
        // Ajustamos la altura para que quepa dentro del contenedor del dashboard.
        height: 'calc(100dvh - 120px)',
        borderRadius: '1.2rem',
        overflow: 'hidden',
        border: '1.5px solid #f0f0f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Sidebar */}
      <div className={`ms-sidebar${mobileShowChat ? ' ms-sidebar--hidden' : ''}`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
          isLoading={isLoading}
          totalUnread={totalUnread}
        />
      </div>

      {/* Chat o placeholder */}
      {selectedId ? (
        <ChatWindow
          conversationId={selectedId}
          conversation={selectedConversation}
          onBack={mobileShowChat ? handleBack : undefined}
        />
      ) : (
        <div className="ms-empty">
          <span
            className="material-symbols-outlined ms-empty__icon"
            style={{ fontVariationSettings: "'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48" }}
          >
            chat
          </span>
          <p className="ms-empty__title">Selecciona una conversación</p>
          <p className="ms-empty__sub">Los mensajes de los adoptantes aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}
