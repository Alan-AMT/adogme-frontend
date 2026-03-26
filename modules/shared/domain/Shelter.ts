// modules/shared/domain/Shelter.ts
// Entidad Refugio — basada en tabla Refugio del diagrama ER
// Tabla: id, nombre, ubicacion, descripcion, correo, telefono, logo,
//        imagenPortada, fechaRegistro, aprobado

// ─── Estados ─────────────────────────────────────────────────────────────────

export type ShelterStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

import type { DonationConfig } from './Donation'
export type { DonationConfig }

// ─── Entidad completa ─────────────────────────────────────────────────────────

export interface Shelter {
  id: number
  nombre: string
  ubicacion: string              // ciudad/estado
  descripcion: string
  correo: string
  telefono: string
  logo: string                   // URL del logo
  imagenPortada: string          // URL de la imagen de portada
  fechaRegistro: string          // ISO date
  aprobado: boolean              // campo directo del diagrama

  // Estado calculado (derivado de aprobado + campos admin)
  status: ShelterStatus

  // Campos enriquecidos (del backend extendido o calculados)
  slug: string                   // para URLs amigables: /refugios/huellitas-mx
  ciudad: string
  estado: string                 // estado del país
  redesSociales?: {
    facebook?: string
    instagram?: string
    twitter?: string
    web?: string
  }
  donationConfig: DonationConfig

  // Contadores (joins del backend)
  totalPerros?: number
  perrosDisponibles?: number
  adopcionesRealizadas?: number
  calificacion?: number          // 0-5 promedio de reseñas
}

// ─── Versión reducida para cards y selects ───────────────────────────────────

export type ShelterListItem = Pick<
  Shelter,
  | 'id'
  | 'nombre'
  | 'slug'
  | 'ciudad'
  | 'estado'
  | 'logo'
  | 'imagenPortada'
  | 'status'
  | 'perrosDisponibles'
  | 'adopcionesRealizadas'
  | 'calificacion'
>

// ─── Formulario de registro de refugio ───────────────────────────────────────

export interface ShelterRegisterData {
  nombre: string
  correo: string
  telefono: string
  ubicacion: string
  ciudad: string
  estado: string
  descripcion: string
  password: string
}
