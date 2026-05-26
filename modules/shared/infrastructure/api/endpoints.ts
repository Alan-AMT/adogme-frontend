// modules/shared/infrastructure/api/endpoints.ts
// ─────────────────────────────────────────────────────────────────────────────
// ÚNICO lugar donde viven las URLs de la API.
// Todas las rutas apuntan al API Gateway definido en ApiGateway.yml.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE}/auth-ms/user/login`,
    REGISTER: `${BASE}/auth-ms/adopter`,
    REGISTER_SHELTER: `${BASE}/auth-ms/shelter`,
    REFRESH: `${BASE}/auth-ms/user/update-tokens`,
    LOGOUT: `${BASE}/auth-ms/user/logout`,
    FORGOT: `${BASE}/auth-ms/user/forgot-password`,
    RESET: `${BASE}/auth-ms/user/reset-password`,
    CHANGE_PASSWORD: `${BASE}/auth-ms/user/change-password`,
    USER_BY_ID: (id: string) => `${BASE}/auth-ms/user/${id}`,
  },

  DOGS: {
    LIST: `${BASE}/dogs-ms/dogs`,
    PORTRAIT: `${BASE}/dogs-ms/dogs/portrait`,
    BY_IDS: `${BASE}/dogs-ms/dogs/by-ids`,
    BY_ID: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    BY_SHELTER: (id: string) => `${BASE}/dogs-ms/dogs/shelter/${id}`,
    GET_SHELTER_DASHBOARD_DOGS_STATS: (id: string) =>
      `${BASE}/dogs-ms/dogs/shelter/${id}/stats`,
    CREATE: `${BASE}/dogs-ms/dog`,
    UPDATE: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    DELETE: (id: string) => `${BASE}/dogs-ms/dog/${id}`,
    STATUS: (id: string) => `${BASE}/dogs-ms/dog/${id}/status`,
  },

  SHELTERS: {
    LIST: `${BASE}/shelters-ms/shelters`,
    CREATE: `${BASE}/shelters-ms/shelter`,
    BY_ID: (id: string | number) => `${BASE}/shelters-ms/shelter/${id}`,
    BY_OWNER: (userId: string) => `${BASE}/shelters-ms/shelter/user/${userId}`,
    UPDATE: (id: string | number) => `${BASE}/shelters-ms/shelter/${id}`,
    UPDATE_ADMIN_DATA: (id: string) => `${BASE}/auth-ms/user/${id}/name`,
  },

  APPLICANTS: {
    REGISTER: `${BASE}/applicants-ms/applicant`,
    ME: `${BASE}/applicants-ms/applicant/me`,
    UPDATE: (id: string) => `${BASE}/applicants-ms/applicant/${id}`,
    UPDATE_USER_VECTOR: (userId: string) =>
      `${BASE}/applicants-ms/user/${userId}/vector`,
    ADD_FAVORITE: (applicantId: string, dogId: string) =>
      `${BASE}/applicants-ms/applicant/${applicantId}/favorite-dogs/${dogId}/add`,
    REMOVE_FAVORITE: (applicantId: string, dogId: string) =>
      `${BASE}/applicants-ms/applicant/${applicantId}/favorite-dogs/${dogId}/remove`,
  },

  ADOPTIONS: {
    CREATE: `${BASE}/applications-ms`,
    APPLICATION_BY_ID: (id: string) => `${BASE}/applications-ms/${id}`,
    APPLICATIONS_CHECK: `${BASE}/applications-ms/check`,
    UPDATE_STATUS: (id: string) => `${BASE}/applications-ms/${id}/status`,
    APPLICATIONS_RECENT_FORM_DATA: (applicantId: string) =>
      `${BASE}/applications-ms/applicant/${applicantId}/recent`,
    APPLICATIONS_BY_APPLICANT: (applicantId: string) =>
      `${BASE}/applications-ms/applicant/${applicantId}`,
    APPLICATIONS_BY_SHELTER: (shelterId: string) =>
      `${BASE}/applications-ms/shelter/${shelterId}`,
    GET_SHELTER_DASHBOARD_REQUESTS_STATS: (shelterId: string) =>
      `${BASE}/applications-ms/shelter/${shelterId}/stats`,
    GET_SHELTER_DASHBOARD_REQUESTS_BY_PERIOD: (shelterId: string) =>
      `${BASE}/applications-ms/shelter/${shelterId}/by-period`,
  },

  ML: {
    PROCESS_QUESTIONNAIRE: `${BASE}/ml-ms/predict/process-questionnaire`,
    COMPATIBLE_DOGS: `${BASE}/ml-ms/predict/compatible-dogs`,
    GENERAL_RECOMMENDATIONS: `${BASE}/ml-ms/insights/general-recommendations`,
    COMPATIBILITY_BY_DOG: (dogId: string) => `${BASE}/ml-ms/predict/compatibility/${dogId}`,
  },

  RECOMMENDATIONS: {
    PROCESS_QUESTIONNAIRE: `${BASE}/ml-ms/predict/process-questionnaire`,
    COMPATIBLE_DOGS: (topN: number) =>
      `${BASE}/ml-ms/predict/compatible-dogs?top_n=${topN}`,
    BY_ADOPTANTE: `${BASE}/api/ml/recommendations/me`,
    QUIZ: `${BASE}/api/quiz`,
    QUIZ_DETAIL: (id: number) => `${BASE}/api/quiz/${id}`,
  },

  CHATBOT: {
    MESSAGE: `${BASE}/chatbot-ms/chat`,
    HEALTH: `${BASE}/chatbot-ms/health`,
    INTENTS: `${BASE}/chatbot-ms/intents`,
  },
} as const;
