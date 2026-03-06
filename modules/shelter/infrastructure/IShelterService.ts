// modules/shelter/infrastructure/IShelterService.ts
// Contrato del servicio para el portal del refugio

import type { Shelter } from '../../shared/domain/Shelter'
import type {
  Dog,
  DogFilters,
  DogSize,
  DogSex,
  DogStatus,
  EnergyLevel,
  AgeCategory,
  PaginatedDogs,
  PersonalityTag,
  Vaccination,
} from '../../shared/domain/Dog'
import type { AdoptionRequest, AdoptionRequestListItem, RequestStatus } from '../../shared/domain/AdoptionRequest'

// ─── Stats del dashboard ──────────────────────────────────────────────────────

export interface ShelterDashboardStats {
  perrosTotales:          number
  perrosDisponibles:      number
  perrosEnProceso:        number
  adopcionesTotales:      number
  solicitudesPendientes:  number
  solicitudesEnRevision:  number
  donacionesEstemes?:     number   // MXN
  calificacion?:          number
}

// ─── Input types para CRUD de perros ─────────────────────────────────────────

/** Campos necesarios para crear un perro (refugioId requerido, estado lo asigna el servicio) */
export interface DogCreateData {
  refugioId:      number
  nombre:         string
  edad:           number        // en meses
  raza:           string
  tamano:         DogSize
  nivelEnergia:   EnergyLevel
  sexo:           DogSex
  descripcion:    string
  foto:           string
  fotos?:         string[]
  salud?:         string
  edadCategoria?: AgeCategory
  castrado?:      boolean
  microchip?:     boolean
  aptoNinos?:     boolean
  aptoPerros?:    boolean
  aptoGatos?:     boolean
  necesitaJardin?: boolean
  pesoKg?:        number
  personalidad?:  PersonalityTag[]
  vacunas?:       Vaccination[]
}

/** Campos editables en una actualización parcial */
export type DogUpdateData = Partial<Omit<DogCreateData, 'refugioId'>> & { estado?: DogStatus }

// ─── Interfaz del servicio ────────────────────────────────────────────────────

export interface IShelterService {

  // ── Perfil del refugio ─────────────────────────────────────────────────────
  getShelterProfile(refugioId: number): Promise<Shelter>
  updateShelterProfile(refugioId: number, data: Partial<Shelter>): Promise<Shelter>

  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardStats(refugioId: number): Promise<ShelterDashboardStats>
  getRecentRequests(refugioId: number, limit?: number): Promise<AdoptionRequestListItem[]>

  // ── Perros — lectura ───────────────────────────────────────────────────────
  getShelterDogs(refugioId: number, filters?: DogFilters): Promise<PaginatedDogs>
  getDogById(id: number): Promise<Dog | null>

  // ── Perros — escritura (CRUD) ──────────────────────────────────────────────
  /** Crea un perro en borrador (estado = no_disponible) */
  createDog(data: DogCreateData): Promise<Dog>
  /** Actualiza campos editables de un perro existente */
  updateDog(id: number, data: DogUpdateData): Promise<Dog>
  /** Elimina permanentemente un perro del refugio */
  deleteDog(id: number): Promise<void>
  /** Alterna publicación: no_disponible ↔ disponible */
  togglePublish(id: number): Promise<Dog>

  // ── Solicitudes ────────────────────────────────────────────────────────────
  getShelterRequests(refugioId: number): Promise<AdoptionRequestListItem[]>
  getRequestById(id: number): Promise<AdoptionRequest | null>
  updateRequestStatus(
    requestId: number,
    newStatus: RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest>
}
