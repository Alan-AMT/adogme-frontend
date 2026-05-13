// modules/dogs/infrastructure/MockDogService.ts
// Fuente de datos: modules/shared/mockData/dogs.mock.ts
// Las operaciones de escritura actúan sobre una copia en memoria local.

import type { Dog, DogFilters, DogListItem, DogStatus, PaginatedDogs } from "../domain/dog";
import {
  MOCK_DOGS,
  getDogById as sharedGetById,
} from "../../shared/mockData/dogs.mock";
import { DogNotFoundError, type IDogService } from "./IDogService";

const DEFAULT_LIMIT = 30;

/** Latencia aleatoria en el rango [min, max] ms */
const delay = (min = 500, max = 800) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

let _dogs: Dog[] = [...MOCK_DOGS];

function toListItem(d: Dog): DogListItem {
  return {
    id: d.id, refugioId: d.refugioId, nombre: d.nombre,
    edad: d.edad, edadCategoria: d.edadCategoria, raza: d.raza,
    tamano: d.tamano, sexo: d.sexo, nivelEnergia: d.nivelEnergia,
    estado: d.estado, foto: d.foto, compatibilidad: d.compatibilidad,
    aptoNinos: d.aptoNinos, aptoPerros: d.aptoPerros,
    necesitaJardin: d.necesitaJardin,
    refugioNombre: d.refugioNombre,
  };
}

// ─── Filter + sort logic ───────────────────────────────────────────────────────
// Filtramos sobre Dog[] para acceder a campos que no están en DogListItem
// (castrado, aptoGatos, necesitaJardin). Luego convertimos a DogListItem.

function applyFilters(filters: DogFilters = {}): DogListItem[] {
  let dogs = _dogs;

  // ── Texto libre ──────────────────────────────────────────────────────────
  if (filters.search) {
    const q = filters.search.toLowerCase();
    dogs = dogs.filter(
      (d) =>
        d.nombre.toLowerCase().includes(q) ||
        d.raza.toLowerCase().includes(q) ||
        (d.refugioNombre ?? "").toLowerCase().includes(q),
    );
  }

  // ── Atributos simples ────────────────────────────────────────────────────
  if (filters.tamano)        dogs = dogs.filter((d) => d.tamano === filters.tamano);
  if (filters.sexo)          dogs = dogs.filter((d) => d.sexo === filters.sexo);
  if (filters.nivelEnergia)  dogs = dogs.filter((d) => d.nivelEnergia === filters.nivelEnergia);
  if (filters.estado)        dogs = dogs.filter((d) => d.estado === filters.estado);
  if (filters.edadCategoria) dogs = dogs.filter((d) => d.edadCategoria === filters.edadCategoria);
  if (filters.raza)          dogs = dogs.filter((d) => d.raza.toLowerCase() === filters.raza!.toLowerCase());
  if (filters.refugioId)     dogs = dogs.filter((d) => d.refugioId === String(filters.refugioId));

  // ── Compatibilidad ───────────────────────────────────────────────────────
  if (filters.aptoNinos  === true) dogs = dogs.filter((d) => d.aptoNinos);
  if (filters.aptoPerros === true) dogs = dogs.filter((d) => d.aptoPerros);
  if (filters.aptoGatos  === true) dogs = dogs.filter((d) => d.aptoGatos);

  // ── Campos solo en Dog (no en DogListItem) ────────────────────────────────
  if (filters.necesitaJardin === true) dogs = dogs.filter((d) => d.necesitaJardin);
  if (filters.castrado       === true) dogs = dogs.filter((d) => d.castrado);

  // ── Solo con puntuación de compatibilidad calculada ──────────────────────
  if (filters.soloConCompatibilidad) dogs = dogs.filter((d) => (d.compatibilidad ?? 0) > 0);

  // ── Convertir a DogListItem antes de ordenar ─────────────────────────────
  let result = dogs.map(toListItem);

  // ── Ordenamiento ─────────────────────────────────────────────────────────
  const asc = filters.sortOrder !== "desc";

  if (filters.sortBy === "nombre") {
    result.sort((a, b) =>
      asc ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre),
    );
  } else if (filters.sortBy === "compatibilidad") {
    result.sort((a, b) =>
      asc ? (a.compatibilidad ?? 0) - (b.compatibilidad ?? 0) : (b.compatibilidad ?? 0) - (a.compatibilidad ?? 0),
    );
  }
  // "fechaRegistro" requiere acceso al Dog completo; ordenamos antes de convertir
  // (El orden natural del array ya es por fechaRegistro asc — desc se invierte aquí)

  return result;
}

/** Ordenamiento por fechaRegistro antes de convertir — opera sobre Dog[] */
function sortByFechaRegistro(dogs: Dog[], asc: boolean): Dog[] {
  return [...dogs].sort((a, b) =>
    asc
      ? a.fechaRegistro.localeCompare(b.fechaRegistro)
      : b.fechaRegistro.localeCompare(a.fechaRegistro),
  );
}

function applyFiltersWithDateSort(filters: DogFilters = {}): DogListItem[] {
  if (filters.sortBy === "fechaRegistro") {
    // Necesitamos ordenar ANTES de convertir a DogListItem
    const asc = filters.sortOrder !== "desc";

    // Aplicar filtros sobre _dogs, ordenar, luego convertir
    let dogs = _dogs;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      dogs = dogs.filter(
        (d) =>
          d.nombre.toLowerCase().includes(q) ||
          d.raza.toLowerCase().includes(q) ||
          (d.refugioNombre ?? "").toLowerCase().includes(q),
      );
    }
    if (filters.tamano)        dogs = dogs.filter((d) => d.tamano === filters.tamano);
    if (filters.sexo)          dogs = dogs.filter((d) => d.sexo === filters.sexo);
    if (filters.nivelEnergia)  dogs = dogs.filter((d) => d.nivelEnergia === filters.nivelEnergia);
    if (filters.estado)        dogs = dogs.filter((d) => d.estado === filters.estado);
    if (filters.edadCategoria) dogs = dogs.filter((d) => d.edadCategoria === filters.edadCategoria);
    if (filters.raza)          dogs = dogs.filter((d) => d.raza.toLowerCase() === filters.raza!.toLowerCase());
    if (filters.refugioId)     dogs = dogs.filter((d) => d.refugioId === String(filters.refugioId));
    if (filters.aptoNinos  === true) dogs = dogs.filter((d) => d.aptoNinos);
    if (filters.aptoPerros === true) dogs = dogs.filter((d) => d.aptoPerros);
    if (filters.aptoGatos  === true) dogs = dogs.filter((d) => d.aptoGatos);
    if (filters.necesitaJardin === true) dogs = dogs.filter((d) => d.necesitaJardin);
    if (filters.castrado       === true) dogs = dogs.filter((d) => d.castrado);
    if (filters.soloConCompatibilidad) dogs = dogs.filter((d) => (d.compatibilidad ?? 0) > 0);

    return sortByFechaRegistro(dogs, asc).map(toListItem);
  }

  return applyFilters(filters);
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class MockDogService implements IDogService {
  async getDogs(filters: DogFilters = {}): Promise<PaginatedDogs> {
    await delay(500, 800);
    const page     = filters.page  ?? 1;
    const limit    = filters.limit ?? DEFAULT_LIMIT;
    const filtered = applyFiltersWithDateSort(filters);
    const total    = filtered.length;
    const start    = (page - 1) * limit;
    const data     = filtered.slice(start, start + limit);
    return { data, total, page, totalPages: Math.ceil(total / limit), limit };
  }

  async getDogById(id: string): Promise<Dog> {
    await delay(200, 400);
    const dog = _dogs.find((d) => d.id === id) ?? sharedGetById(id);
    if (!dog) throw new DogNotFoundError(id);
    return dog;
  }

  async getDogsByIds(ids: string[]): Promise<DogListItem[]> {
    if (ids.length === 0) return [];
    await delay(200, 400);
    return _dogs.filter(d => ids.includes(d.id)).map(toListItem);
  }
}

// Mock-only helper: lets sibling mock services (e.g. MockAdoptionService) mutate
// dog status without exposing a write surface on IDogService. Real implementations
// won't expose this — backend owns adoption→dog status side effects.
export function _setDogStatusForMocks(id: string, estado: DogStatus): void {
  const idx = _dogs.findIndex((d) => d.id === id);
  if (idx === -1) return;
  _dogs = [..._dogs.slice(0, idx), { ..._dogs[idx], estado }, ..._dogs.slice(idx + 1)];
}

export { MOCK_DOGS };
