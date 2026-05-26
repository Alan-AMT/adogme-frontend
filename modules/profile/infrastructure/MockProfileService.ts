// modules/profile/infrastructure/MockProfileService.ts
// Implementación mock de IProfileService
// — Valida contraseña contra MOCK_CREDENTIALS
// — Persiste preferencias ML en localStorage (clave: lifestyle-{userId})
// — Devuelve el usuario actualizado con los nuevos datos

import { MOCK_CREDENTIALS } from '@/modules/shared/mockData/users.mock'
import type { IProfileService, ProfileUser } from './IProfileService'
import type { ProfileUpdateData } from '../domain/ProfileTypes'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export class MockProfileService implements IProfileService {

  // ── updateProfile ────────────────────────────────────────────────────────────
  async updateProfile(userId: string, data: ProfileUpdateData): Promise<ProfileUser> {
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
      // direccion y cp solo aplican a adoptante
      ...(data.direccion !== undefined && entry.user.role === 'applicant'
        ? { address: data.direccion }
        : {}
      ),
      ...(data.cp !== undefined && entry.user.role === 'applicant'
        ? { postalCode: data.cp }
        : {}
      ),
    }

    return updated
  }

  // ── updateShelterAdminProfile ───────────────────────────────────────────────
  async updateShelterAdminProfile(userId: string, data: ProfileUpdateData): Promise<ProfileUser> {
    return this.updateProfile(userId, data)
  }

  // ── changePassword ────────────────────────────────────────────────────────────
  async changePassword(
    userId: string,
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

  // ── updateUserVector ──────────────────────────────────────────────────────────
  // Mock: persiste en localStorage para que la lógica del quiz funcione local.
  // El servicio real reemplaza esto con un PATCH al BE.
  async updateUserVector(
    applicantId: string,
    userVector: [number, number, number, number],
  ): Promise<void> {
    await delay(200)
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(`uv-${applicantId}`, JSON.stringify(userVector))
    } catch { /* noop */ }
  }
}
