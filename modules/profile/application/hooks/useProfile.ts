// modules/profile/application/hooks/useProfile.ts
// Carga datos del usuario actual desde authStore.
// Expone acciones para actualizar perfil y cambiar contraseña.
'use client'

import { useState, useCallback } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { profileService } from '../../infrastructure/ProfileServiceFactory'
import type { ProfileUpdateData } from '../../domain/ProfileTypes'
import type { Adoptante } from '@/modules/shared/domain/User'

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export type ProfileSection = 'data' | 'password'

export interface UseProfileReturn {
  // ── Datos del usuario (del store) ──────────────────────────────────────────
  user:        ReturnType<typeof useAuthStore.getState>['user']
  isApplicant: boolean
  isShelter:   boolean
  isAdmin:     boolean

  // ── Estado de carga/guardado ───────────────────────────────────────────────
  saving:           boolean
  changingPassword: boolean

  // ── Feedback por sección ───────────────────────────────────────────────────
  saveError:     string | null
  saveOk:        boolean
  passwordError: string | null
  passwordOk:    boolean

  // ── Acciones ───────────────────────────────────────────────────────────────
  updateProfile(data: ProfileUpdateData): Promise<void>
  changePassword(currentPassword: string, newPassword: string): Promise<void>

  /** Limpia los mensajes de feedback de una sección */
  clearStatus(section: ProfileSection): void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfile(): UseProfileReturn {
  const { user, setUser } = useAuthStore()

  // ── Estado de guardado ─────────────────────────────────────────────────────
  const [saving,           setSaving]           = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // ── Feedback ───────────────────────────────────────────────────────────────
  const [saveError,     setSaveError]     = useState<string | null>(null)
  const [saveOk,        setSaveOk]        = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordOk,    setPasswordOk]    = useState(false)

  // ── updateProfile ──────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      if (!user) return
      setSaving(true)
      setSaveError(null)
      setSaveOk(false)
      try {
        const adoptante = user.role === 'applicant' ? (user as Adoptante) : null
        const fullData: ProfileUpdateData = {
          nombre:    data.nombre    ?? user.name,
          email:     data.email     ?? user.email,
          telefono:  data.telefono  ?? adoptante?.phone,
          direccion: data.direccion ?? adoptante?.address,
          cp:        data.cp        ?? adoptante?.postalCode,
          avatarUrl: data.avatarUrl ?? adoptante?.avatarUrl,
        }
        const updated = await profileService.updateProfile(user.id, fullData)
        setUser(updated)
        setSaveOk(true)
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Error al guardar los datos.')
      } finally {
        setSaving(false)
      }
    },
    [user, setUser],
  )

  // ── changePassword ─────────────────────────────────────────────────────────
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) return
      setChangingPassword(true)
      setPasswordError(null)
      setPasswordOk(false)
      try {
        await profileService.changePassword(user.id, currentPassword, newPassword)
        setPasswordOk(true)
      } catch (err) {
        setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña.')
      } finally {
        setChangingPassword(false)
      }
    },
    [user],
  )

  // ── clearStatus ────────────────────────────────────────────────────────────
  const clearStatus = useCallback((section: ProfileSection) => {
    if (section === 'data')     { setSaveError(null);     setSaveOk(false)     }
    if (section === 'password') { setPasswordError(null); setPasswordOk(false) }
  }, [])

  // ── Derivados de rol ───────────────────────────────────────────────────────
  const isApplicant = user?.role === 'applicant'
  const isShelter   = user?.role === 'shelter'
  const isAdmin     = user?.role === 'admin'

  return {
    user,
    isApplicant,
    isShelter,
    isAdmin,

    saving,
    changingPassword,

    saveError,
    saveOk,
    passwordError,
    passwordOk,

    updateProfile,
    changePassword,
    clearStatus,
  }
}
