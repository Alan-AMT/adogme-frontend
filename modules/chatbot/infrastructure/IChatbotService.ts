// modules/chatbot/infrastructure/IChatbotService.ts
import type { BotResponse, HealthResponse } from '../domain/Chatbot'

export interface IChatbotService {
  /** Envía un mensaje al chatbot y recibe la respuesta.
   *  @param message  Texto del usuario
   *  @param sessionId UUID de la sesión actual (para trazabilidad en backend)
   *  @param userId   ID del adoptante autenticado, si lo hay
   */
  getResponse(message: string, sessionId: string, userId?: string): Promise<BotResponse>

  /** Consulta el estado de salud del servicio. No consume cuota de Gemini.
   *  Lanza error si no se puede contactar al backend.
   */
  healthCheck(): Promise<HealthResponse>
}
