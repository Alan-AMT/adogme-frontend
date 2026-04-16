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
  refugioId: string
  nombre: string
  edad: number            // en meses — ML: Age
  raza: string            // ML: Breed1 (el backend resuelve el código numérico)
  razaMezclada?: boolean  // ML: Breed2 != 0 — mezcla de razas
  tamano: DogSize         // ML: MaturitySize (pequeño=1, mediano=2, grande=3, gigante=4)
  nivelEnergia: EnergyLevel
  sexo: DogSex            // ML: Gender (macho=1, hembra=2)
  descripcion: string     // ML: Description
  foto: string            // URL principal — ML: PhotoAmt derivado de fotos.length
  fotos?: string[]
  videoUrl?: string       // ML: VideoAmt (0 o 1)
  // Salud — campos separados para que el backend construya el DogEntity del ML
  vacunado: boolean       // ML: Vaccinated (true=1, false=2)
  desparasitado: boolean  // ML: Dewormed (true=1, false=2)
  castrado: boolean       // ML: Sterilized (true=1, false=2)
  nivelSalud: 1 | 2 | 3  // ML: Health (1=Sano, 2=Lesión leve, 3=Lesión grave)
  pelaje: 1 | 2 | 3       // ML: FurLength (1=Corto, 2=Mediano, 3=Largo)
  cuotaAdopcion?: number  // ML: Fee (0 = sin costo)
  edadCategoria?: AgeCategory
  microchip?: boolean
  aptoNinos?: boolean
  aptoPerros?: boolean
  aptoGatos?: boolean
  necesitaJardin?: boolean
  pesoKg?: number
  personalidad?: PersonalityTag[]
  vacunas?: Vaccination[]
  // salud removido — reemplazado por vacunado + desparasitado + nivelSalud
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
  getDogById(id: string): Promise<Dog | null>
  getDogBySlug(slug: string): Promise<Dog | null>

  // ── Escritura (shelter / admin) ──────────────────────────────────────────
  /** Crea un perro en estado no_disponible (borrador) */
  createDog(data: DogCreateData): Promise<Dog>
  /** Actualiza campos editables de un perro existente */
  updateDog(id: string, data: DogUpdateData): Promise<Dog>
  /** Elimina un perro permanentemente */
  deleteDog(id: string): Promise<void>
  /** Publica un perro: cambia estado a disponible */
  publishDog(id: string): Promise<Dog>
  /** Despublica un perro: cambia estado a no_disponible */
  unpublishDog(id: string): Promise<Dog>

  // ── Media ────────────────────────────────────────────────────────────────
  /** Valida que las URLs de imagen sean accesibles y tengan formato correcto */
  validateMedia(urls: string[]): Promise<MediaValidationResult[]>
}
