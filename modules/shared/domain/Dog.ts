// modules/shared/domain/Dog.ts
// Entidad Perro — sincronizada con el modelo Dog del microservicio dogs_service

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
export type FurLength = "corto" | "mediano" | "largo";

// ─── Función para calcular la categoría de edad ──────────────────────────────
// Reutilizable: cachorro (<12m), joven (12-35m), adulto (36-83m), senior (84m+)

export function calcularEdadCategoria(edadMeses: number): AgeCategory {
  if (edadMeses < 12) return "cachorro";
  if (edadMeses < 36) return "joven";
  if (edadMeses < 84) return "adulto";
  return "senior";
}

// ─── Sub-entidades ────────────────────────────────────────────────────────────

export interface Vaccination {
  id: string;
  nombre: string;
  fecha: string; // ISO date
  proximaDosis?: string;
  verificada: boolean;
}

export enum PersonalityCategory {
  caracter = "caracter",
  socialización = "socialización",
  actividad = "actividad",
  entrenamiento = "entrenamiento",
}

export interface PersonalityTag {
  id: string;
  label: string; // ej: "Juguetón", "Tranquilo", "Protector"
  icon?: string; // solo frontend — para renderizado de UI
  categoria: "caracter" | "socialización" | "actividad" | "entrenamiento";
}

// ─── Entidad completa ─────────────────────────────────────────────────────────

export interface Dog {
  id: string;
  userOwnerId: string;
  refugioId: string;

  // Datos básicos
  nombre: string;
  raza: string;
  raza2?: string;
  edad: number; // en meses
  pesoKg?: number;
  sexo: DogSex;
  tamano: DogSize;
  nivelEnergia: EnergyLevel;
  descripcion: string;
  estado: DogStatus;

  // Personalidad y compatibilidad
  personalidad: PersonalityTag[];
  aptoNinos: boolean;
  aptoPerros: boolean;
  aptoGatos: boolean;

  // Cuidados
  castrado: boolean;
  necesitaJardin: boolean;
  estaVacunado: boolean;
  estaDesparasitado: boolean;
  largoPelaje: FurLength;
  vacunas: Vaccination[];
  salud: string;

  // Multimedia
  foto?: string;
  fotos: string[];

  // Campos calculados / solo frontend
  edadCategoria: AgeCategory;
  compatibilidad?: number;

  // Datos del refugio (join)
  refugioNombre?: string;
  refugioLogo?: string;

  // Timestamps
  fechaRegistro: string; // alias de createdAt
  fechaActualizacion?: string; // alias de updatedAt
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
