// modules/shared/infrastructure/api/endpoints.ts
// ─────────────────────────────────────────────────────────────────────────────
// ÚNICO lugar donde viven las URLs de la API.
// Los MockServices ignoran este archivo hoy.
// Cuando NEXT_PUBLIC_USE_MOCK=false, SOLO este archivo cambia las rutas.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const ML   = process.env.NEXT_PUBLIC_ML_API_URL ?? ''
const WS   = process.env.NEXT_PUBLIC_WS_URL ?? ''

export const API_ENDPOINTS = {

  AUTH: {
    LOGIN:           `${BASE}/auth-ms/user/login`,
    REGISTER:        `${BASE}/auth-ms/adopter`,
    REGISTER_SHELTER:`${BASE}/auth-ms/shelter`,
    REFRESH:         `${BASE}/auth-ms/user/update-tokens`,
    LOGOUT:          `${BASE}/api/auth/logout`,
    FORGOT:          `${BASE}/api/auth/forgot-password`,
    RESET:           `${BASE}/api/auth/reset-password`,
    ME:              `${BASE}/api/auth/me`,
  },

  DOGS: {
    LIST:            `${BASE}/api/dogs`,
    DETAIL:          (id: number)    => `${BASE}/api/dogs/${id}`,
    BY_SLUG:         (slug: string)  => `${BASE}/api/dogs/slug/${slug}`,
    BY_SHELTER:      (id: number)    => `${BASE}/api/dogs/shelter/${id}`,
    CREATE:          `${BASE}/api/dogs`,
    UPDATE:          (id: number)    => `${BASE}/api/dogs/${id}`,
    DELETE:          (id: number)    => `${BASE}/api/dogs/${id}`,
    UPLOAD_MEDIA:    `${BASE}/api/media/upload`,
  },

  SHELTERS: {
    LIST:            `${BASE}/shelters-ms/shelters`,
    CREATE:          `${BASE}/shelters-ms/shelter`,
    DETAIL:          (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    BY_SLUG:         (slug: string)        => `${BASE}/api/shelters/slug/${slug}`,
    UPDATE:          (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    STATS:           (id: number | string) => `${BASE}/api/shelters/${id}/stats`,
    UPLOAD_LOGO:     `${BASE}/api/media/shelter/logo`,
    UPLOAD_COVER:    `${BASE}/api/media/shelter/cover`,
  },

  ADOPTIONS: {
    LIST:            `${BASE}/api/adoptions`,
    BY_ADOPTANTE:    `${BASE}/api/adoptions/me`,
    BY_SHELTER:      (id: number)    => `${BASE}/api/adoptions/shelter/${id}`,
    DETAIL:          (id: number)    => `${BASE}/api/adoptions/${id}`,
    CREATE:          `${BASE}/api/adoptions`,
    UPDATE_STATUS:   (id: number)    => `${BASE}/api/adoptions/${id}/status`,
    CANCEL:          (id: number)    => `${BASE}/api/adoptions/${id}/cancel`,
  },

  MESSAGES: {
    CONVERSATIONS:          `${BASE}/api/conversations`,
    CONV_BY_ADOPTANTE:      `${BASE}/api/conversations/me`,
    CONV_BY_SHELTER:        (id: number)    => `${BASE}/api/conversations/shelter/${id}`,
    MESSAGES:               (convId: number) => `${BASE}/api/conversations/${convId}/messages`,
    SEND:                   (convId: number) => `${BASE}/api/conversations/${convId}/messages`,
    MARK_READ:              (convId: number) => `${BASE}/api/conversations/${convId}/read`,
    WS_CONNECT:             (convId: number) => `${WS}/ws/conversations/${convId}`,
  },

  DONATIONS: {
    CREATE:          `${BASE}/api/donations`,
    BY_SHELTER:      (id: number)    => `${BASE}/api/donations/shelter/${id}`,
    BY_ADOPTANTE:    `${BASE}/api/donations/me`,
    SUMMARY:         (id: number)    => `${BASE}/api/donations/shelter/${id}/summary`,
    STRIPE_INTENT:   `${BASE}/api/payments/stripe/intent`,
    CONFIRM:         (id: number)    => `${BASE}/api/payments/confirm/${id}`,
  },

  RECOMMENDATIONS: {
    GENERATE:        `${ML}/api/ml/recommendations`,
    BY_ADOPTANTE:    `${ML}/api/ml/recommendations/me`,
    QUIZ:            `${BASE}/api/quiz`,
    QUIZ_DETAIL:     (id: number)    => `${BASE}/api/quiz/${id}`,
  },

  CHATBOT: {
    MESSAGE:         `${BASE}/api/chatbot/message`,
    HISTORY:         `${BASE}/api/chatbot/history`,
  },

  FAVORITES: {
    LIST:            `${BASE}/api/favorites`,
    ADD:             (dogId: number) => `${BASE}/api/favorites/${dogId}`,
    REMOVE:          (dogId: number) => `${BASE}/api/favorites/${dogId}`,
  },

  ADMIN: {
    STATS:           `${BASE}/api/admin/stats`,
    SHELTERS:        `${BASE}/api/admin/shelters`,
    SHELTER_DETAIL:  (id: number)    => `${BASE}/api/admin/shelters/${id}`,
    APPROVE_SHELTER: (id: number)    => `${BASE}/api/admin/shelters/${id}/approve`,
    REJECT_SHELTER:  (id: number)    => `${BASE}/api/admin/shelters/${id}/reject`,
    DOGS:            `${BASE}/api/admin/dogs`,
    DOG_DETAIL:      (id: number)    => `${BASE}/api/admin/dogs/${id}`,
    USERS:           `${BASE}/api/admin/users`,
    CONTENT:         `${BASE}/api/admin/content`,
  },

} as const
