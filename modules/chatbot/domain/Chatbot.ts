// modules/chatbot/domain/Chatbot.ts
// Tipos del dominio del chatbot

// ─── Enlace rápido dentro de una respuesta ─────────────────────────────────

export interface ChatLink {
  label: string
  href:  string
}

// ─── Tarjetas embebidas (perros / refugios) ────────────────────────────────

export interface ChatDogCard {
  id:                  string
  name:                string
  age:                 number              // edad en MESES (la formatea el componente)
  breed?:              string
  breed2?:             string              // raza secundaria si es mestizo
  ageCategory?:        string              // "cachorro" | "joven" | "adulto" | "senior"
  size?:               string              // "pequeño" | "mediano" | "grande"
  sex?:                string              // "macho" | "hembra"
  energyLevel?:        string
  furLength?:          string
  weightKg?:           number
  status?:             string
  health?:             string
  photo?:              string | null
  shelterId?:          string
  shelterName?:        string | null
  isVaccinated?:       boolean
  isDewormed?:         boolean
  sterilized?:         boolean
  goodWithKids?:       boolean
  goodWithDogs?:       boolean
  goodWithCats?:       boolean
  needsYard?:          boolean
  personality?:        string              // tags separados por coma
  vaccinations?:       string
  description?:        string
  // Score de compatibilidad para intent="dog_match". Soporta 0-1 o 0-100.
  // Solo se renderiza si viene definido.
  compatibility_score?: number
  // Para intent="specific_dog_info". Indica si este perro cumple los criterios
  // exactos de la búsqueda. La UI agrupa por este flag (coincidencias vs alts).
  is_exact_match?:     boolean
  // Debug interno del backend, no se muestra al usuario.
  relevance?:          number
  dense_score?:        number
}

export interface ChatShelterCard {
  id:           string
  name:         string
  description?: string
  phone?:       string | null
  email?:       string | null
  municipality?: string | null
  fullAddress?: string | null
  schedule?:    string | null
  website?:     string | null
  logo?:        string | null
  imageUrl?:    string | null
}

export type ChatCards =
  | { type: 'dogs';     items: ChatDogCard[]     }
  | { type: 'shelters'; items: ChatShelterCard[] }

// ─── Metadata de degradación ───────────────────────────────────────────────

export type DegradedReason =
  | 'rate_limit'
  | 'gemini_error'
  | 'timeout'
  | 'no_api_key'
  | 'empty_response'
  | 'connection_error'

export interface ChatMeta {
  degraded:            boolean
  reason:              DegradedReason | null
  retry_after_seconds: number | null
}

// ─── Health del servicio ───────────────────────────────────────────────────

export type HealthStatus = 'ok' | 'degraded' | 'down'

export interface HealthResponse {
  status:  HealthStatus
  service: string
  version: string
  dependencies: {
    beto:          'ok' | 'down'
    gemini:        'ok' | 'rate_limited' | 'error' | 'no_api_key'
    chromadb:      'ok' | 'down'
    knowledge_rag: 'ok' | 'down'
  }
}

// ─── Mensaje en la UI ──────────────────────────────────────────────────────

// Para mensajes del usuario: 'sent' al crearse; si la respuesta del bot falla,
// se marca como 'failed' y aparece botón Reintentar. Bot siempre 'sent'.
export type MessageStatus = 'sent' | 'failed'

export interface UIMessage {
  id:           number
  role:         'user' | 'bot'
  text:         string
  time:         string
  status?:      MessageStatus
  links?:       ChatLink[]
  suggestions?: string[]   // chips que aparecen después de este mensaje del bot
  cards?:       ChatCards  // tarjetas de perros o refugios embebidas
  meta?:        ChatMeta   // si la respuesta del bot vino degradada
}

// ─── Respuesta del servicio ────────────────────────────────────────────────

export interface BotResponse {
  text:         string
  links?:       ChatLink[]
  suggestions?: string[]
  cards?:       ChatCards
  meta?:        ChatMeta
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
