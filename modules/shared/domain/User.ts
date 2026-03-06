// modules/shared/domain/User.ts
// Entidades base de usuario — Administrador y Adoptante del diagrama ER

// ─── Roles y estados ────────────────────────────────────────────────────────

export type UserRole = 'visitor' | 'applicant' | 'shelter' | 'admin'

export type AccountStatus = 'active' | 'suspended' | 'pending_verification'

// ─── Entidad base ────────────────────────────────────────────────────────────

export interface User {
  id: number
  nombre: string
  correo: string
  telefono: string
  role: UserRole
  status: AccountStatus
  avatarUrl?: string
  fechaRegistro: string // ISO date
}

// ─── Adoptante (extiende User con campos propios) ────────────────────────────
// Tabla: Adoptante — id, nombre, correo, telefono, direccion, fechaRegistro

export interface Adoptante extends User {
  role: 'applicant'
  direccion: string
}

// ─── Administrador ────────────────────────────────────────────────────────────
// Tabla: Administrador — id, nombre, correo, telefono, puesto

export interface Administrador extends User {
  role: 'admin'
  puesto: string
}

// ─── Shelter user (usuario autenticado con rol shelter) ──────────────────────

export interface ShelterUser extends User {
  role: 'shelter'
  shelterId: number
  shelterStatus: 'pending' | 'approved' | 'rejected' | 'suspended'
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: Adoptante | ShelterUser | Administrador
  token: string
  refreshToken: string
  expiresAt: string // ISO datetime
}

export interface LoginCredentials {
  correo: string
  password: string
}

export interface RegisterAdoptanteData {
  nombre: string
  correo: string
  telefono: string
  direccion: string
  password: string
}
