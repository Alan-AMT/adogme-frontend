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
    LIST:        `${BASE_DOGS}/dogs-ms/dogs`,
    DETAIL:      (id: number) => `${BASE_DOGS}/dogs-ms/dogs/${id}`,
    BY_ID:       (id: string) => `${BASE_DOGS}/dogs-ms/dog/${id}`,
    BY_SLUG:     (slug: string) => `${BASE_DOGS}/dogs-ms/dog/slug/${slug}`,
    BY_SHELTER:  (id: string) => `${BASE_DOGS}/dogs-ms/dogs/shelter/${id}`,
    PORTRAIT:    `${BASE_DOGS}/dogs-ms/dogs/portrait`,
    CREATE:      `${BASE_DOGS}/dogs-ms/dog`,
    UPDATE:      (id: string) => `${BASE_DOGS}/dogs-ms/dog/${id}`,
    DELETE:      (id: string) => `${BASE_DOGS}/dogs-ms/dog/${id}`,
    UPLOAD_MEDIA:`${BASE_DOGS}/api/media/upload`,
  },

  SHELTERS: {
    LIST:         `${BASE_SHELTERS}/shelters-ms/shelters`,
    CREATE:       `${BASE_SHELTERS}/shelters-ms/shelter`,
    DETAIL:       (id: number | string) => `${BASE_SHELTERS}/shelters-ms/shelter/${id}`,
    BY_ID:        (id: string) => `${BASE_SHELTERS}/shelters-ms/shelter/${id}`,
    BY_OWNER:     (userId: string) => `${BASE_SHELTERS}/shelters-ms/shelter/user/${userId}`,
    UPDATE:       (id: number | string) => `${BASE_SHELTERS}/shelters-ms/shelter/${id}`,
    STATS:        (id: number | string) => `${BASE_SHELTERS}/shelters-ms/shelter/${id}/stats`,
    UPLOAD_LOGO:  `${BASE_SHELTERS}/api/media/shelter/logo`,
    UPLOAD_COVER: `${BASE_SHELTERS}/api/media/shelter/cover`,
  },

  ADOPTIONS: {
    LIST:          `${BASE_ADOPTIONS}/api/adoptions`,
    BY_ADOPTANTE:  `${BASE_ADOPTIONS}/api/adoptions/me`,
    BY_SHELTER:    (id: number) => `${BASE_ADOPTIONS}/api/adoptions/shelter/${id}`,
    DETAIL:        (id: number) => `${BASE_ADOPTIONS}/api/adoptions/${id}`,
    CREATE:        `${BASE_ADOPTIONS}/api/adoptions`,
    UPDATE_STATUS: (id: number) => `${BASE_ADOPTIONS}/api/adoptions/${id}/status`,
    CANCEL:        (id: number) => `${BASE_ADOPTIONS}/api/adoptions/${id}/cancel`,
  },

  ML: {
    PROCESS_QUESTIONNAIRE: `${BASE_ML}/predict/process-questionnaire`,
    COMPATIBLE_DOGS:       `${BASE_ML}/predict/compatible-dogs`,
    GENERAL_RECOMMENDATIONS: `${BASE_ML}/insights/general-recommendations`,
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
