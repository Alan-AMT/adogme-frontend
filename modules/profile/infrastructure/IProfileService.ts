// modules/profile/infrastructure/IProfileService.ts
// Contrato del servicio de perfil — independiente de mock o API real

import type { Adoptante, Administrador, ShelterUser } from '@/modules/shared/domain/User'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'
import type { ProfileUpdateData } from '../domain/ProfileTypes'

export type ProfileUser = Adoptante | ShelterUser | Administrador

export interface IProfileService {
  /** Actualiza datos básicos (nombre, teléfono, dirección, avatar) */
  updateProfile(userId: string, data: ProfileUpdateData): Promise<ProfileUser>

  /** Cambia contraseña; lanza error si currentPassword no coincide */
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>

  /** Lee preferencias ML almacenadas para el usuario (null si no existen) */
  getLifestylePreferences(userId: string): Promise<LifestyleQuizAnswers | null>

  /** Guarda/actualiza las preferencias ML del usuario */
  saveLifestylePreferences(userId: string, answers: LifestyleQuizAnswers): Promise<void>
}
