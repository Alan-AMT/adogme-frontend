// modules/messaging/infrastructure/MockMessageService.ts
// Archivo 161 — servicio de mensajería en memoria.
//
// • Mantiene estado mutable (shallow-copy de los datos mock al instanciar).
// • sendMessage() encola una respuesta automática del refugio a los 3–5 s.
// • getMessages() devuelve siempre el array actualizado → el hook de polling
//   lo detecta cuando crece.

import type { IMessageService, CreateConversationData } from '../domain/IMessageService'
import type { Conversation, Message } from '@/modules/shared/domain/Message'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
} from '@/modules/shared/mockData/messages.mock'

// ─── Respuestas automáticas del refugio ──────────────────────────────────────

const SHELTER_AUTO_REPLIES: string[] = [
  '¡Hola! Gracias por tu mensaje. Lo revisaremos y te responderemos a la brevedad. 🐾',
  'Recibimos tu consulta. Un integrante del equipo te contactará pronto.',
  '¡Gracias por escribirnos! Estamos revisando tu mensaje y te damos respuesta en breve.',
  'Hola, notamos tu mensaje. Te respondemos en cuanto podamos. Mientras, ¡no dudes en revisar nuestro catálogo!',
  '¡Recibido! Te avisaremos cuando tengamos novedades. 😊',
]

// ─── Counter de IDs ───────────────────────────────────────────────────────────

let _nextId = 5000

function nextId(): number { return _nextId++ }
function nowISO(): string  { return new Date().toISOString() }

// ─── Servicio ─────────────────────────────────────────────────────────────────

export class MockMessageService implements IMessageService {

  // Estado mutable en memoria — inicializado con deep-copy del mock
  private _conversations: Conversation[]
  private _messages:      Record<number, Message[]>

  constructor() {
    this._conversations = MOCK_CONVERSATIONS.map(c => ({ ...c }))

    this._messages = {}
    for (const [key, msgs] of Object.entries(MOCK_MESSAGES)) {
      this._messages[Number(key)] = msgs.map(m => ({ ...m }))
    }
  }

  // ── getConversations ────────────────────────────────────────────────────────

  async getConversations(adoptanteId: number): Promise<Conversation[]> {
    return this._conversations
      .filter(c => c.adoptanteId === adoptanteId)
      .sort((a, b) => {
        const tA = a.ultimoMensajeEn ? new Date(a.ultimoMensajeEn).getTime() : 0
        const tB = b.ultimoMensajeEn ? new Date(b.ultimoMensajeEn).getTime() : 0
        return tB - tA   // más reciente primero
      })
  }

  // ── getConversationsByShelterId ─────────────────────────────────────────────

  async getConversationsByShelterId(refugioId: number): Promise<Conversation[]> {
    return this._conversations
      .filter(c => c.refugioId === refugioId)
      .sort((a, b) => {
        const tA = a.ultimoMensajeEn ? new Date(a.ultimoMensajeEn).getTime() : 0
        const tB = b.ultimoMensajeEn ? new Date(b.ultimoMensajeEn).getTime() : 0
        return tB - tA
      })
  }

  // ── getMessages ─────────────────────────────────────────────────────────────

  async getMessages(conversationId: number): Promise<Message[]> {
    return this._messages[conversationId] ?? []
  }

  // ── sendMessage ─────────────────────────────────────────────────────────────

  async sendMessage(
    conversationId: number,
    senderId:        number,
    texto:           string,
    senderNombre:    string,
    senderAvatar?:   string,
  ): Promise<Message> {
    const now = nowISO()

    const msg: Message = {
      id:             nextId(),
      conversationId,
      senderId,
      senderRole:    'applicant',
      senderNombre,
      senderAvatar,
      texto:          texto.trim(),
      leidoEn:        now,
      creadoEn:       now,
    }

    if (!this._messages[conversationId]) {
      this._messages[conversationId] = []
    }
    this._messages[conversationId].push(msg)

    // Actualizar preview de la conversación
    const conv = this._conversations.find(c => c.id === conversationId)
    if (conv) {
      conv.ultimoMensaje    = texto.trim()
      conv.ultimoMensajeEn  = now
      conv.noLeidosPorRefugio += 1
    }

    // Encolar respuesta automática del refugio (3–5 s)
    this._scheduleAutoReply(conversationId)

    return msg
  }

  // ── Auto-reply interno ──────────────────────────────────────────────────────

  private _scheduleAutoReply(conversationId: number): void {
    const delay = 3000 + Math.random() * 2000

    setTimeout(() => {
      const conv = this._conversations.find(c => c.id === conversationId)
      if (!conv) return

      const now   = nowISO()
      const texto = SHELTER_AUTO_REPLIES[
        Math.floor(Math.random() * SHELTER_AUTO_REPLIES.length)
      ]

      const reply: Message = {
        id:             nextId(),
        conversationId,
        senderId:       201,    // ID genérico del usuario refugio
        senderRole:    'shelter',
        senderNombre:   conv.refugioNombre ?? 'Refugio',
        senderAvatar:   conv.refugioLogo,
        texto,
        leidoEn:        undefined,  // no leído por el adoptante
        creadoEn:       now,
      }

      this._messages[conversationId].push(reply)

      // Actualizar preview y contador de no leídos
      conv.ultimoMensaje       = texto
      conv.ultimoMensajeEn     = now
      conv.noLeidosPorAdoptante += 1
    }, delay)
  }

  // ── createConversation ──────────────────────────────────────────────────────

  async createConversation(data: CreateConversationData): Promise<Conversation> {
    const now = nowISO()
    const conv: Conversation = {
      id:                   nextId(),
      solicitudId:          data.solicitudId,
      perroId:              data.perroId,
      adoptanteId:          data.adoptanteId,
      refugioId:            data.refugioId,
      noLeidosPorAdoptante: 0,
      noLeidosPorRefugio:   0,
      creadaEn:             now,
      perroNombre:          data.perroNombre,
      perroFoto:            data.perroFoto,
      refugioNombre:        data.refugioNombre,
      refugioLogo:          data.refugioLogo,
      adoptanteNombre:      data.adoptanteNombre,
      adoptanteAvatar:      data.adoptanteAvatar,
    }
    this._conversations.push(conv)
    this._messages[conv.id] = []
    return conv
  }

  // ── getOrCreateConversation ─────────────────────────────────────────────────

  async getOrCreateConversation(data: CreateConversationData): Promise<Conversation> {
    const existing = this._conversations.find(
      c => c.adoptanteId === data.adoptanteId && c.refugioId === data.refugioId
    )
    if (existing) return existing
    return this.createConversation(data)
  }

  // ── markAsRead ──────────────────────────────────────────────────────────────

  async markAsRead(conversationId: number, role: 'applicant' | 'shelter'): Promise<void> {
    const conv = this._conversations.find(c => c.id === conversationId)
    if (!conv) return

    if (role === 'applicant') {
      conv.noLeidosPorAdoptante = 0
    } else {
      conv.noLeidosPorRefugio = 0
    }
  }
}
