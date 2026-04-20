// modules/shelter/infrastructure/IShelterService.ts
// Contrato del servicio para el portal del refugio

import type { Shelter } from "../../shared/domain/Shelter";
import type {
  Dog,
  DogFilters,
  DogSize,
  DogSex,
  DogStatus,
  EnergyLevel,
  FurLength,
  PaginatedDogs,
  PersonalityTag,
  Vaccination,
} from "../../shared/domain/Dog";
import type {
  AdoptionRequest,
  AdoptionRequestListItem,
  RequestStatus,
} from "../../shared/domain/AdoptionRequest";

// ─── Stats del dashboard ──────────────────────────────────────────────────────

export interface ShelterDashboardStats {
  perrosTotales: number;
  perrosDisponibles: number;
  perrosEnProceso: number;
  adopcionesTotales: number;
  solicitudesPendientes: number;
  solicitudesEnRevision: number;
  donacionesEstemes?: number; // MXN
  calificacion?: number;
}

// ─── Input types para CRUD de perros ─────────────────────────────────────────

/** Campos necesarios para crear un perro (refugioId requerido, estado lo asigna el servicio) */
export interface DogCreateData {
  refugioId: string;
  refugioNombre?: string;
  refugioLogo?: string;
  nombre: string;
  edad: number;
  raza: string;
  raza2?: string;
  tamano: DogSize;
  nivelEnergia: EnergyLevel;
  sexo: DogSex;
  descripcion: string;
  foto?: string;
  fotos?: string[];
  estaVacunado: boolean;
  estaDesparasitado: boolean;
  castrado: boolean;
  largoPelaje: FurLength;
  salud: string;
  aptoNinos?: boolean;
  aptoPerros?: boolean;
  aptoGatos?: boolean;
  necesitaJardin?: boolean;
  pesoKg?: number;
  personalidad?: PersonalityTag[];
  vacunas?: Vaccination[];
}

/** Campos editables en una actualización parcial */
export type DogUpdateData = Partial<DogCreateData> & {
  // export type DogUpdateData = Partial<Omit<DogCreateData, "refugioId">> & {
  estado?: DogStatus;
};

// ─── Interfaz del servicio ────────────────────────────────────────────────────

export interface IShelterService {
  // ── Perfil del refugio ─────────────────────────────────────────────────────
  getShelterProfile(refugioId: string): Promise<Shelter>;
  updateShelterProfile(
    refugioId: string,
    data: Partial<Shelter>,
  ): Promise<Shelter>;

  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardStats(refugioId: string): Promise<ShelterDashboardStats>;
  getRecentRequests(
    refugioId: string,
    limit?: number,
  ): Promise<AdoptionRequestListItem[]>;

  // ── Perros — lectura ───────────────────────────────────────────────────────
  getShelterDogs(
    refugioId: string,
    filters?: DogFilters,
  ): Promise<PaginatedDogs>;
  getDogById(id: string): Promise<Dog | null>;

  // ── Perros — escritura (CRUD) ──────────────────────────────────────────────
  /** Crea un perro en borrador (estado = no_disponible) */
  createDog(payload: DogCreateData): Promise<Dog>;
  /** Actualiza campos editables de un perro existente */
  updateDog(id: string, payload: DogUpdateData): Promise<Dog>;
  /** Elimina permanentemente un perro del refugio */
  deleteDog(id: string): Promise<void>;
  /** Alterna publicación: no_disponible ↔ disponible */
  togglePublish(id: string): Promise<Dog>;

  // ── Solicitudes ────────────────────────────────────────────────────────────
  getShelterRequests(refugioId: string): Promise<AdoptionRequestListItem[]>;
  getRequestById(id: string): Promise<AdoptionRequest | null>;
  updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest>;
}
