// modules/profile/domain/ProfileTypes.ts
// Tipos para actualización de perfil de usuario

import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

// ─── Datos editables del perfil ───────────────────────────────────────────────

export interface ProfileUpdateData {
  nombre?:    string
  email?:     string
  telefono?:  string
  direccion?: string   // solo Adoptante
  cp?:        string   // solo Adoptante
  avatarUrl?: string
}

// ─── Datos de cambio de contraseña ────────────────────────────────────────────

export interface ChangePasswordData {
  currentPassword: string
  newPassword:     string
}

// ─── Re-export para uso en consumidores del módulo ────────────────────────────

export type { LifestyleQuizAnswers }
