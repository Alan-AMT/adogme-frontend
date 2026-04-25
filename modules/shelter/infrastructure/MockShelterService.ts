// modules/shelter/infrastructure/MockShelterService.ts
// Archivo 168 — Implementación en memoria de IShelterService.
//
// Toda mutación (crear, editar, eliminar perro; actualizar perfil; cambiar
// estado de solicitud) opera sobre arrays locales copiados de los mocks.
// Los cambios son visibles durante la sesión; al recargar se pierde el estado.

import type {
  IShelterService,
  ShelterDashboardStats,
  DogCreateData,
  DogUpdateData,
} from "./IShelterService";
import type { Shelter } from "../../shared/domain/Shelter";
import type {
  Dog,
  DogFilters,
  DogListItem,
  PaginatedDogs,
} from "../../shared/domain/Dog";
import { calcularEdadCategoria } from "../../shared/domain/Dog";
import type {
  AdoptionRequest,
  AdoptionRequestListItem,
  RequestStatus,
  StatusChange,
} from "../../shared/domain/AdoptionRequest";

import { MOCK_SHELTERS } from "../../shared/mockData/shelters.mock";
import { MOCK_DOGS } from "../../shared/mockData/dogs.mock";
import { MOCK_ADOPTION_REQUESTS } from "../../shared/mockData/adoptions.mock";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

/** Convierte un Dog completo al shape DogListItem para getShelterDogs */
function toDogListItem(d: Dog): DogListItem {
  return {
    id: d.id,
    refugioId: d.refugioId,
    nombre: d.nombre,
    edad: d.edad,
    edadCategoria: d.edadCategoria,
    raza: d.raza,
    tamano: d.tamano,
    sexo: d.sexo,
    nivelEnergia: d.nivelEnergia,
    estado: d.estado,
    foto: d.foto,
    compatibilidad: d.compatibilidad,
    aptoNinos: d.aptoNinos,
    aptoPerros: d.aptoPerros,
    necesitaJardin: d.necesitaJardin,
    refugioNombre: d.refugioNombre,
  };
}

// ─── Estado mutable en memoria ────────────────────────────────────────────────
// Se inicializa una sola vez cuando el módulo se carga (import).
// Al recargar la página el módulo se re-evalúa y los arrays vuelven al estado inicial.

let _shelters: Shelter[] = MOCK_SHELTERS.map((s) => ({ ...s }));
let _dogs: Dog[] = MOCK_DOGS.map((d) => ({ ...d }));
let _requests: AdoptionRequest[] = MOCK_ADOPTION_REQUESTS.map((r) => ({
  ...r,
  historial: [...r.historial],
}));

// Contador para IDs autoincrement de perros nuevos
let _nextDogId = String(Math.random());

// ─── Implementación ───────────────────────────────────────────────────────────

export class MockShelterService implements IShelterService {
  // ── Perfil del refugio ──────────────────────────────────────────────────────

  async getShelterProfile(refugioId: string): Promise<Shelter> {
    await delay(200);
    const shelter = _shelters[0];
    // const shelter = _shelters.find((s) => s.id === refugioId);
    if (!shelter) throw new Error(`Refugio ${refugioId} no encontrado`);
    return { ...shelter };
  }

  async updateShelterProfile(
    refugioId: string,
    shelterUpdate: Partial<Shelter>,
  ): Promise<Shelter> {
    await delay(400);
    const idx = _shelters.findIndex((s) => s.id === refugioId);
    if (idx === -1) throw new Error(`Refugio ${refugioId} no encontrado`);

    const updated: Shelter = {
      ..._shelters[idx],
      ...shelterUpdate,
      id: refugioId,
    };
    _shelters = [
      ..._shelters.slice(0, idx),
      updated,
      ..._shelters.slice(idx + 1),
    ];
    return { ...updated };
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────

  async getDashboardStats(refugioId: string): Promise<ShelterDashboardStats> {
    await delay(250);

    const dogs = _dogs.filter((d) => d.refugioId === refugioId);
    const shelter = _shelters.find((s) => s.id === refugioId);
    const reqs = _requests.filter((r) => r.refugioId === refugioId);

    return {
      perrosTotales: dogs.length,
      perrosDisponibles: dogs.filter((d) => d.estado === "disponible").length,
      perrosEnProceso: dogs.filter((d) => d.estado === "en_proceso").length,
      adopcionesTotales: shelter?.adopcionesRealizadas ?? 0,
      solicitudesPendientes: reqs.filter((r) => r.estado === "pending").length,
      solicitudesEnRevision: reqs.filter((r) => r.estado === "in_review")
        .length,
      calificacion: shelter?.calificacion,
    };
  }

  async getRecentRequests(
    refugioId: string,
    limit = 5,
  ): Promise<AdoptionRequestListItem[]> {
    await delay(200);
    return _requests
      .filter((r) => r.refugioId === refugioId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        adoptanteId: r.adoptanteId,
        perroId: r.perroId,
        refugioId: r.refugioId,
        fecha: r.fecha,
        estado: r.estado,
        perroNombre: r.perroNombre,
        perroFoto: r.perroFoto,
        refugioNombre: r.refugioNombre,
        adoptanteNombre: r.adoptanteNombre,
      }));
  }

  // ── Perros — lectura ────────────────────────────────────────────────────────

  async getShelterDogs(
    refugioId: string,
    filters: DogFilters = {},
  ): Promise<PaginatedDogs> {
    await delay(300);
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 30;

    let data = _dogs.filter((d) => d.refugioId === refugioId);

    if (filters.estado) {
      data = data.filter((d) => d.estado === filters.estado);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (d) =>
          d.nombre.toLowerCase().includes(q) ||
          d.raza.toLowerCase().includes(q),
      );
    }

    const total = data.length;
    const start = (page - 1) * limit;

    return {
      data: data.slice(start, start + limit).map(toDogListItem),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }

  async getDogById(id: string): Promise<Dog | null> {
    await delay(200);
    const dog = _dogs.find((d) => d.id === id);
    return dog ? { ...dog } : null;
  }

  // ── Perros — escritura (CRUD) ────────────────────────────────────────────────

  async createDog(
    payload: DogCreateData,
  ): Promise<{ dog: Dog; uploadUrls: string[] }> {
    await delay(500);

    const shelter = _shelters.find((s) => s.id === payload.refugioId);

    const now = new Date().toISOString().split("T")[0];

    const newDog: Dog = {
      id: String(Math.random()),
      userOwnerId: "current-user",
      refugioId: payload.refugioId,
      nombre: payload.nombre,
      raza: payload.raza,
      raza2: payload.raza2,
      edad: payload.edad,
      pesoKg: payload.pesoKg,
      sexo: payload.sexo,
      tamano: payload.tamano,
      nivelEnergia: payload.nivelEnergia,
      descripcion: payload.descripcion,
      estado: "no_disponible",
      personalidad: payload.personalidad ?? [],
      aptoNinos: payload.aptoNinos ?? false,
      aptoPerros: payload.aptoPerros ?? false,
      aptoGatos: payload.aptoGatos ?? false,
      castrado: payload.castrado,
      necesitaJardin: payload.necesitaJardin ?? false,
      estaVacunado: payload.estaVacunado,
      estaDesparasitado: payload.estaDesparasitado,
      largoPelaje: payload.largoPelaje,
      vacunas: payload.vacunas ?? [],
      salud: payload.salud,
      foto: payload.foto,
      fotos: payload.fotos ?? (payload.foto ? [payload.foto] : []),
      edadCategoria: calcularEdadCategoria(payload.edad),
      compatibilidad: 0,
      refugioNombre: shelter?.nombre,
      refugioLogo: shelter?.logo,
      fechaRegistro: now,
    };

    _dogs = [..._dogs, newDog];
    const uploadUrls = (payload.fotos ?? []).map(
      (_url, i) => `https://mock-gcs/upload/${newDog.id}/${i}`,
    );
    return { dog: { ...newDog }, uploadUrls };
  }

  async uploadDogImages(
    files: File[],
    uploadUrls: string[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<void> {
    const total = uploadUrls.length;
    for (let i = 0; i < total; i += 1) {
      await delay(200);
      onProgress?.(i + 1, total);
    }
    // Mock: no hace PUT real; asumimos éxito. `files` no se usa.
    void files;
  }

  async updateDog(id: string, data: DogUpdateData): Promise<Dog> {
    await delay(400);
    const idx = _dogs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`);

    const prev = _dogs[idx];
    const edad = data.edad ?? prev.edad;
    const updated: Dog = {
      ...prev,
      ...data,
      edadCategoria: calcularEdadCategoria(edad),
      id: prev.id,
      refugioId: prev.refugioId,
    };

    _dogs = [..._dogs.slice(0, idx), updated, ..._dogs.slice(idx + 1)];
    return { ...updated };
  }

  async deleteDog(id: string): Promise<void> {
    await delay(400);
    const idx = _dogs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`);
    _dogs = _dogs.filter((d) => d.id !== id);
  }

  async togglePublish(id: string): Promise<Dog> {
    await delay(350);
    const idx = _dogs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`);

    const prev = _dogs[idx];
    const nuevoEstado =
      prev.estado === "disponible" ? "no_disponible" : "disponible";
    const updated: Dog = { ...prev, estado: nuevoEstado };

    _dogs = [..._dogs.slice(0, idx), updated, ..._dogs.slice(idx + 1)];
    return { ...updated };
  }

  // ── Solicitudes ─────────────────────────────────────────────────────────────

  async getShelterRequests(
    refugioId: string,
  ): Promise<AdoptionRequestListItem[]> {
    await delay(250);
    return _requests
      .filter((r) => r.refugioId === refugioId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map((r) => ({
        id: r.id,
        adoptanteId: r.adoptanteId,
        perroId: r.perroId,
        refugioId: r.refugioId,
        fecha: r.fecha,
        estado: r.estado,
        perroNombre: r.perroNombre,
        perroFoto: r.perroFoto,
        refugioNombre: r.refugioNombre,
        adoptanteNombre: r.adoptanteNombre,
      }));
  }

  async getRequestById(id: string): Promise<AdoptionRequest | null> {
    await delay(200);
    const req = _requests.find((r) => r.id === id);
    return req ? { ...req, historial: [...req.historial] } : null;
  }

  async updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest> {
    await delay(400);
    const idx = _requests.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error(`Solicitud ${requestId} no encontrada`);

    const prev = _requests[idx];
    const change: StatusChange = {
      id: Date.now(),
      solicitudId: requestId,
      estadoAnterior: prev.estado,
      estadoNuevo: newStatus,
      cambiadoPor: "201", // mock shelter user
      rol: "shelter",
      comentario,
      fecha: new Date().toISOString(),
    };

    const updated: AdoptionRequest = {
      ...prev,
      estado: newStatus,
      historial: [...prev.historial, change],
    };

    _requests = [
      ..._requests.slice(0, idx),
      updated,
      ..._requests.slice(idx + 1),
    ];
    return { ...updated, historial: [...updated.historial] };
  }
}
