// modules/profile/infrastructure/IProfileService.ts
// Contrato del servicio de perfil — independiente de mock o API real

import type { Adoptante, Administrador, ShelterUser } from '@/modules/shared/domain/User'
import type { ProfileUpdateData } from '../domain/ProfileTypes'

export type ProfileUser = Adoptante | ShelterUser | Administrador

export interface IProfileService {
  /** Actualiza datos básicos (nombre, teléfono, dirección, avatar) */
  updateProfile(userId: string, data: ProfileUpdateData): Promise<ProfileUser>

  updateShelterAdminProfile(userId: string, data: ProfileUpdateData): Promise<ProfileUser>

  /** Cambia contraseña; lanza error si currentPassword no coincide */
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>

  /**
   * Persiste el user_vector calculado por el ML en el adoptante.
   * En backend será PATCH /applicants-ms/applicant/:id/user-vector.
   * El FE toma applicantId del authStore (cookie).
   */
  updateUserVector(
    applicantId: string,
    userVector: [number, number, number, number],
  ): Promise<void>
}
