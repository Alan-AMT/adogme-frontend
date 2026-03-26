// modules/auth/app/route.tsx
// Capa de aplicación: rutas de autenticación y lógica de redirección post-login

import type { UserRole } from '../domain/AuthUser'

// ─── Rutas de autenticación ───────────────────────────────────────────────────
export const AUTH_ROUTES = {
  login:             '/login',
  register:          '/registro',
  shelterRegister:   '/registro/refugio',
  forgotPassword:    '/forgot-password',
  resetPassword:     '/reset-password',
  emailVerification: '/verify-email',
} as const

export type AuthRoutePath = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES]

// ─── Redirección post-login según rol ─────────────────────────────────────────
export const ROLE_HOME: Record<UserRole, string> = {
  adoptante:     '/perros',
  refugio:       '/refugio/dashboard',
  administrador: '/admin/dashboard',
}

export function getPostLoginUrl(role: UserRole): string {
  return ROLE_HOME[role] ?? '/'
}

// ─── Guard helpers ────────────────────────────────────────────────────────────

/** Rutas que requieren autenticación */
export const PROTECTED_ROUTES = [
  '/refugio',
  '/admin',
  '/perfil',
  '/favoritos',
] as const

/** Rutas solo para usuarios NO autenticados (si está logueado → redirigir) */
export const AUTH_ONLY_ROUTES: AuthRoutePath[] = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
  AUTH_ROUTES.shelterRegister,
]

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

export function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTES.some(route => pathname.startsWith(route))
}
