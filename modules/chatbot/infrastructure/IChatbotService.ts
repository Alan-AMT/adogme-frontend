// modules/chatbot/infrastructure/IChatbotService.ts
import type { BotResponse } from '../domain/Chatbot'

export interface IChatbotService {
  /** Envía un mensaje al chatbot y recibe la respuesta.
   *  @param message  Texto del usuario
   *  @param sessionId UUID de la sesión actual (para trazabilidad en backend)
   *  @param userId   ID del adoptante autenticado, si lo hay
   */
  getResponse(message: string, sessionId: string, userId?: number): Promise<BotResponse>
}
