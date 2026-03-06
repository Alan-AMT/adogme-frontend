// modules/shared/domain/Message.ts
// Mensajería entre Adoptante y Refugio
// El diagrama tiene Chatbot (bot de FAQ) — aquí también tipamos la mensajería
// humana entre adoptante y refugio (conversaciones de solicitud)

// ─── Roles de remitente ───────────────────────────────────────────────────────

export type SenderRole = 'applicant' | 'shelter' | 'bot'

// ─── Mensaje individual ───────────────────────────────────────────────────────

export interface Message {
  id: number
  conversationId: number
  senderId: number
  senderRole: SenderRole
  senderNombre: string     // desnormalizado para no hacer join en cada render
  senderAvatar?: string
  texto: string
  adjuntos?: MessageAttachment[]
  leidoEn?: string         // ISO datetime — null si no leído
  creadoEn: string         // ISO datetime
}

export interface MessageAttachment {
  id: number
  url: string
  tipo: 'imagen' | 'documento'
  nombre: string
  tamanoKb: number
}

// ─── Conversación (hilo entre adoptante y refugio, ligado a un perro) ────────

export interface Conversation {
  id: number
  solicitudId?: number     // opcional — puede ser consulta previa a solicitud
  perroId: number
  adoptanteId: number
  refugioId: number
  ultimoMensaje?: string   // preview del último mensaje
  ultimoMensajeEn?: string // ISO datetime
  noLeidosPorAdoptante: number
  noLeidosPorRefugio: number
  creadaEn: string         // ISO datetime

  // Datos relacionados (joins)
  perroNombre?: string
  perroFoto?: string
  refugioNombre?: string
  refugioLogo?: string
  adoptanteNombre?: string
  adoptanteAvatar?: string
}

// ─── Chatbot (tabla del diagrama) ─────────────────────────────────────────────
// Tabla: id, adoptante_id, pregunta, respuesta, fecha

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
