// modules/shared/application/hooks/useAuth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wrapper semántico sobre authStore.
// Los componentes NUNCA importan useAuthStore directamente — usan este hook.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import type { ShelterUser } from '../../domain/User'
import { useAuthStore } from '../../infrastructure/store/authStore'

export function useAuth() {
  const store = useAuthStore()

  return {
    // ── Estado ───────────────────────────────────────────────────────────────
    user:            store.user,
    token:           store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading:       store.isLoading,
    error:           store.error,

    // ── Checks de rol ────────────────────────────────────────────────────────
    isApplicant: store.user?.role === 'applicant',
    isShelter:   store.user?.role === 'shelter',
    isAdmin:     store.user?.role === 'admin',

    // ── Checks de shelter ────────────────────────────────────────────────────
    isShelterApproved: store.user?.role === 'shelter'
      ? (store.user as ShelterUser).shelterStatus === 'approved'
      : false,

    isShelterPending: store.user?.role === 'shelter'
      ? (store.user as ShelterUser).shelterStatus === 'pending'
      : false,

    shelterId: store.user?.role === 'shelter'
      ? (store.user as ShelterUser).shelterId
      : null,

    // ── Actions ──────────────────────────────────────────────────────────────
    login:      store.login,
    logout:     store.logout,
    clearError: store.clearError,
  }
}
