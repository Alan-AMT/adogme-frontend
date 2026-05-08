// modules/shared/infrastructure/api/endpoints.ts
// ─────────────────────────────────────────────────────────────────────────────
// ÚNICO lugar donde viven las URLs de la API.
// Los MockServices ignoran este archivo hoy.
// Cuando NEXT_PUBLIC_USE_MOCK=false, SOLO este archivo cambia las rutas.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

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
    LOGOUT: `${BASE}/auth-ms/user/logout`,
    FORGOT: `${BASE}/auth-ms/user/forgot-password`,
    RESET: `${BASE}/auth-ms/user/reset-password`,
  },

  DOGS: {
    // LIST: `http://localhost:3001/dogs-ms/dogs`,
    // DETAIL: (id: number) => `http://localhost:3001/dogs-ms/dogs/${id}`,
    // BY_ID: (id: string) => `http://localhost:3001/dogs-ms/dog/${id}`,
    // BY_SHELTER: (id: string) =>
    //   `http://localhost:3001/dogs-ms/dogs/shelter/${id}`,
    // CREATE: `http://localhost:3001/dogs-ms/dog`,
    // UPDATE: (id: string) => `http://localhost:3001/dogs-ms/dog/${id}`,
    // DELETE: (id: number) => `http://localhost:3001/dogs-ms/dog/${id}`,
    // UPLOAD_MEDIA: `http://localhost:3001/api/media/upload`,
    LIST: `${BASE}/dogs-ms/dogs`,
    PORTRAIT: `${BASE}/dogs-ms/dogs/portrait`,
    DETAIL: (id: number) => `${BASE}/dogs-ms/dogs/${id}`,
    BY_ID: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    BY_SHELTER: (id: string) => `${BASE}/dogs-ms/dogs/shelter/${id}`,
    GET_SHELTER_DASHBOARD_DOGS_STATS: (id: string) =>
      `${BASE}/dogs-ms/dogs/shelter/${id}/stats`,
    CREATE: `${BASE}/dogs-ms/dog`,
    UPDATE: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    DELETE: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    STATUS: (id: string) => `${BASE}/dogs-ms/dog/${id}/status`,
    UPLOAD_MEDIA: `${BASE}/api/media/upload`,
  },

  SHELTERS: {
    LIST: `${BASE}/shelters-ms/shelters`,
    CREATE: `${BASE}/shelters-ms/shelter`,
    DETAIL: (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    BY_ID: (id: string) => `${BASE}/shelters-ms/shelter/${id}`,
    BY_OWNER: (userId: string) => `${BASE}/shelters-ms/shelter/user/${userId}`,
    UPDATE: (id: number | string) => `${BASE}/shelters-ms/shelter/${id}`,
    UPLOAD_LOGO: `${BASE}/api/media/shelter/logo`,
    UPLOAD_COVER: `${BASE}/api/media/shelter/cover`,
    // LIST: `http://localhost:3002/shelters-ms/shelters`,
    // CREATE: `http://localhost:3002/shelters-ms/shelter`,
    // DETAIL: (id: number | string) =>
    //   `http://localhost:3002/shelters-ms/shelter/${id}`,
    // BY_ID: (id: string) => `http://localhost:3002/shelters-ms/shelter/${id}`,
    // UPDATE: (id: number | string) =>
    //   `http://localhost:3002/shelters-ms/shelter/${id}`,
    // STATS: (id: number | string) =>
    //   `http://localhost:3002/api/shelters/${id}/stats`,
    // UPLOAD_LOGO: `http://localhost:3002/api/media/shelter/logo`,
    // BY_OWNER: (userId: string) =>
    //   `http://localhost:3002/shelters-ms/shelter/user/${userId}`,
    // UPLOAD_COVER: `http://localhost:3002/api/media/shelter/cover`,
  },

  ML: {
    PROCESS_QUESTIONNAIRE: `${BASE}/ml-ms/predict/process-questionnaire`,
    COMPATIBLE_DOGS: `${BASE}/ml-ms/predict/compatible-dogs`,
    GENERAL_RECOMMENDATIONS: `${BASE}/ml-ms/insights/general-recommendations`,
  },

  ADOPTIONS: {
    LIST: `${BASE}/api/adoptions`,
    BY_ADOPTANTE: `${BASE}/api/adoptions/me`,
    BY_SHELTER: (id: number) => `${BASE}/api/adoptions/shelter/${id}`,
    DETAIL: (id: number) => `${BASE}/api/adoptions/${id}`,
    CREATE: `${BASE}/api/adoptions`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/adoptions/${id}/status`,
    CANCEL: (id: number) => `${BASE}/api/adoptions/${id}/cancel`,
    // TODO: endpoint del MS de solicitudes — aún no está listo en backend.
    // GET_SHELTER_DASHBOARD_REQUESTS_STATS: (id: string) =>
    //   `${BASE}/applications-ms/applications/shelter/${id}/stats`,
  },

  RECOMMENDATIONS: {
    GENERATE: `${BASE}/predict/compatible-dogs`,
    BY_ADOPTANTE: `${BASE}/api/ml/recommendations/me`,
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

  APPLICANTS: {
    REGISTER: `${BASE}/applicants-ms/applicant`,
    ME: `${BASE}/applicants-ms/applicant/me`,
    UPDATE: (userId: string) => `${BASE}/applicants-ms/applicant/${userId}`,
    UPDATE_USER_VECTOR: (userId: string) =>
      `${BASE}/applicants-ms/user/${userId}/vector`,
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
