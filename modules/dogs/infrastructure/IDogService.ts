// modules/dogs/infrastructure/IDogService.ts
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
} from "../domain/dog";

// ─── Input types ──────────────────────────────────────────────────────────────

/** Campos necesarios para crear un perro nuevo (el refugio no puede setear estado ni compatibilidad) */
export interface DogCreateData {
  refugioId: number
  nombre: string
  edad: number            // en meses
  raza: string
  tamano: DogSize
  nivelEnergia: EnergyLevel
  sexo: DogSex
  descripcion: string
  foto: string            // URL principal
  fotos?: string[]
  salud?: string
  edadCategoria?: AgeCategory
  castrado?: boolean
  microchip?: boolean
  aptoNinos?: boolean
  aptoPerros?: boolean
  aptoGatos?: boolean
  necesitaJardin?: boolean
  pesoKg?: number
  personalidad?: PersonalityTag[]
  vacunas?: Vaccination[]
}

/** Campos editables en una actualización parcial (no se puede cambiar el refugio dueño) */
export type DogUpdateData = Partial<Omit<DogCreateData, "refugioId">> & { estado?: DogStatus }

/** Resultado de validar una URL de imagen */
export interface MediaValidationResult {
  url: string
  valid: boolean
  error?: "not_found" | "too_large" | "invalid_format" | "unreachable"
}

// ─── Service interface ────────────────────────────────────────────────────────

export interface IDogService {
  // ── Lectura pública ──────────────────────────────────────────────────────
  getDogs(filters?: DogFilters): Promise<PaginatedDogs>
  getDogById(id: number): Promise<Dog | null>
  getDogBySlug(slug: string): Promise<Dog | null>

  // ── Escritura (shelter / admin) ──────────────────────────────────────────
  /** Crea un perro en estado no_disponible (borrador) */
  createDog(data: DogCreateData): Promise<Dog>
  /** Actualiza campos editables de un perro existente */
  updateDog(id: number, data: DogUpdateData): Promise<Dog>
  /** Elimina un perro permanentemente */
  deleteDog(id: number): Promise<void>
  /** Publica un perro: cambia estado a disponible */
  publishDog(id: number): Promise<Dog>
  /** Despublica un perro: cambia estado a no_disponible */
  unpublishDog(id: number): Promise<Dog>

  // ── Media ────────────────────────────────────────────────────────────────
  /** Valida que las URLs de imagen sean accesibles y tengan formato correcto */
  validateMedia(urls: string[]): Promise<MediaValidationResult[]>
}
