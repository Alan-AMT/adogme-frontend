// modules/chatbot/infrastructure/ChatbotErrors.ts
// Errores tipados del cliente del chatbot. Permiten al hook distinguir
// throttling (429) de un fallo genérico de red/servicio.

export interface RateLimitInfo {
  message:           string  // texto humano que muestra el bot
  retryAfterSeconds: number  // segundos hasta poder volver a enviar
  limit?:            string  // descripción humana del límite (ej. "10 per 1 minute")
}

export class ChatbotRateLimitError extends Error {
  readonly info: RateLimitInfo
  constructor(info: RateLimitInfo) {
    super(info.message)
    this.info = info
    this.name = 'ChatbotRateLimitError'
  }
}
