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
  AgeCategory,
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
  nombre: string;
  edad: number; // en meses — ML: Age
  raza: string; // ML: Breed1 (el backend resuelve el código numérico)
  razaMezclada?: boolean; // ML: Breed2 != 0
  tamano: DogSize; // ML: MaturitySize (pequeño=1, mediano=2, grande=3, gigante=4)
  nivelEnergia: EnergyLevel;
  sexo: DogSex; // ML: Gender (macho=1, hembra=2)
  descripcion: string; // ML: Description
  foto: string; // URL principal — ML: PhotoAmt derivado de fotos.length
  fotos?: string[];
  videoUrl?: string; // ML: VideoAmt (0 o 1)
  // Salud — campos separados para que el backend construya el DogEntity del ML
  vacunado: boolean; // ML: Vaccinated (true=1, false=2)
  desparasitado: boolean; // ML: Dewormed (true=1, false=2)
  castrado: boolean; // ML: Sterilized (true=1, false=2)
  nivelSalud: 1 | 2 | 3; // ML: Health (1=Sano, 2=Lesión leve, 3=Lesión grave)
  pelaje: 1 | 2 | 3; // ML: FurLength (1=Corto, 2=Mediano, 3=Largo)
  cuotaAdopcion?: number; // ML: Fee (0 = sin costo)
  edadCategoria?: AgeCategory;
  microchip?: boolean;
  aptoNinos?: boolean;
  aptoPerros?: boolean;
  aptoGatos?: boolean;
  necesitaJardin?: boolean;
  pesoKg?: number;
  personalidad?: PersonalityTag[];
  vacunas?: Vaccination[];
}

/** Campos editables en una actualización parcial */
export type DogUpdateData = Partial<Omit<DogCreateData, "refugioId">> & {
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
  createDog(data: DogCreateData): Promise<Dog>;
  /** Actualiza campos editables de un perro existente */
  updateDog(id: string, shelterUpdate: DogUpdateData): Promise<Dog>;
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
