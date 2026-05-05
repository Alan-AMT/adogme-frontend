// modules/shared/infrastructure/api/endpoints.ts
// ─────────────────────────────────────────────────────────────────────────────
// ÚNICO lugar donde viven las URLs de la API.
//
// En PRODUCCIÓN: todos los MS están detrás de un único gateway.
//   → cambia las constantes a `process.env.NEXT_PUBLIC_API_URL` y listo.
//
// En LOCAL: cada MS corre en su puerto, las URLs son absolutas y completas.
//   → modificar acá cuando un puerto cambie.
//
// Cualquier servicio (AuthService, ApiDogService, MLService, etc.) usa
// apiClient con la URL completa que viene de aquí. apiClient.baseURL = ""
// porque las URLs ya son absolutas.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Bases por microservicio ─────────────────────────────────────────────────
// LOCAL: hardcodeamos el puerto de cada MS.
// PROD:  reemplazar por process.env.NEXT_PUBLIC_API_URL (un único gateway).

const BASE_AUTH       = "http://localhost:3006";  // auth-ms
const BASE_APPLICANTS = "http://localhost:3009";  // applicants-ms
const BASE_DOGS       = "http://localhost:3002";  // dogs-ms
const BASE_SHELTERS   = "http://localhost:8080";  // shelters-ms
const BASE_ADOPTIONS  = "http://localhost:3006";  // adoptions-ms (placeholder)
const BASE_ML         = "http://localhost:8000";  // ml-ms
const BASE_CHATBOT    = "http://localhost:8006";  // chatbot
const BASE_ADMIN      = "http://localhost:3006";  // admin (placeholder)

// ─── Endpoints ───────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:            `${BASE_AUTH}/auth-ms/user/login`,
    REGISTER:         `${BASE_AUTH}/auth-ms/adopter`,
    REGISTER_SHELTER: `${BASE_AUTH}/auth-ms/shelter`,
    REFRESH:          `${BASE_AUTH}/auth-ms/user/update-tokens`,
    LOGOUT:           `${BASE_AUTH}/auth-ms/user/logout`,
    FORGOT:           `${BASE_AUTH}/auth-ms/user/forgot-password`,
    RESET:            `${BASE_AUTH}/auth-ms/user/reset-password`,
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

  // Conserva los nombres viejos por compatibilidad si algo aún los importa.
  RECOMMENDATIONS: {
    GENERATE:     `${BASE_ML}/predict/compatible-dogs`,
    BY_ADOPTANTE: `${BASE_ML}/api/ml/recommendations/me`,
    QUIZ:         `${BASE_APPLICANTS}/api/quiz`,
    QUIZ_DETAIL:  (id: number) => `${BASE_APPLICANTS}/api/quiz/${id}`,
  },

  CHATBOT: {
    MESSAGE: `${BASE_CHATBOT}/api/chatbot/message`,
    HISTORY: `${BASE_CHATBOT}/api/chatbot/history`,
  },

  FAVORITES: {
    LIST:   `${BASE_APPLICANTS}/api/favorites`,
    ADD:    (dogId: number) => `${BASE_APPLICANTS}/api/favorites/${dogId}`,
    REMOVE: (dogId: number) => `${BASE_APPLICANTS}/api/favorites/${dogId}`,
  },

  APPLICANTS: {
    REGISTER: `${BASE_APPLICANTS}/applicants-ms/applicant`,
    ME:       `${BASE_APPLICANTS}/applicants-ms/applicant/me`,
    UPDATE:   (userId: string) => `${BASE_APPLICANTS}/applicants-ms/applicant/${userId}`,
    // TODO(backend): PATCH para persistir el user_vector cuando el endpoint exista.
    UPDATE_USER_VECTOR: (userId: string) =>
      `${BASE_APPLICANTS}/applicants-ms/applicant/${userId}/user-vector`,
  },

  ADMIN: {
    STATS:           `${BASE_ADMIN}/api/admin/stats`,
    SHELTERS:        `${BASE_ADMIN}/api/admin/shelters`,
    SHELTER_DETAIL:  (id: number) => `${BASE_ADMIN}/api/admin/shelters/${id}`,
    APPROVE_SHELTER: (id: number) => `${BASE_ADMIN}/api/admin/shelters/${id}/approve`,
    REJECT_SHELTER:  (id: number) => `${BASE_ADMIN}/api/admin/shelters/${id}/reject`,
    DOGS:            `${BASE_ADMIN}/api/admin/dogs`,
    DOG_DETAIL:      (id: number) => `${BASE_ADMIN}/api/admin/dogs/${id}`,
    USERS:           `${BASE_ADMIN}/api/admin/users`,
    CONTENT:         `${BASE_ADMIN}/api/admin/content`,
  },
} as const;
