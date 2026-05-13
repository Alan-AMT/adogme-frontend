// modules/chatbot/infrastructure/ChatbotService.ts
// Implementación real: llama POST /api/chat al microservicio del chatbot
// y mapea la respuesta del backend al BotResponse que consume la UI.

import axios from 'axios'
import { API_ENDPOINTS } from '@/modules/shared/infrastructure/api/endpoints'
import type { IChatbotService } from './IChatbotService'
import { ChatbotRateLimitError } from './ChatbotErrors'
import type {
  BotResponse,
  ChatCards,
  ChatDogCard,
  ChatLink,
  ChatMeta,
  ChatShelterCard,
  HealthResponse,
} from '../domain/Chatbot'

// ─── Tipos del backend ─────────────────────────────────────────────────────

interface ChatRequest {
  message:    string
  session_id: string
  user_id:    string | null
}

type ActionType = 'show_dogs' | 'show_shelters' | 'redirect_login' | 'redirect_quiz'

// El backend puede devolver el listado como array plano o como wrapper paginado:
//   { data: T[], total, page, totalPages, limit }
type Paginated<T> = { data: T[]; total?: number; page?: number; totalPages?: number; limit?: number }
type MaybePaginated<T> = T[] | Paginated<T> | undefined

interface ChatAction {
  type: ActionType
  data?: {
    dogs?:     MaybePaginated<ChatDogCard>
    shelters?: MaybePaginated<ChatShelterCard>
  }
}

interface ChatResponse {
  response:    string
  intent:      string
  confidence:  number
  action:      ChatAction | null
  suggestions: string[]
  meta:        ChatMeta | null
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const MAX_CARDS = 4

function unwrap<T>(raw: MaybePaginated<T>): T[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw.data)) return raw.data
  return []
}

// ─── Mapeo action → links / cards ──────────────────────────────────────────

function actionToLinks(action: ChatAction | null, intent: string): ChatLink[] | undefined {
  if (!action) return undefined

  switch (action.type) {
    case 'redirect_login':
      return [{ label: 'Iniciar sesión', href: '/login' }]

    case 'redirect_quiz':
      return [{ label: 'Hacer el quiz ✨', href: '/mi-match/quiz' }]

    case 'show_dogs':
      // Para matches personalizados → /mi-match. Para listado general → /perros.
      return intent === 'dog_match'
        ? [{ label: 'Ver todos mis matches', href: '/mi-match' }]
        : [{ label: 'Ver todos los perros',  href: '/perros'   }]

    case 'show_shelters':
      return [{ label: 'Ver todos los refugios', href: '/refugios' }]

    default:
      return undefined
  }
}
//handlers acciones enviasdas desde el chatbot a cards en ui 
function actionToCards(action: ChatAction | null): ChatCards | undefined {
  if (!action) return undefined

  if (action.type === 'show_dogs') {
    const dogs = unwrap<ChatDogCard>(action.data?.dogs)
    if (dogs.length === 0) return undefined
    return { type: 'dogs', items: dogs.slice(0, MAX_CARDS) }
  }

  if (action.type === 'show_shelters') {
    const shelters = unwrap<ChatShelterCard>(action.data?.shelters)
    if (shelters.length === 0) return undefined
    return { type: 'shelters', items: shelters.slice(0, MAX_CARDS) }
  }

  return undefined
}

// ─── Servicio ──────────────────────────────────────────────────────────────

export class ChatbotService implements IChatbotService {
  async getResponse(message: string, sessionId: string, userId?: string): Promise<BotResponse> {
    const payload: ChatRequest = {
      message,
      session_id: sessionId,
      user_id:    userId ?? null,
    }

    try {
      const { data } = await axios.post<ChatResponse>(
        API_ENDPOINTS.CHATBOT.MESSAGE,
        payload,
        { timeout: 15_000 },
      )

      return {
        text:        data.response,
        links:       actionToLinks(data.action, data.intent),
        cards:       actionToCards(data.action),
        suggestions: data.suggestions ?? [],
        meta:        data.meta ?? undefined,
      }
    } catch (err) {
      // 429 Too Many Requests → lanzar error tipado para que el hook lo distinga
      // de un error genérico (no debe contar al circuit breaker).
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        const body = err.response.data as {
          message?: string
          retry_after_seconds?: number
          limit?: string
        } | undefined

        // Fallback al header Retry-After si el body no lo trae.
        const headerRetry = Number(err.response.headers['retry-after'])
        const retryAfterSeconds =
          body?.retry_after_seconds ??
          (Number.isFinite(headerRetry) ? headerRetry : 60)

        throw new ChatbotRateLimitError({
          message: body?.message ?? 'Estás enviando mensajes muy rápido. Espera un momento 🐾',
          retryAfterSeconds,
          limit: body?.limit,
        })
      }
      throw err
    }
  }

  async healthCheck(): Promise<HealthResponse> {
    const { data } = await axios.get<HealthResponse>(
      API_ENDPOINTS.CHATBOT.HEALTH,
      { timeout: 5_000 },
    )
    return data
  }
}
