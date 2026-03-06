// modules/messaging/components/ChatWindow.tsx
// Archivo 165 — ventana de mensajes de una conversación.
//
// • Burbujas: propia (roja, derecha) / otra parte (blanca, izquierda).
// • Separadores de fecha ("Hoy", "Ayer", "15 ene").
// • Scroll automático al montar y al recibir nuevo mensaje (via messagesEndRef de useChat).
// • Indicador "Escribiendo..." simulado: se activa al enviar y desaparece cuando
//   llega la respuesta del refugio (o tras 5.5 s).
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useChat }       from '../application/hooks/useChat'
import type { Conversation, Message } from '@/modules/shared/domain/Message'

// ─── Helpers de fecha ──────────────────────────────────────────────────────────

function formatDateLabel(isoDate: string): string {
  const d         = new Date(isoDate)
  const now       = new Date()
  const today     = new Date(now.getFullYear(),  now.getMonth(),  now.getDate())
  const msgDay    = new Date(d.getFullYear(),     d.getMonth(),    d.getDate())
  const diffDays  = Math.floor((today.getTime() - msgDay.getTime()) / 86400000)

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function formatMsgTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function msgDateKey(isoStr: string): string {
  return isoStr.split('T')[0]
}

// ─── Tipos internos ───────────────────────────────────────────────────────────

type MsgOrSep = { kind: 'sep'; label: string; key: string } | { kind: 'msg'; msg: Message }

function insertSeparators(messages: Message[]): MsgOrSep[] {
  const result: MsgOrSep[] = []
  let lastKey = ''

  for (const msg of messages) {
    const key = msgDateKey(msg.creadoEn)
    if (key !== lastKey) {
      result.push({ kind: 'sep', label: formatDateLabel(msg.creadoEn), key: `sep-${key}` })
      lastKey = key
    }
    result.push({ kind: 'msg', msg })
  }
  return result
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatWindowProps {
  conversationId: number
  conversation:   Conversation | undefined
  onBack?:        () => void   // mobile — volver a la lista
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ChatWindow({ conversationId, conversation, onBack }: ChatWindowProps) {
  const { messages, isLoading, isSending, error, messagesEndRef, sendMessage } = useChat(conversationId)

  // ── Input local ─────────────────────────────────────────────────────────────
  const [inputValue,      setInputValue]      = useState('')
  const [isPartnerTyping, setIsPartnerTyping] = useState(false)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // ── Typing indicator ─────────────────────────────────────────────────────────
  // Se activa tras enviar; se cancela cuando llega respuesta del refugio o tras 5.5s
  const prevMsgCount = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg?.senderRole !== 'applicant' && isPartnerTyping) {
        setIsPartnerTyping(false)
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      }
    }
    prevMsgCount.current = messages.length
  }, [messages, isPartnerTyping])

  useEffect(() => () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
  }, [])

  // ── Manejadores ──────────────────────────────────────────────────────────────
  async function handleSend() {
    const text = inputValue.trim()
    if (!text || isSending) return

    setInputValue('')
    await sendMessage(text)

    // Mostrar "Escribiendo..." por 5.5 s (max rango del auto-reply)
    setIsPartnerTyping(true)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => setIsPartnerTyping(false), 5500)

    // Re-focus input
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Items con separadores de fecha ───────────────────────────────────────────
  const items = insertSeparators(messages)

  // ── Panel de info colapsable ─────────────────────────────────────────────────
  const [infoOpen, setInfoOpen] = useState(false)

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="ms-chat">

      {/* Header */}
      <div className="ms-chat__header">
        {onBack && (
          <button
            className="ms-chat__header__back"
            onClick={onBack}
            aria-label="Volver a conversaciones"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          </button>
        )}

        {conversation?.perroFoto && (
          <div className="ms-chat__header__photo">
            <Image src={conversation.perroFoto} alt={conversation.perroNombre ?? ''} fill sizes="42px" />
          </div>
        )}

        <div className="ms-chat__header__info">
          <p className="ms-chat__header__name">{conversation?.perroNombre ?? 'Conversación'}</p>
          {conversation?.refugioNombre && (
            <p className="ms-chat__header__sub">{conversation.refugioNombre}</p>
          )}
        </div>

        <div className="ms-chat__header__actions">
          {/* Toggle info panel */}
          <button
            className="ms-chat__header__btn"
            onClick={() => setInfoOpen(v => !v)}
            title={infoOpen ? 'Ocultar info' : 'Ver info de la solicitud'}
            aria-label="Toggle información"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}
            >
              info
            </span>
          </button>
        </div>
      </div>

      {/* Panel colapsable de info de solicitud */}
      <div className={`ms-info-panel${infoOpen ? ' ms-info-panel--open' : ' ms-info-panel--closed'}`}>
        <div className="ms-info-panel__inner">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="ms-info-panel__label">Perro</p>
            <p className="ms-info-panel__value">{conversation?.perroNombre ?? '—'}</p>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="ms-info-panel__label">Refugio</p>
            <p className="ms-info-panel__value">{conversation?.refugioNombre ?? '—'}</p>
          </div>
          {conversation?.perroId && (
            <Link href={`/perros/${conversation.perroId}`} className="ms-info-panel__link">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 16" }}
              >
                open_in_new
              </span>
              Ver perfil
            </Link>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div className="ms-messages">

        {isLoading && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.78rem',
              color: '#a1a1aa',
              fontWeight: 500,
              marginTop: '2rem',
            }}
          >
            Cargando mensajes...
          </p>
        )}

        {error && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.78rem',
              color: '#dc2626',
              fontWeight: 500,
              marginTop: '2rem',
            }}
          >
            {error}
          </p>
        )}

        {!isLoading && items.map(item => {
          if (item.kind === 'sep') {
            return (
              <div key={item.key} className="ms-date-sep">
                <div className="ms-date-sep__line" />
                <span className="ms-date-sep__label">{item.label}</span>
                <div className="ms-date-sep__line" />
              </div>
            )
          }

          const msg   = item.msg
          const isOwn = msg.senderRole === 'applicant'

          return (
            <div key={msg.id} className={`ms-bubble-row${isOwn ? ' ms-bubble-row--own' : ''}`}>
              {/* Avatar de la otra parte */}
              {!isOwn && (
                <div className="ms-bubble-avatar">
                  {msg.senderAvatar ? (
                    <Image src={msg.senderAvatar} alt={msg.senderNombre} fill sizes="28px" />
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 18,
                        color: '#a1a1aa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20",
                      }}
                    >
                      pets
                    </span>
                  )}
                </div>
              )}

              {/* Burbuja + timestamp */}
              <div className="ms-bubble-wrap">
                <div className={`ms-bubble ms-bubble--${isOwn ? 'own' : 'other'}`}>
                  {msg.texto}
                </div>
                <p className="ms-bubble__time">
                  {formatMsgTime(msg.creadoEn)}
                  {isOwn && msg.leidoEn && (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 13,
                        color: '#a1a1aa',
                        fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14",
                      }}
                    >
                      done_all
                    </span>
                  )}
                </p>
              </div>
            </div>
          )
        })}

        {/* Indicador "Escribiendo..." */}
        {isPartnerTyping && (
          <div className="ms-typing-row">
            <div className="ms-bubble-avatar">
              {conversation?.refugioLogo ? (
                <Image src={conversation.refugioLogo} alt={conversation.refugioNombre ?? 'Refugio'} fill sizes="28px" />
              ) : (
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 18, color: '#a1a1aa',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
                    fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20",
                  }}
                >
                  pets
                </span>
              )}
            </div>
            <div className="ms-typing-bubble">
              <div className="ms-typing-dot" />
              <div className="ms-typing-dot" />
              <div className="ms-typing-dot" />
            </div>
          </div>
        )}

        {/* Anchor para scroll automático */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ms-input-area">
        <input
          ref={inputRef}
          type="text"
          className="ms-input"
          placeholder="Escribe un mensaje..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={1000}
          disabled={isLoading}
        />
        <button
          className="ms-send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || isSending || isLoading}
          aria-label="Enviar"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  )
}
