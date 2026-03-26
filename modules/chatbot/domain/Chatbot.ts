// modules/chatbot/domain/Chatbot.ts
// Tipos del dominio del chatbot

// ─── Enlace rápido dentro de una respuesta ─────────────────────────────────

export interface ChatLink {
  label: string
  href:  string
}

// ─── Mensaje en la UI ──────────────────────────────────────────────────────

export interface UIMessage {
  id:           number
  role:         'user' | 'bot'
  text:         string
  time:         string
  links?:       ChatLink[]
  suggestions?: string[]   // chips que aparecen después de este mensaje del bot
}

// ─── Respuesta del servicio ────────────────────────────────────────────────

export interface BotResponse {
  text:         string
  links?:       ChatLink[]
  suggestions?: string[]
}

// ─── Intent reconocido ────────────────────────────────────────────────────

export interface ChatbotIntent {
  id:       string
  keywords: string[]
  response: BotResponse
}

// ─── Sugerencia rápida inicial ────────────────────────────────────────────

export interface QuickSuggestion {
  label:   string
  message: string
}
