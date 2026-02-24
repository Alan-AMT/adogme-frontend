"use client";

import Image from "next/image";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { UIMessage, getBotResponse } from "../infrastructure/MockChatbot";
import "../styles/chatbot.css";

/* ── Quick reply suggestions ── */
const QUICK_REPLIES = [
  "¿Cómo adopto?",
  "¿Cuánto cuesta?",
  "Requisitos",
  "Ver refugios",
];

/* ── Helpers ── */
function getTime() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: UIMessage = {
  id: 0,
  role: "bot",
  text: "¡Hola! 🐾 Soy el asistente de aDOGme. Estoy aquí para ayudarte a encontrar a tu nuevo mejor amigo. ¿En qué te puedo ayudar hoy?",
  time: getTime(),
};

/* ── Component ── */
export default function BubbleChatbot() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<UIMessage[]>([WELCOME]);
  const [input, setInput]         = useState("");
  const [typing, setTyping]       = useState(false);
  const [hasNew, setHasNew]       = useState(true);
  const messagesEndRef             = useRef<HTMLDivElement>(null);
  const inputRef                   = useRef<HTMLInputElement>(null);

  /* Scroll to bottom on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: UIMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simula latencia del bot
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const botMsg: UIMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: getBotResponse(trimmed),
        time: getTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([{ ...WELCOME, time: getTime() }]);
  };

  /* ── Render ── */
  return (
    <>
      {/* ── Bubble trigger ── */}
      {!open && (
        <div className="cb-bubble">
          <button
            className="cb-bubble__btn"
            onClick={() => setOpen(true)}
            aria-label="Abrir chat"
          >
            <span className="material-symbols-outlined">chat</span>
          </button>
          {hasNew && <span className="cb-bubble__badge">1</span>}
        </div>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div className="cb-window" role="dialog" aria-label="Chat aDOGme">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header__avatar">
              <Image
                src="/assets/logos/adogme-logo.png"
                alt="aDOGme bot"
                width={40}
                height={40}
              />
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
                onClick={handleReset}
                title="Nueva conversación"
                aria-label="Reiniciar chat"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
              <button
                className="cb-header__icon-btn"
                onClick={() => setOpen(false)}
                title="Cerrar"
                aria-label="Cerrar chat"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            <p className="cb-date-sep">Hoy</p>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`cb-msg cb-msg--${msg.role}`}
              >
                {msg.role === "bot" && (
                  <div className="cb-msg__avatar">
                    <Image
                      src="/assets/logos/adogme-logo.png"
                      alt="bot"
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div>
                  <div className="cb-msg__bubble">{msg.text}</div>
                  <p className="cb-msg__time">{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="cb-typing">
                <div className="cb-msg__avatar">
                  <Image
                    src="/assets/logos/adogme-logo.png"
                    alt="bot"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="cb-typing__bubble">
                  <div className="cb-typing__dot" />
                  <div className="cb-typing__dot" />
                  <div className="cb-typing__dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies (solo cuando no hay conversación avanzada) */}
          {messages.length <= 2 && (
            <div className="cb-quick-replies">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  className="cb-quick-btn"
                  onClick={() => sendMessage(qr)}
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cb-input-area">
            <input
              ref={inputRef}
              type="text"
              className="cb-input"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={300}
              disabled={typing}
            />
            <button
              className="cb-send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              aria-label="Enviar mensaje"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
