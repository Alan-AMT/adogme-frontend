// modules/shared/infrastructure/api/apiClient.ts
// ─────────────────────────────────────────────────────────────────────────────
// Instancia de Axios lista para producción.
// En mock mode (NEXT_PUBLIC_USE_MOCK=true) este cliente no se usa —
// los MockServices devuelven datos directamente sin HTTP.
// ─────────────────────────────────────────────────────────────────────────────

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { API_ENDPOINTS } from './endpoints'

// ─── Instancia base ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL:        process.env.NEXT_PUBLIC_API_URL ?? '',
  timeout:        15_000,                            // 15 segundos
  headers:        { 'Content-Type': 'application/json' },
  withCredentials: true,                             // envía cookies HTTP-only
})

// ─── Interceptor de REQUEST — agrega el token ────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // En el cliente (browser), intentamos leer el token del localStorage como fallback
    // El token real viene de la cookie HTTP-only que el servidor gestiona
    if (typeof window !== 'undefined') {
      const token = window.__authToken  // se setea desde authStore.hydrate()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Interceptor de RESPONSE — maneja errores globales ───────────────────────

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 — Token expirado: intentar refresh una vez
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Encolar mientras se refresca
        return new Promise((resolve) => {
          refreshQueue.push((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(apiClient(original))
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {}, { withCredentials: true })
        const newToken: string = res.data.token

        if (typeof window !== 'undefined') window.__authToken = newToken
        refreshQueue.forEach(cb => cb(newToken))
        refreshQueue = []

        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch {
        // Refresh falló → limpiar sesión y redirigir a login
        if (typeof window !== 'undefined') {
          window.__authToken = undefined
          window.location.href = '/login?session=expired'
        }
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // 403 — Sin permisos
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }

    // 500 — Error de servidor: disparar toast global
    if (error.response?.status && error.response.status >= 500) {
      // El uiStore lo escucha via el event bus si está disponible
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('api:server-error', {
          detail: { status: error.response.status }
        }))
      }
    }

    return Promise.reject(error)
  }
)

export { apiClient }

// ─── Tipado global de window.__authToken ─────────────────────────────────────

declare global {
  interface Window {
    __authToken?: string
  }
}
