// global.d.ts
// ─────────────────────────────────────────────────────────────────────────────
// Extensiones al objeto Window global usadas por el stack de auth.
// Permite que authStore, apiClient y MockAuthService compartan el token
// en memoria sin imports circulares.
// ─────────────────────────────────────────────────────────────────────────────

declare interface Window {
  /** Token JWT activo en memoria — sincronizado desde authStore y leído por apiClient */
  __authToken?: string
}
