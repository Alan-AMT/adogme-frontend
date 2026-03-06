// modules/messaging/components/ConversationList.tsx
// Archivo 164 — lista lateral de conversaciones.
// Muestra: foto del perro, nombre del perro + refugio, último mensaje, timestamp y badge de no leídos.

import Image from 'next/image'
import type { Conversation } from '@/modules/shared/domain/Message'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatConvTime(isoStr?: string): string {
  if (!isoStr) return ''
  const d   = new Date(isoStr)
  const now = new Date()

  const today     = new Date(now.getFullYear(),  now.getMonth(),  now.getDate())
  const msgDay    = new Date(d.getFullYear(),     d.getMonth(),    d.getDate())
  const diffDays  = Math.floor((today.getTime() - msgDay.getTime()) / 86400000)

  if (diffDays === 0) {
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000)
    if (diffMin < 1)  return 'Ahora'
    if (diffMin < 60) return `${diffMin}m`
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7)   return d.toLocaleDateString('es-MX', { weekday: 'short' })
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ConvSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="ms-conv-skeleton">
          <div className="ms-skeleton-circle" />
          <div className="ms-skeleton-lines">
            <div className="ms-skeleton-line ms-skeleton-line--lg" />
            <div className="ms-skeleton-line ms-skeleton-line--md" />
          </div>
        </div>
      ))}
    </>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ConversationListProps {
  conversations: Conversation[]
  selectedId:    number | null
  onSelect:      (id: number) => void
  isLoading:     boolean
  totalUnread:   number
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  totalUnread,
}: ConversationListProps) {
  return (
    <div className="ms-sidebar">
      {/* Encabezado */}
      <div className="ms-sidebar__header">
        <span className="ms-sidebar__title">
          Mensajes
          {totalUnread > 0 && (
            <span className="ms-sidebar__badge">{totalUnread > 9 ? '9+' : totalUnread}</span>
          )}
        </span>
      </div>

      {/* Lista */}
      <div className="ms-conv-list">
        {isLoading ? (
          <ConvSkeleton />
        ) : conversations.length === 0 ? (
          <p
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              fontSize: '0.82rem',
              color: '#a1a1aa',
              fontWeight: 500,
            }}
          >
            No tienes conversaciones aún.
          </p>
        ) : (
          conversations.map(conv => {
            const isActive  = conv.id === selectedId
            const hasUnread = conv.noLeidosPorAdoptante > 0

            return (
              <button
                key={conv.id}
                className={`ms-conv-item${isActive ? ' ms-conv-item--active' : ''}`}
                onClick={() => onSelect(conv.id)}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {/* Foto del perro */}
                <div className="ms-conv-item__photo">
                  {conv.perroFoto && (
                    <Image
                      src={conv.perroFoto}
                      alt={conv.perroNombre ?? 'Perro'}
                      fill
                      sizes="48px"
                    />
                  )}
                  {hasUnread && <span className="ms-conv-item__unread-dot" />}
                </div>

                {/* Cuerpo */}
                <div className="ms-conv-item__body">
                  <div className="ms-conv-item__top">
                    <span className={`ms-conv-item__name${hasUnread ? ' ms-conv-item__name--unread' : ''}`}>
                      {conv.perroNombre ?? 'Conversación'}
                    </span>
                    <span className="ms-conv-item__time">{formatConvTime(conv.ultimoMensajeEn)}</span>
                  </div>

                  <div className="ms-conv-item__bottom">
                    <span className={`ms-conv-item__preview${hasUnread ? ' ms-conv-item__preview--unread' : ''}`}>
                      {conv.refugioNombre && `${conv.refugioNombre}: `}
                      {conv.ultimoMensaje ?? 'Sin mensajes'}
                    </span>

                    {hasUnread && (
                      <span className="ms-conv-item__badge">
                        {conv.noLeidosPorAdoptante > 9 ? '9+' : conv.noLeidosPorAdoptante}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
