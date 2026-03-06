// modules/chatbot/components/ChatbotPanel.tsx
// Panel expandido del chatbot — historial de mensajes, indicador de escritura,
// sugerencias contextuales e input.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { KeyboardEvent, useEffect, useRef } from 'react'
import type { UIMessage } from '../domain/Chatbot'
import ChatbotSuggestions from './ChatbotSuggestions'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatbotPanelProps {
  messages:            UIMessage[]
  input:               string
  isLoading:           boolean
  currentSuggestions:  string[]
  onClose:             () => void
  setInput:            (v: string) => void
  sendMessage:         (text: string) => void
  clearHistory:        () => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ChatbotPanel({
  messages,
  input,
  isLoading,
  currentSuggestions,
  onClose,
  setInput,
  sendMessage,
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
            <span className="cb-header__dot" />
            En línea
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

      {/* ── Mensajes ── */}
      <div className="cb-messages">
        <p className="cb-date-sep">Hoy</p>

        {messages.map(msg => (
          <div key={msg.id} className={`cb-msg cb-msg--${msg.role}`}>
            {msg.role === 'bot' && (
              <div className="cb-msg__avatar">
                <Image src="/assets/logos/adogme-logo.png" alt="bot" width={32} height={32} />
              </div>
            )}
            <div>
              <div className="cb-msg__bubble">
                {/* Texto con saltos de línea */}
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </span>
                ))}

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
              <p className="cb-msg__time">{msg.time}</p>
            </div>
          </div>
        ))}

        {/* Indicador de escritura */}
        {isLoading && (
          <div className="cb-isLoading">
            <div className="cb-msg__avatar">
              <Image src="/assets/logos/adogme-logo.png" alt="bot" width={32} height={32} />
            </div>
            <div className="cb-isLoading__bubble">
              <div className="cb-isLoading__dot" />
              <div className="cb-isLoading__dot" />
              <div className="cb-isLoading__dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Sugerencias contextuales ── */}
      <ChatbotSuggestions
        suggestions={currentSuggestions}
        onSelect={sendMessage}
        disabled={isLoading}
      />

      {/* ── Input ── */}
      <div className="cb-input-area">
        <input
          ref={inputRef}
          type="text"
          className="cb-input"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={300}
          disabled={isLoading}
        />
        <button
          className="cb-send-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          aria-label="Enviar mensaje"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  )
}
