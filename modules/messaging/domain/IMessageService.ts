// modules/messaging/domain/IMessageService.ts
// Contrato del servicio de mensajería entre adoptante y refugio.

import type { Conversation, Message } from '@/modules/shared/domain/Message'

// ─── Data transfer object para crear una conversación ─────────────────────────

export interface CreateConversationData {
  perroId:        number
  adoptanteId:    number
  refugioId:      number
  solicitudId?:   number    // enlace opcional a una solicitud de adopción
  // Datos desnormalizados para mostrar sin join
  perroNombre?:     string
  perroFoto?:       string
  refugioNombre?:   string
  refugioLogo?:     string
  adoptanteNombre?: string
  adoptanteAvatar?: string
}

// ─── Interface del servicio ───────────────────────────────────────────────────

export interface IMessageService {
  /** Conversaciones del adoptante, ordenadas por último mensaje desc. */
  getConversations(adoptanteId: number): Promise<Conversation[]>

  /** Conversaciones del refugio (lado refugio), ordenadas por último mensaje desc. */
  getConversationsByShelterId(refugioId: number): Promise<Conversation[]>

  /** Mensajes de una conversación, ordenados por creadoEn asc. */
  getMessages(conversationId: number): Promise<Message[]>

  /** Envía un mensaje del adoptante y encola una respuesta automática del refugio. */
  sendMessage(
    conversationId: number,
    senderId:        number,
    texto:           string,
    senderNombre:    string,
    senderAvatar?:   string,
  ): Promise<Message>

  /** Crea una nueva conversación (puede ser antes de formalizar la solicitud). */
  createConversation(data: CreateConversationData): Promise<Conversation>

  /** Obtiene la conversación existente entre adoptante y refugio, o la crea si no existe. */
  getOrCreateConversation(data: CreateConversationData): Promise<Conversation>

  /** Resetea el contador de no leídos para el rol indicado. */
  markAsRead(conversationId: number, role: 'applicant' | 'shelter'): Promise<void>
}
