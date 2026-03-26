// modules/dogs/domain/dog.ts
// Re-exporta desde shared/domain/Dog.ts + tipos específicos del módulo

export type {
  Dog,
  DogListItem,
  DogFilters,
  PaginatedDogs,
  DogSize,
  DogSex,
  DogStatus,
  EnergyLevel,
  AgeCategory,
  CompatibilityScore,
  Vaccination,
  PersonalityTag,
} from "../../shared/domain/Dog";

// SearchState — estado UI del buscador de catálogo
export interface SearchState {
  query: string;
  page: number;
  sortBy: "fechaRegistro" | "compatibilidad" | "nombre";
  sortOrder: "asc" | "desc";
}
