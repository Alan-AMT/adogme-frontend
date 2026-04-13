// modules/shared/infrastructure/store/authStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Estado global de autenticación — Zustand
// Usado por: Navbar, layouts protegidos, useAuth hook, apiClient
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { create } from 'zustand'
import type { Administrador, Adoptante, ShelterUser } from '../../domain/User'
import { MOCK_CREDENTIALS } from '../../mockData/users.mock'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AuthUser = Adoptante | ShelterUser | Administrador

interface AuthState {
  user:            AuthUser | null
  token:           string | null
  refreshToken:    string | null
  isAuthenticated: boolean
  isLoading:       boolean
  error:           string | null

  // Actions
  login:     (correo: string, password: string) => Promise<void>
  logout:    () => void
  setUser:   (user: AuthUser) => void
  setToken:  (token: string) => void
  /** Persists both access and refresh tokens together */
  setTokens: (accessToken: string, refreshToken: string) => void
  hydrate:   () => void   // lee el token de cookie/localStorage al montar
  clearError: () => void
}

// ─── Mock token builder (client-safe, sin next/headers) ──────────────────────
// Produce el mismo base64 que session.ts:createMockToken pero usando btoa
function createMockToken(user: AuthUser): string {
  const payload = {
    ...user,
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
}

// ─── Helpers de cookie (cliente) ─────────────────────────────────────────────

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

function getRefreshTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)refresh-token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

function setTokenCookie(token: string): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `auth-token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`
}

function setRefreshTokenCookie(token: string): void {
  if (typeof document === 'undefined') return
  // Refresh tokens typically live longer — 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `refresh-token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`
}

function clearTokenCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

// ─── JWT decode — compatible con tokens reales (3 segmentos, base64url) ──────

function decodeUserFromToken(token: string): AuthUser | null {
  try {
    // JWTs: header.payload.signature — tomamos el segundo segmento
    const segments = token.split('.')
    if (segments.length === 3) {
      // base64url → base64 estándar
      const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/')
      const padded  = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
      const payload = JSON.parse(atob(padded))
      return payload as AuthUser
    }
    // Fallback: token mock (base64 JSON plano)
    const payload = JSON.parse(decodeURIComponent(escape(atob(token))))
    return payload as AuthUser
  } catch {
    return null
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  user:            null,
  token:           null,
  refreshToken:    null,
  isAuthenticated: false,
  isLoading:       false,
  error:           null,

  // ── login ──────────────────────────────────────────────────────────────────
  login: async (correo, password) => {
    set({ isLoading: true, error: null })

    try {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

      if (useMock) {
        // Simula delay de red
        await new Promise(r => setTimeout(r, 600))

        const entry = MOCK_CREDENTIALS[correo]
        if (!entry || entry.password !== password) {
          throw new Error('Correo o contraseña incorrectos')
        }

        const token = createMockToken(entry.user)
        setTokenCookie(token)

        // Sincroniza con apiClient
        if (typeof window !== 'undefined') window.__authToken = token

        set({
          user:            entry.user,
          token,
          isAuthenticated: true,
          isLoading:       false,
        })
        return
      }

      // ── Modo real ────────────────────────────────────────────────────────
      const { apiClient } = await import('../api/apiClient')
      const { API_ENDPOINTS } = await import('../api/endpoints')

      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { correo, password })
      const { user, accessToken, refreshToken } = res.data

      setTokenCookie(accessToken)
      setRefreshTokenCookie(refreshToken)
      if (typeof window !== 'undefined') {
        window.__authToken = accessToken
        window.__refreshToken = refreshToken
      }

      set({ user, token: accessToken, refreshToken, isAuthenticated: true, isLoading: false })

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      set({ isLoading: false, error: message })
      throw err
    }
  },

  // ── logout ─────────────────────────────────────────────────────────────────
  logout: () => {
    clearTokenCookie()
    if (typeof window !== 'undefined') {
      window.__authToken    = undefined
      window.__refreshToken = undefined
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null })
  },

  // ── setUser / setToken / setTokens ─────────────────────────────────────────
  setUser:  (user)  => set({ user, isAuthenticated: true }),
  setToken: (token) => {
    setTokenCookie(token)
    if (typeof window !== 'undefined') window.__authToken = token
    set({ token })
  },
  setTokens: (accessToken, refreshToken) => {
    setTokenCookie(accessToken)
    setRefreshTokenCookie(refreshToken)
    if (typeof window !== 'undefined') {
      window.__authToken    = accessToken
      window.__refreshToken = refreshToken
    }
    set({ token: accessToken, refreshToken })
  },

  // ── hydrate — lee la sesión al montar la app ───────────────────────────────
  hydrate: () => {
    const token = getTokenFromCookie()
    if (!token) return

    const user = decodeUserFromToken(token)
    if (!user) { clearTokenCookie(); return }

    const refreshToken = getRefreshTokenFromCookie()

    if (typeof window !== 'undefined') {
      window.__authToken    = token
      window.__refreshToken = refreshToken ?? undefined
    }
    set({ user, token, refreshToken, isAuthenticated: true })
  },

  clearError: () => set({ error: null }),
}))
