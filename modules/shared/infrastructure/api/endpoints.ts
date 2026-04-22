// modules/shared/infrastructure/api/endpoints.ts
// ─────────────────────────────────────────────────────────────────────────────
// ÚNICO lugar donde viven las URLs de la API.
// Los MockServices ignoran este archivo hoy.
// Cuando NEXT_PUBLIC_USE_MOCK=false, SOLO este archivo cambia las rutas.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const ML = process.env.NEXT_PUBLIC_ML_API_URL ?? "";

export const API_ENDPOINTS = {
  AUTH: {
    // LOGIN: `http://localhost:3001/auth-ms/user/login`,
    // REGISTER: `http://localhost:3001/auth-ms/adopter`,
    // REGISTER_SHELTER: `http://localhost:3001/auth-ms/shelter`,
    // REFRESH: `http://localhost:3001/auth-ms/user/update-tokens`,
    // LOGOUT: `http://localhost:3001/api/auth/logout`,
    // FORGOT: `http://localhost:3001/api/auth/forgot-password`,
    // RESET: `http://localhost:3001/api/auth/reset-password`,
    // ME: `http://localhost:3001/api/auth/me`,
    LOGIN: `${BASE}/auth-ms/user/login`,
    REGISTER: `${BASE}/auth-ms/adopter`,
    REGISTER_SHELTER: `${BASE}/auth-ms/shelter`,
    REFRESH: `${BASE}/auth-ms/user/update-tokens`,
    LOGOUT: `${BASE}/api/auth/logout`,
    FORGOT: `${BASE}/api/auth/forgot-password`,
    RESET: `${BASE}/api/auth/reset-password`,
    ME: `${BASE}/api/auth/me`,
  },

  DOGS: {
    // LIST: `http://localhost:3001/dogs-ms/dogs`,
    // DETAIL: (id: number) => `http://localhost:3001/dogs-ms/dogs/${id}`,
    // BY_ID: (id: string) => `http://localhost:3001/dogs-ms/dog/${id}`,
    // BY_SLUG: (slug: string) => `http://localhost:3001/dogs-ms/dog/slug/${slug}`,
    // BY_SHELTER: (id: string) =>
    //   `http://localhost:3001/dogs-ms/dogs/shelter/${id}`,
    // CREATE: `http://localhost:3001/dogs-ms/dog`,
    // UPDATE: (id: string) => `http://localhost:3001/dogs-ms/dog/${id}`,
    // DELETE: (id: number) => `http://localhost:3001/dogs-ms/dog/${id}`,
    // UPLOAD_MEDIA: `http://localhost:3001/api/media/upload`,
    LIST: `${BASE}/dogs-ms/dogs`,
    DETAIL: (id: number) => `${BASE}/dogs-ms/dogs/${id}`,
    BY_ID: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    BY_SLUG: (slug: string) => `${BASE}/dogs-ms/dog/slug/${slug}`,
    BY_SHELTER: (id: string) => `${BASE}/dogs-ms/dogs/shelter/${id}`,
    CREATE: `${BASE}/dogs-ms/dog`,
    UPDATE: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    DELETE: (id: number) => `${BASE}/dogs-ms/dog/${id}`,
    UPLOAD_MEDIA: `${BASE}/api/media/upload`,
  },

  SHELTERS: {
    LIST: `${BASE}/shelters-ms/shelters`,
    CREATE: `${BASE}/shelters-ms/shelter`,
    DETAIL: (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    BY_ID: (id: string) => `${BASE}/shelters-ms/shelter/${id}`,
    BY_OWNER: (userId: string) => `${BASE}/shelters-ms/shelter/user/${userId}`,
    UPDATE: (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    STATS: (id: number | string) => `${BASE}/api/shelters/${id}/stats`,
    UPLOAD_LOGO: `${BASE}/api/media/shelter/logo`,
    UPLOAD_COVER: `${BASE}/api/media/shelter/cover`,
    // LIST: `http://localhost:3002/shelters-ms/shelters`,
    // CREATE: `http://localhost:3002/shelters-ms/shelter`,
    // DETAIL: (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    // BY_ID: (id: string) => `http://localhost:3002/shelters-ms/shelter/${id}`,
    // UPDATE: (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    // STATS: (id: number | string) => `${BASE}/api/shelters/${id}/stats`,
    // UPLOAD_LOGO: `http://localhost:3002/api/media/shelter/logo`,
    // BY_OWNER: (userId: string) =>
    //   `http://localhost:3002/shelters-ms/shelter/user/${userId}`,
    // UPLOAD_COVER: `http://localhost:3002/api/media/shelter/cover`,
  },

  ADOPTIONS: {
    LIST: `${BASE}/api/adoptions`,
    BY_ADOPTANTE: `${BASE}/api/adoptions/me`,
    BY_SHELTER: (id: number) => `${BASE}/api/adoptions/shelter/${id}`,
    DETAIL: (id: number) => `${BASE}/api/adoptions/${id}`,
    CREATE: `${BASE}/api/adoptions`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/adoptions/${id}/status`,
    CANCEL: (id: number) => `${BASE}/api/adoptions/${id}/cancel`,
  },

  RECOMMENDATIONS: {
    GENERATE: `${ML}/api/ml/recommendations`,
    BY_ADOPTANTE: `${ML}/api/ml/recommendations/me`,
    QUIZ: `${BASE}/api/quiz`,
    QUIZ_DETAIL: (id: number) => `${BASE}/api/quiz/${id}`,
  },

  CHATBOT: {
    MESSAGE: `${BASE}/api/chatbot/message`,
    HISTORY: `${BASE}/api/chatbot/history`,
  },

  FAVORITES: {
    LIST: `${BASE}/api/favorites`,
    ADD: (dogId: number) => `${BASE}/api/favorites/${dogId}`,
    REMOVE: (dogId: number) => `${BASE}/api/favorites/${dogId}`,
  },

  ADMIN: {
    STATS: `${BASE}/api/admin/stats`,
    SHELTERS: `${BASE}/api/admin/shelters`,
    SHELTER_DETAIL: (id: number) => `${BASE}/api/admin/shelters/${id}`,
    APPROVE_SHELTER: (id: number) => `${BASE}/api/admin/shelters/${id}/approve`,
    REJECT_SHELTER: (id: number) => `${BASE}/api/admin/shelters/${id}/reject`,
    DOGS: `${BASE}/api/admin/dogs`,
    DOG_DETAIL: (id: number) => `${BASE}/api/admin/dogs/${id}`,
    USERS: `${BASE}/api/admin/users`,
    CONTENT: `${BASE}/api/admin/content`,
  },
} as const;
