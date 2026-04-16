// modules/shared/domain/Dog.ts
// Entidad Perro — basada en tabla Perro del diagrama ER
// Tabla: id, refugio_id, nombre, edad, raza, tamano, nivelEnergia,
//        sexo, salud, estado, compatibilidad, descripcion, foto, fechaRegistro

// ─── Tipos primitivos ────────────────────────────────────────────────────────

export type DogSize = "pequeño" | "mediano" | "grande" | "gigante";
export type DogSex = "macho" | "hembra";
export type DogStatus =
  | "disponible"
  | "en_proceso"
  | "adoptado"
  | "no_disponible";
export type EnergyLevel = "baja" | "moderada" | "alta" | "muy_alta";
export type AgeCategory = "cachorro" | "joven" | "adulto" | "senior";

// compatibilidad es float 0-1 en la BD; en el frontend lo usamos como porcentaje 0-100
export type CompatibilityScore = number; // 0–100

// ─── Sub-entidades ────────────────────────────────────────────────────────────

export interface Vaccination {
  id: number;
  nombre: string;
  fecha: string; // ISO date
  proximaDosis?: string;
  verificada: boolean;
}

export interface PersonalityTag {
  id: number;
  label: string; // ej: "Juguetón", "Tranquilo", "Protector"
  icon: string; // emoji o nombre de icono
  categoria: "caracter" | "socialización" | "actividad" | "entrenamiento";
}

// ─── Entidad completa ─────────────────────────────────────────────────────────
// Incluye todos los campos del diagrama más campos de UI calculados

export interface Dog {
  id: string;
  refugioId: string;

  // Datos básicos (del diagrama)
  nombre: string;
  edad: number; // en meses
  raza: string;
  tamano: DogSize;
  nivelEnergia: EnergyLevel;
  sexo: DogSex;
  salud: string; // texto libre: "Vacunado, desparasitado"
  estado: DogStatus;
  compatibilidad: CompatibilityScore; // float del BE → 0-100 en FE
  descripcion: string;
  foto: string; // URL principal
  fechaRegistro: string; // ISO date

  // Campos enriquecidos (calculados o del backend extendido)
  fotos: string[]; // galería completa
  edadCategoria: AgeCategory;
  vacunas: Vaccination[];
  personalidad: PersonalityTag[];
  castrado: boolean;
  microchip: boolean;
  aptoNinos: boolean;
  aptoPerros: boolean;
  aptoGatos: boolean;
  necesitaJardin: boolean;
  pesoKg?: number;

  // Datos del refugio (join — para cards públicas)
  refugioNombre?: string;
  refugioSlug?: string;
  refugioCiudad?: string;
  refugioLogo?: string; // URL del logo del refugio
}

// ─── Versión reducida para cards y listas ────────────────────────────────────

export type DogListItem = Pick<
  Dog,
  | "id"
  | "refugioId"
  | "nombre"
  | "edad"
  | "edadCategoria"
  | "raza"
  | "tamano"
  | "sexo"
  | "nivelEnergia"
  | "estado"
  | "foto"
  | "compatibilidad"
  | "aptoNinos"
  | "aptoPerros"
  | "necesitaJardin"
  | "refugioNombre"
  | "refugioSlug"
  | "refugioCiudad"
>;

// ─── Filtros de búsqueda ──────────────────────────────────────────────────────

export interface DogFilters {
  search?: string;
  raza?: string;
  tamano?: DogSize | "";
  sexo?: DogSex | "";
  edadCategoria?: AgeCategory | "";
  nivelEnergia?: EnergyLevel | "";
  estado?: DogStatus | "";
  aptoNinos?: boolean;
  aptoPerros?: boolean;
  aptoGatos?: boolean;
  necesitaJardin?: boolean;
  castrado?: boolean;
  refugioId?: string;
  ciudad?: string;
  soloConCompatibilidad?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "fechaRegistro" | "compatibilidad" | "nombre";
  sortOrder?: "asc" | "desc";
}

// ─── Respuesta paginada ───────────────────────────────────────────────────────

export interface PaginatedDogs {
  data: DogListItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}
