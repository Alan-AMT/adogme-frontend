// modules/dogs/infrastructure/MockDogService.ts
// Fuente de datos: modules/shared/mockData/dogs.mock.ts
// Las operaciones de escritura actúan sobre una copia en memoria local.

import type { Dog, DogFilters, DogListItem, PaginatedDogs } from "../domain/dog";
import {
  MOCK_DOGS,
  getDogById as sharedGetById,
  getDogBySlug as sharedGetBySlug,
} from "../../shared/mockData/dogs.mock";
import type {
  IDogService,
  DogCreateData,
  DogUpdateData,
  MediaValidationResult,
} from "./IDogService";

const DEFAULT_LIMIT = 30;

/** Latencia aleatoria en el rango [min, max] ms */
const delay = (min = 500, max = 800) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

// ─── Copia mutable en memoria (create / update / delete) ──────────────────────
let _dogs: Dog[] = [...MOCK_DOGS];
let _nextId = Math.max(...MOCK_DOGS.map((d) => d.id)) + 1;

function computeEdadCategoria(edadMeses: number): Dog["edadCategoria"] {
  if (edadMeses < 12) return "cachorro";
  if (edadMeses < 36) return "joven";
  if (edadMeses < 96) return "adulto";
  return "senior";
}

function toListItem(d: Dog): DogListItem {
  return {
    id: d.id, refugioId: d.refugioId, nombre: d.nombre,
    edad: d.edad, edadCategoria: d.edadCategoria, raza: d.raza,
    tamano: d.tamano, sexo: d.sexo, nivelEnergia: d.nivelEnergia,
    estado: d.estado, foto: d.foto, compatibilidad: d.compatibilidad,
    aptoNinos: d.aptoNinos, aptoPerros: d.aptoPerros,
    necesitaJardin: d.necesitaJardin,
    refugioNombre: d.refugioNombre, refugioSlug: d.refugioSlug,
    refugioCiudad: d.refugioCiudad,
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
  if (filters.refugioId)     dogs = dogs.filter((d) => d.refugioId === filters.refugioId);

  // ── Compatibilidad ───────────────────────────────────────────────────────
  if (filters.aptoNinos  === true) dogs = dogs.filter((d) => d.aptoNinos);
  if (filters.aptoPerros === true) dogs = dogs.filter((d) => d.aptoPerros);
  if (filters.aptoGatos  === true) dogs = dogs.filter((d) => d.aptoGatos);

  // ── Campos solo en Dog (no en DogListItem) ────────────────────────────────
  if (filters.necesitaJardin === true) dogs = dogs.filter((d) => d.necesitaJardin);
  if (filters.castrado       === true) dogs = dogs.filter((d) => d.castrado);

  // ── Ciudad del refugio ───────────────────────────────────────────────────
  if (filters.ciudad) {
    const city = filters.ciudad.toLowerCase();
    dogs = dogs.filter((d) => (d.refugioCiudad ?? "").toLowerCase().includes(city));
  }

  // ── Solo con puntuación de compatibilidad calculada ──────────────────────
  if (filters.soloConCompatibilidad) dogs = dogs.filter((d) => d.compatibilidad > 0);

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
      asc ? a.compatibilidad - b.compatibilidad : b.compatibilidad - a.compatibilidad,
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
    if (filters.refugioId)     dogs = dogs.filter((d) => d.refugioId === filters.refugioId);
    if (filters.aptoNinos  === true) dogs = dogs.filter((d) => d.aptoNinos);
    if (filters.aptoPerros === true) dogs = dogs.filter((d) => d.aptoPerros);
    if (filters.aptoGatos  === true) dogs = dogs.filter((d) => d.aptoGatos);
    if (filters.necesitaJardin === true) dogs = dogs.filter((d) => d.necesitaJardin);
    if (filters.castrado       === true) dogs = dogs.filter((d) => d.castrado);
    if (filters.ciudad) {
      const city = filters.ciudad.toLowerCase();
      dogs = dogs.filter((d) => (d.refugioCiudad ?? "").toLowerCase().includes(city));
    }
    if (filters.soloConCompatibilidad) dogs = dogs.filter((d) => d.compatibilidad > 0);

    return sortByFechaRegistro(dogs, asc).map(toListItem);
  }

  return applyFilters(filters);
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class MockDogService implements IDogService {

  // ── Lectura pública ────────────────────────────────────────────────────────

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

  async getDogById(id: number): Promise<Dog | null> {
    await delay(200, 400);
    return _dogs.find((d) => d.id === id) ?? sharedGetById(id) ?? null;
  }

  async getDogBySlug(slug: string): Promise<Dog | null> {
    await delay(200, 400);
    return sharedGetBySlug(slug) ?? null;
  }

  // ── Escritura ──────────────────────────────────────────────────────────────

  async createDog(data: DogCreateData): Promise<Dog> {
    await delay(500, 800);
    const newDog: Dog = {
      id:             _nextId++,
      refugioId:      data.refugioId,
      nombre:         data.nombre,
      edad:           data.edad,
      edadCategoria:  data.edadCategoria ?? computeEdadCategoria(data.edad),
      raza:           data.raza,
      tamano:         data.tamano,
      nivelEnergia:   data.nivelEnergia,
      sexo:           data.sexo,
      descripcion:    data.descripcion,
      foto:           data.foto,
      fotos:          data.fotos ?? [data.foto],
      salud:          [
        data.vacunado      ? 'Vacunado'      : null,
        data.desparasitado ? 'Desparasitado' : null,
        data.castrado      ? 'Castrado'      : null,
      ].filter(Boolean).join(', ') || 'Sin información',
      estado:         "no_disponible",  // borrador hasta publishDog
      compatibilidad: 0,
      fechaRegistro:  new Date().toISOString().slice(0, 10),
      castrado:       data.castrado       ?? false,
      microchip:      data.microchip      ?? false,
      aptoNinos:      data.aptoNinos      ?? false,
      aptoPerros:     data.aptoPerros     ?? false,
      aptoGatos:      data.aptoGatos      ?? false,
      necesitaJardin: data.necesitaJardin ?? false,
      pesoKg:         data.pesoKg,
      personalidad:   data.personalidad   ?? [],
      vacunas:        data.vacunas        ?? [],
    };
    _dogs = [..._dogs, newDog];
    return newDog;
  }

  async updateDog(id: number, data: DogUpdateData): Promise<Dog> {
    await delay(500, 700);
    const idx = _dogs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Dog ${id} not found`);
    const updated: Dog = {
      ..._dogs[idx],
      ...data,
      edadCategoria:
        data.edad !== undefined
          ? (data.edadCategoria ?? computeEdadCategoria(data.edad))
          : _dogs[idx].edadCategoria,
    };
    _dogs = [..._dogs.slice(0, idx), updated, ..._dogs.slice(idx + 1)];
    return updated;
  }

  async deleteDog(id: number): Promise<void> {
    await delay(500, 700);
    _dogs = _dogs.filter((d) => d.id !== id);
  }

  async publishDog(id: number): Promise<Dog> {
    return this.updateDog(id, { estado: "disponible" });
  }

  async unpublishDog(id: number): Promise<Dog> {
    return this.updateDog(id, { estado: "no_disponible" });
  }

  // ── Media ──────────────────────────────────────────────────────────────────

  async validateMedia(urls: string[]): Promise<MediaValidationResult[]> {
    await delay(300, 600);
    const VALID_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
    return urls.map((url): MediaValidationResult => {
      if (!url?.trim()) return { url, valid: false, error: "not_found" };
      const lower = url.toLowerCase();
      if (!VALID_EXTS.some((ext) => lower.includes(ext))) {
        return { url, valid: false, error: "invalid_format" };
      }
      if (!lower.startsWith("/") && !lower.startsWith("http")) {
        return { url, valid: false, error: "unreachable" };
      }
      return { url, valid: true };
    });
  }
}

// Exports for convenience
export { MOCK_DOGS };
