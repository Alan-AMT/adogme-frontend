// modules/chatbot/components/ChatbotPanel.tsx
// Panel expandido del chatbot — historial de mensajes, indicador de escritura,
// sugerencias contextuales, manejo de errores y entrada del usuario.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { KeyboardEvent, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import type { ChatMeta, UIMessage } from '../domain/Chatbot'
import ChatbotSuggestions from './ChatbotSuggestions'
import ChatDogCard       from './ChatDogCard'
import ChatShelterCard   from './ChatShelterCard'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatbotPanelProps {
  messages:            UIMessage[]
  input:               string
  isLoading:           boolean
  isSlowResponse:      boolean
  isServiceDown:       boolean
  currentSuggestions:  string[]
  onClose:             () => void
  setInput:            (v: string) => void
  sendMessage:         (text: string) => void
  retryLastFailed:     () => void
  retryConnection:     () => void
  clearHistory:        () => void
}

// ─── Markdown allowlist ──────────────────────────────────────────────────────
const MD_ALLOWED = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'code']

// ─── Etiqueta humana de respuesta degradada ──────────────────────────────────
function degradedLabel(meta: ChatMeta): string {
  if (meta.reason === 'rate_limit' && meta.retry_after_seconds) {
    return `⚠️ Servicio limitado · disponible en ~${meta.retry_after_seconds}s`
  }
  switch (meta.reason) {
    case 'rate_limit':       return '⚠️ Servicio limitado · intenta de nuevo en unos segundos'
    case 'timeout':           return '⚠️ Respuesta tardó demasiado'
    case 'gemini_error':     return '⚠️ Respuesta limitada'
    case 'no_api_key':       return '⚠️ Modo básico'
    case 'empty_response':   return '⚠️ Respuesta limitada'
    case 'connection_error': return '⚠️ Conexión limitada'
    default:                  return '⚠️ Respuesta limitada'
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ChatbotPanel({
  messages,
  input,
  isLoading,
  isSlowResponse,
  isServiceDown,
  currentSuggestions,
  onClose,
  setInput,
  sendMessage,
  retryLastFailed,
  retryConnection,
  clearHistory,
}: ChatbotPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus al input al abrir
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(timer)
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ¿El último mensaje del usuario falló y no está cargando? → mostrar Reintentar
  const lastMsg          = messages[messages.length - 1]
  const showRetryFailed  = !isLoading && !isServiceDown
                            && lastMsg?.role === 'user'
                            && lastMsg.status === 'failed'

  const inputDisabled = isLoading || isServiceDown

  return (
    <div className="cb-window" role="dialog" aria-label="Chat aDOGme">

      {/* ── Header ── */}
      <div className="cb-header">
        <div className="cb-header__avatar">
          <Image src="/assets/logos/adogme-logo.png" alt="aDOGme bot" width={40} height={40} />
        </div>
        <div className="cb-header__info">
          <p className="cb-header__name">aDOGme Asistente</p>
          <p className="cb-header__status">
            <span className={`cb-header__dot${isServiceDown ? ' cb-header__dot--down' : ''}`} />
            {isServiceDown ? 'No disponible' : 'En línea'}
          </p>
        </div>
        <div className="cb-header__actions">
          <button
            className="cb-header__icon-btn"
            onClick={clearHistory}
            title="Nueva conversación"
            aria-label="Reiniciar chat"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <button
            className="cb-header__icon-btn"
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar chat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* ── Banner de servicio caído ── */}
      {isServiceDown && (
        <div className="cb-banner cb-banner--down" role="alert">
          <span className="cb-banner__text">
            El asistente no está disponible en este momento.
          </span>
          <button className="cb-banner__btn" onClick={retryConnection}>
            Reintentar conexión
          </button>
        </div>
      )}

      {/* ── Mensajes ── */}
      <div className="cb-messages">
        <p className="cb-date-sep">Hoy</p>

        {messages.map(msg => (
          <div key={msg.id} className={`cb-msg cb-msg--${msg.role}${msg.status === 'failed' ? ' cb-msg--failed' : ''}`}>
            {msg.role === 'bot' && (
              <div className="cb-msg__avatar">
                <Image src="/assets/logos/adogme-logo.png" alt="bot" width={32} height={32} />
              </div>
            )}
            <div>
              <div className="cb-msg__bubble">
                {/* Texto del mensaje (Markdown para bot, plano para usuario) */}
                {msg.role === 'bot'
                  ? (
                    <div className="cb-msg__md">
                      <ReactMarkdown allowedElements={MD_ALLOWED} unwrapDisallowed>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )
                  : msg.text.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))
                }

                {/* Tarjetas de perros / refugios */}
                {msg.cards && msg.cards.items.length > 0 && (
                  <div className="cb-msg__cards">
                    {msg.cards.type === 'dogs'
                      ? msg.cards.items.map(d => <ChatDogCard     key={d.id} dog={d}     />)
                      : msg.cards.items.map(s => <ChatShelterCard key={s.id} shelter={s} />)
                    }
                  </div>
                )}

                {/* Links dentro de la burbuja */}
                {msg.links && msg.links.length > 0 && (
                  <div className="cb-msg__links">
                    {msg.links.map(link => (
                      <Link key={link.href} href={link.href} className="cb-msg__link">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 13, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 14" }}
                        >
                          arrow_forward
                        </span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Badge de respuesta degradada */}
              {msg.role === 'bot' && msg.meta?.degraded && (
                <p className="cb-msg__degraded">{degradedLabel(msg.meta)}</p>
              )}

              {/* Estado de fallo en mensaje del usuario */}
              {msg.role === 'user' && msg.status === 'failed' && (
                <p className="cb-msg__failed-hint">No se pudo enviar</p>
              )}

              <p className="cb-msg__time">{msg.time}</p>
            </div>
          </div>
        ))}

        {/* Indicador de escritura */}
        {isLoading && (
          <div className="cb-typing">
            <div className="cb-msg__avatar">
              <Image src="/assets/logos/adogme-logo.png" alt="bot" width={32} height={32} />
            </div>
            <div>
              <div className="cb-typing__bubble">
                <div className="cb-typing__dot" />
                <div className="cb-typing__dot" />
                <div className="cb-typing__dot" />
              </div>
              {isSlowResponse && (
                <p className="cb-typing__slow">Esto está tardando un poco más de lo normal…</p>
              )}
            </div>
          </div>
        )}

        {/* Botón Reintentar tras fallo puntual */}
        {showRetryFailed && (
          <div className="cb-retry-row">
            <button className="cb-retry-btn" onClick={retryLastFailed}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
              Reintentar mensaje
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Sugerencias contextuales ── */}
      <ChatbotSuggestions
        suggestions={currentSuggestions}
        onSelect={sendMessage}
        disabled={inputDisabled}
      />

      {/* ── Input ── */}
      <div className="cb-input-area">
        <input
          ref={inputRef}
          type="text"
          className="cb-input"
          placeholder={isServiceDown ? 'Asistente no disponible…' : 'Escribe tu pregunta...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={300}
          disabled={inputDisabled}
        />
        <button
          className="cb-send-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || inputDisabled}
          aria-label="Enviar mensaje"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  )
}
