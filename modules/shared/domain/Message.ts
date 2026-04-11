// modules/shared/domain/Message.ts

// ─── Chatbot ──────────────────────────────────────────────────────────────────

export interface ChatbotMessage {
  id: number
  adoptanteId: number
  pregunta: string         // texto libre del usuario
  respuesta: string        // respuesta del bot (texto o markdown)
  fecha: string            // ISO date
}

export interface ChatbotSession {
  adoptanteId?: number     // null si es visitante no autenticado
  historial: ChatbotMessage[]
}
