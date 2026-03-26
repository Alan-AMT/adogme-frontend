// modules/auth/infrastructure/IAuthService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Contrato que DEBEN cumplir tanto MockAuthService (dev) como AuthService (prod).
// Cualquier componente o store debe depender de esta interfaz, nunca de la
// implementación concreta — facilita el swap mock ↔ real sin tocar UI.
// ─────────────────────────────────────────────────────────────────────────────

import type { AuthResponse, LoginCredentials } from '@/modules/shared/domain/User'

// ── Datos de registro ─────────────────────────────────────────────────────────

/** Datos necesarios para registrar un adoptante */
export interface RegisterData {
  nombre:   string
  correo:   string
  telefono: string
  password: string

  // Dirección (requerida para adoptante)
  alcaldia?:       string
  colonia?:        string
  calle?:          string
  numeroExterior?: string
  numeroInterior?: string
  codigoPostal?:   string
}

/** Datos necesarios para registrar un refugio (y su responsable) */
export interface ShelterRegisterData {
  // Cuenta del responsable
  nombre:   string
  correo:   string
  telefono: string
  password: string

  // Información del refugio
  nombreRefugio:    string
  alcaldia:         string
  direccion:        string
  telefonoRefugio?: string
  correoRefugio?:   string
  horario?:         string
  capacidad?:       number
  descripcion?:     string
}

// ── Interfaz del servicio de autenticación ────────────────────────────────────

export interface IAuthService {
  /** Inicia sesión y devuelve la respuesta completa con usuario + tokens */
  login(credentials: LoginCredentials): Promise<AuthResponse>

  /** Registra un adoptante; lanza error si el correo ya existe */
  register(data: RegisterData): Promise<void>

  /** Registra un refugio (shelterStatus quedará 'pending' hasta aprobación manual) */
  registerShelter(data: ShelterRegisterData): Promise<void>

  /** Envía correo de recuperación (siempre retorna éxito — no revela si el correo existe) */
  forgotPassword(email: string): Promise<void>

  /** Aplica la nueva contraseña usando el token de recuperación */
  resetPassword(token: string, password: string): Promise<void>

  /** Cierra sesión: borra cookie auth-token y limpia estado */
  logout(): Promise<void>
}

// ── Re-exports de conveniencia ─────────────────────────────────────────────────
// Los consumidores de IAuthService pueden importar los tipos de auth desde aquí
// en vez de mezclar imports del dominio compartido.
export type { AuthResponse, LoginCredentials }
