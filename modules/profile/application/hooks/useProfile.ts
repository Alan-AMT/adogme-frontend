// modules/profile/application/hooks/useProfile.ts
// Carga datos del usuario actual desde authStore.
// Expone acciones para actualizar perfil, cambiar contraseña y
// guardar/leer preferencias ML (LifestyleQuizAnswers).
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { profileService } from '../../infrastructure/ProfileServiceFactory'
import type { ProfileUpdateData } from '../../domain/ProfileTypes'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export type ProfileSection = 'data' | 'password' | 'preferences'

export interface UseProfileReturn {
  // ── Datos del usuario (del store) ──────────────────────────────────────────
  user:        ReturnType<typeof useAuthStore.getState>['user']
  isApplicant: boolean
  isShelter:   boolean
  isAdmin:     boolean

  // ── Estado de carga/guardado ───────────────────────────────────────────────
  saving:             boolean
  changingPassword:   boolean
  savingPreferences:  boolean
  loadingPreferences: boolean

  // ── Feedback por sección ───────────────────────────────────────────────────
  saveError:         string | null
  saveOk:            boolean
  passwordError:     string | null
  passwordOk:        boolean
  preferencesError:  string | null
  preferencesOk:     boolean

  // ── Preferencias ML ────────────────────────────────────────────────────────
  lifestyle: LifestyleQuizAnswers | null

  // ── Acciones ───────────────────────────────────────────────────────────────
  updateProfile(data: ProfileUpdateData): Promise<void>
  changePassword(currentPassword: string, newPassword: string): Promise<void>
  updatePreferences(answers: LifestyleQuizAnswers): Promise<void>

  /** Limpia los mensajes de feedback de una sección */
  clearStatus(section: ProfileSection): void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfile(): UseProfileReturn {
  const { user, setUser } = useAuthStore()

  // ── Estado de guardado ─────────────────────────────────────────────────────
  const [saving,            setSaving]            = useState(false)
  const [changingPassword,  setChangingPassword]  = useState(false)
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [loadingPreferences, setLoadingPreferences] = useState(false)

  // ── Feedback ───────────────────────────────────────────────────────────────
  const [saveError,        setSaveError]        = useState<string | null>(null)
  const [saveOk,           setSaveOk]           = useState(false)
  const [passwordError,    setPasswordError]    = useState<string | null>(null)
  const [passwordOk,       setPasswordOk]       = useState(false)
  const [preferencesError, setPreferencesError] = useState<string | null>(null)
  const [preferencesOk,    setPreferencesOk]    = useState(false)

  // ── Preferencias ML ────────────────────────────────────────────────────────
  const [lifestyle, setLifestyle] = useState<LifestyleQuizAnswers | null>(null)

  // Carga preferencias al montar (una sola vez)
  useEffect(() => {
    if (!user) return
    setLoadingPreferences(true)
    profileService
      .getLifestylePreferences(user.id)
      .then(data => setLifestyle(data))
      .catch(() => setLifestyle(null))
      .finally(() => setLoadingPreferences(false))
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── updateProfile ──────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      if (!user) return
      setSaving(true)
      setSaveError(null)
      setSaveOk(false)
      try {
        const updated = await profileService.updateProfile(user.id, data)
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

  // ── updatePreferences ──────────────────────────────────────────────────────
  const updatePreferences = useCallback(
    async (answers: LifestyleQuizAnswers) => {
      if (!user) return
      setSavingPreferences(true)
      setPreferencesError(null)
      setPreferencesOk(false)
      try {
        await profileService.saveLifestylePreferences(user.id, answers)
        setLifestyle(answers)
        setPreferencesOk(true)
      } catch (err) {
        setPreferencesError(err instanceof Error ? err.message : 'Error al guardar las preferencias.')
      } finally {
        setSavingPreferences(false)
      }
    },
    [user],
  )

  // ── clearStatus ────────────────────────────────────────────────────────────
  const clearStatus = useCallback((section: ProfileSection) => {
    if (section === 'data')        { setSaveError(null);        setSaveOk(false)        }
    if (section === 'password')    { setPasswordError(null);    setPasswordOk(false)    }
    if (section === 'preferences') { setPreferencesError(null); setPreferencesOk(false) }
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
    savingPreferences,
    loadingPreferences,

    saveError,
    saveOk,
    passwordError,
    passwordOk,
    preferencesError,
    preferencesOk,

    lifestyle,

    updateProfile,
    changePassword,
    updatePreferences,
    clearStatus,
  }
}
