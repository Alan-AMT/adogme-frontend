// modules/profile/infrastructure/MockProfileService.ts
// Implementación mock de IProfileService
// — Valida contraseña contra MOCK_CREDENTIALS
// — Persiste preferencias ML en localStorage (clave: lifestyle-{userId})
// — Devuelve el usuario actualizado con los nuevos datos

import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'
import { MOCK_CREDENTIALS } from '@/modules/shared/mockData/users.mock'
import type { IProfileService, ProfileUser } from './IProfileService'
import type { ProfileUpdateData } from '../domain/ProfileTypes'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

const LIFESTYLE_KEY = (userId: number) => `lifestyle-profile-${userId}`

export class MockProfileService implements IProfileService {

  // ── updateProfile ────────────────────────────────────────────────────────────
  async updateProfile(userId: number, data: ProfileUpdateData): Promise<ProfileUser> {
    await delay(500)

    // Busca el usuario en mock credentials para obtener la copia base
    const entry = Object.values(MOCK_CREDENTIALS).find(e => e.user.id === userId)
    if (!entry) throw new Error('Usuario no encontrado.')

    // Merge de cambios sobre el usuario base (no muta el original)
    const updated: ProfileUser = {
      ...entry.user,
      ...(data.nombre    !== undefined ? { nombre:    data.nombre    } : {}),
      ...(data.telefono  !== undefined ? { telefono:  data.telefono  } : {}),
      ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
      // direccion solo aplica a adoptante
      ...(data.direccion !== undefined && entry.user.role === 'applicant'
        ? { direccion: data.direccion }
        : {}
      ),
    }

    return updated
  }

  // ── changePassword ────────────────────────────────────────────────────────────
  async changePassword(
    userId: number,
    currentPassword: string,
    _newPassword: string,
  ): Promise<void> {
    await delay(500)

    const entry = Object.values(MOCK_CREDENTIALS).find(e => e.user.id === userId)
    if (!entry) throw new Error('Usuario no encontrado.')

    if (entry.password !== currentPassword) {
      throw new Error('La contraseña actual es incorrecta.')
    }
    // Mock: contraseña nueva aceptada (no persiste — reinicio limpia el estado)
  }

  // ── getLifestylePreferences ───────────────────────────────────────────────────
  async getLifestylePreferences(userId: number): Promise<LifestyleQuizAnswers | null> {
    await delay(200)

    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(LIFESTYLE_KEY(userId))
      return raw ? (JSON.parse(raw) as LifestyleQuizAnswers) : null
    } catch {
      return null
    }
  }

  // ── saveLifestylePreferences ──────────────────────────────────────────────────
  async saveLifestylePreferences(
    userId: number,
    answers: LifestyleQuizAnswers,
  ): Promise<void> {
    await delay(500)

    if (typeof window === 'undefined') return
    localStorage.setItem(LIFESTYLE_KEY(userId), JSON.stringify(answers))
  }
}
