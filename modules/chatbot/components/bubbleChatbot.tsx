// modules/chatbot/components/bubbleChatbot.tsx
// Botón flotante del chatbot — trigger con badge de no leídos y animación de pulso.

interface BubbleChatbotProps {
  onClick:     () => void
  unreadCount: number
}

export default function BubbleChatbot({ onClick, unreadCount }: BubbleChatbotProps) {
  const hasUnread = unreadCount > 0

  return (
    <div className="cb-bubble">
      <button
        className={`cb-bubble__btn${hasUnread ? ' cb-bubble__btn--pulse' : ''}`}
        onClick={onClick}
        aria-label="Abrir chat de asistente"
      >
        <span className="material-symbols-outlined">chat</span>
      </button>
      {hasUnread && (
        <span className="cb-bubble__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
      )}
    </div>
  )
}
