// modules/shelter/infrastructure/IShelterService.ts
// Contrato del servicio para el portal del refugio

import type { Shelter } from "../../shared/domain/Shelter";
import type {
  Dog,
  DogFilters,
  DogListItem,
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

export interface DashboardDogsByStatus {
  disponible: number;
  en_proceso: number;
  adoptado: number;
  no_disponible: number;
}

export interface DashboardDogsStats {
  recentDogs: DogListItem[];
  dogsByStatus: DashboardDogsByStatus;
}

export interface DashboardRequestsStats {
  solicitudesPendientes: number;
  solicitudesEnRevision: number;
  solicitudesCompletadas: number;
  recentRequests: AdoptionRequestListItem[];
}

// ─── Input types para perfil del refugio ────────────────────────────────────

/**
 * Payload para actualizar el perfil del refugio. Los flags `newLogo` y
 * `newImageUrl` indican al backend que debe generar signed URLs para subir
 * las imágenes nuevas (logo y/o portada).
 */
export type ShelterUpdatePayload = Partial<Shelter> & {
  newLogo?: boolean | null;
  newImageUrl?: boolean | null;
};

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
  cuotaAdopcion?: number;
}

/** Campos editables en una actualización parcial */
export type DogUpdateData = Partial<DogCreateData> & {
  // export type DogUpdateData = Partial<Omit<DogCreateData, "refugioId">> & {
  estado?: DogStatus;
  /** Cantidad de fotos nuevas a subir (genera N signed URLs en la respuesta) */
  amountImagesToCreate?: number;
  /** IDs de DogImage existentes a eliminar */
  imagesToDelete?: string[];
  /**
   * Si la portada elegida es una imagen existente, su id; si es una imagen nueva
   * (aún por subir), null. Omitir si no aplica.
   */
  updatedMainImageId?: string | null;
};

// ─── Interfaz del servicio ────────────────────────────────────────────────────

export interface IShelterService {
  // ── Perfil del refugio ─────────────────────────────────────────────────────
  getShelterProfile(refugioId: string): Promise<Shelter>;
  getShelterById(id: string): Promise<Shelter>;
  updateShelterProfile(
    refugioId: string,
    data: ShelterUpdatePayload,
  ): Promise<{ shelter: Shelter; uploadUrls: string[] }>;

  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardDogsStats(shelterId: string): Promise<DashboardDogsStats>;
  getDashboardRequestsStats(
    shelterId: string,
  ): Promise<DashboardRequestsStats>;

  // ── Perros — lectura ───────────────────────────────────────────────────────
  getShelterDogs(
    refugioId: string,
    filters?: DogFilters,
  ): Promise<PaginatedDogs>;
  getDogById(id: string): Promise<Dog | null>;

  // ── Perros — escritura (CRUD) ──────────────────────────────────────────────
  /**
   * Crea un perro en borrador (estado = no_disponible).
   * Devuelve el perro creado y un arreglo de signed URLs (una por cada
   * extensión enviada en `fotosExtensiones`, en el mismo orden) para subir
   * las imágenes directamente a GCS con `uploadDogImages`.
   */
  createDog(payload: DogCreateData): Promise<{ dog: Dog; uploadUrls: string[] }>;
  /**
   * Sube cada archivo a su signed URL correspondiente (index-matched) con PUT
   * y Content-Type `application/octet-stream`. Reintenta cada PUT 1 vez ante
   * fallo; si después de reintentar sigue fallando, lanza Error indicando los
   * índices que no pudieron subirse. `onProgress` se dispara tras cada archivo
   * (exitoso o fallido).
   */
  uploadDogImages(
    files: File[],
    uploadUrls: string[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<void>;
  /**
   * Actualiza campos editables de un perro existente.
   * Devuelve el perro actualizado y N signed URLs para subir imágenes nuevas
   * (una por cada `amountImagesToCreate`, en el mismo orden). Las imágenes
   * en `imagesToDelete` son eliminadas en el backend.
   */
  updateDog(
    id: string,
    payload: DogUpdateData,
  ): Promise<{ dog: Dog; uploadUrls: string[] }>;
  /** Elimina permanentemente un perro del refugio */
  deleteDog(id: string): Promise<void>;
  /** Actualiza el estado de un perro */
  updateDogStatus(dogId: string, status: DogStatus): Promise<void>;

  // ── Solicitudes ────────────────────────────────────────────────────────────
  getShelterRequests(refugioId: string): Promise<AdoptionRequestListItem[]>;
  getRequestById(id: string): Promise<AdoptionRequest | null>;
  updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest>;
}
