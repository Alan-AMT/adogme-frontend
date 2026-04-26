// modules/chatbot/infrastructure/ChatbotService.ts
// Implementación real: llama POST /api/chat al microservicio del chatbot
// y mapea la respuesta del backend al BotResponse que consume la UI.

import axios from 'axios'
import { API_ENDPOINTS } from '@/modules/shared/infrastructure/api/endpoints'
import type { IChatbotService } from './IChatbotService'
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

interface ChatAction {
  type: ActionType
  data?: {
    dogs?:     ChatDogCard[]
    shelters?: ChatShelterCard[]
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

// ─── Mapeo action → links / cards ──────────────────────────────────────────

const MAX_CARDS = 3

function actionToLinks(action: ChatAction | null): ChatLink[] | undefined {
  if (!action) return undefined
  switch (action.type) {
    case 'redirect_login':
      return [{ label: 'Iniciar sesión',    href: '/login'         }]
    case 'redirect_quiz':
      return [{ label: 'Hacer el quiz ✨',  href: '/mi-match/quiz' }]
    default:
      return undefined
  }
}

function actionToCards(action: ChatAction | null): ChatCards | undefined {
  if (!action) return undefined
  if (action.type === 'show_dogs' && action.data?.dogs?.length) {
    return { type: 'dogs', items: action.data.dogs.slice(0, MAX_CARDS) }
  }
  if (action.type === 'show_shelters' && action.data?.shelters?.length) {
    return { type: 'shelters', items: action.data.shelters.slice(0, MAX_CARDS) }
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

    const { data } = await axios.post<ChatResponse>(
      API_ENDPOINTS.CHATBOT.MESSAGE,
      payload,
      { timeout: 15_000 },
    )

    return {
      text:        data.response,
      links:       actionToLinks(data.action),
      cards:       actionToCards(data.action),
      suggestions: data.suggestions ?? [],
      meta:        data.meta ?? undefined,
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
