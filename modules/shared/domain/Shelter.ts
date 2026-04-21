// modules/shared/domain/Shelter.ts
// Entidad Refugio — basada en tabla Refugio del diagrama ER
// Tabla: id, nombre, ubicacion, descripcion, correo, telefono, logo,
//        imagenPortada, fechaRegistro, aprobado

// ─── Estados ─────────────────────────────────────────────────────────────────

export type ShelterStatus = "pending" | "approved" | "rejected" | "suspended";

import type { DonationConfig } from "./Donation";
export type { DonationConfig };

// ─── Entidad completa ─────────────────────────────────────────────────────────

export interface Shelter {
  id: string;
  userOwnerId: string;
  nombre: string;
  descripcion: string;
  correo: string;
  telefono: string;
  logo: string; // URL del logo
  imagenPortada: string; // URL de la imagen de portada
  fechaRegistro: string; // ISO date
  aprobado: boolean; // campo directo del diagrama
  alcaldia: string | null;
  direccionCompleta: string | null; // estado del país
  schedule: string | null;

  ubicacion: string; // ciudad/estado
  // Estado calculado (derivado de aprobado + campos admin)
  status: ShelterStatus;

  // Campos enriquecidos (del backend extendido o calculados)
  slug: string; // para URLs amigables: /refugios/huellitas-mx
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    web?: string;
  };
  donationConfig: DonationConfig;
  cuotaAdopcion?: number;

  // Contadores (joins del backend)
  totalPerros?: number;
  perrosDisponibles?: number;
  adopcionesRealizadas?: number;
  calificacion?: number; // 0-5 promedio de reseñas
}

// ─── Versión reducida para cards y selects ───────────────────────────────────

export type ShelterListItem = Pick<
  Shelter,
  | "id"
  | "nombre"
  | "slug"
  | "alcaldia"
  | "ubicacion"
  | "logo"
  | "imagenPortada"
  | "status"
  | "perrosDisponibles"
  | "adopcionesRealizadas"
  | "calificacion"
>;
