// global.d.ts
// Window extensions used by the auth stack.
// Allows authStore, apiClient, and services to share tokens
// in memory without circular imports.

declare interface Window {
  __authToken?: string;
  __refreshToken?: string;
}
