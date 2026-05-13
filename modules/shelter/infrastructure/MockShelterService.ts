// modules/shelter/infrastructure/MockShelterService.ts
// Archivo 168 — Implementación en memoria de IShelterService.
//
// Toda mutación (crear, editar, eliminar perro; actualizar perfil; cambiar
// estado de solicitud) opera sobre arrays locales copiados de los mocks.
// Los cambios son visibles durante la sesión; al recargar se pierde el estado.

import type {
  DashboardChartPeriod,
  DashboardChartPoint,
  DashboardDogsStats,
  DashboardRequestsStats,
  DogCreateData,
  DogUpdateData,
  IShelterService,
} from "./IShelterService";
import type { Shelter } from "../../shared/domain/Shelter";
import type {
  Dog,
  DogFilters,
  DogImage,
  DogListItem,
  DogStatus,
  PaginatedDogs,
} from "../../shared/domain/Dog";
import { calcularEdadCategoria } from "../../shared/domain/Dog";
import type {
  AdoptionRequest,
  AdoptionRequestListItem,
  PaginatedResult,
  RequestStatus,
  StatusChange,
} from "../../shared/domain/AdoptionRequest";

import { MOCK_SHELTERS } from "../../shared/mockData/shelters.mock";
import { MOCK_DOGS } from "../../shared/mockData/dogs.mock";
import { MOCK_ADOPTION_REQUESTS } from "../../shared/mockData/adoptions.mock";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

/** Envuelve URLs sueltas en DogImage[] para el read model del Dog */
function urlsToDogImages(urls: string[], dogId: string): DogImage[] {
  return urls.map((url, i) => ({
    id: `${dogId}-img-${i}`,
    dogId,
    url,
    status: "pending" as const,
  }));
}

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
  revisiones: [...r.revisiones],
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

  async getShelterById(id: string): Promise<Shelter> {
    return this.getShelterProfile(id);
  }

  async updateShelterProfile(
    refugioId: string,
    shelterUpdate: Partial<Shelter>,
  ): Promise<{ shelter: Shelter; uploadUrls: string[] }> {
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
    return { shelter: { ...updated }, uploadUrls: [] };
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────

  async getDashboardDogsStats(
    shelterId: string,
  ): Promise<DashboardDogsStats> {
    await delay(250);

    const dogs = _dogs.filter((d) => d.refugioId === shelterId);

    const recentDogs = [...dogs]
      .sort((a, b) =>
        (b.fechaRegistro ?? "").localeCompare(a.fechaRegistro ?? ""),
      )
      .slice(0, 5)
      .map(toDogListItem);

    return {
      recentDogs,
      dogsByStatus: {
        disponible: dogs.filter((d) => d.estado === "disponible").length,
        en_proceso: dogs.filter((d) => d.estado === "en_proceso").length,
        adoptado: dogs.filter((d) => d.estado === "adoptado").length,
        no_disponible: dogs.filter((d) => d.estado === "no_disponible").length,
      },
    };
  }

  async getDashboardRequestsChartData(
    _shelterId: string,
    period: DashboardChartPeriod,
  ): Promise<DashboardChartPoint[]> {
    await delay(200);
    if (period === "semana") {
      return [
        { label: "Lun", value: 2 },
        { label: "Mar", value: 5 },
        { label: "Mié", value: 3 },
        { label: "Jue", value: 7 },
        { label: "Vie", value: 4 },
        { label: "Sáb", value: 8 },
        { label: "Dom", value: 1 },
      ];
    }
    if (period === "mes") {
      return [
        { label: "Sem 1", value: 12 },
        { label: "Sem 2", value: 18 },
        { label: "Sem 3", value: 9 },
        { label: "Sem 4", value: 15 },
      ];
    }
    return [
      { label: "Ene", value: 8 },
      { label: "Feb", value: 12 },
      { label: "Mar", value: 15 },
      { label: "Abr", value: 22 },
      { label: "May", value: 18 },
      { label: "Jun", value: 25 },
      { label: "Jul", value: 30 },
      { label: "Ago", value: 28 },
      { label: "Sep", value: 20 },
      { label: "Oct", value: 35 },
      { label: "Nov", value: 42 },
      { label: "Dic", value: 38 },
    ];
  }

  async getDashboardRequestsStats(
    shelterId: string,
  ): Promise<DashboardRequestsStats> {
    await delay(200);

    const reqs = _requests.filter((r) => r.refugioId === shelterId);
    const recentRequests: AdoptionRequestListItem[] = [...reqs]
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        fecha: r.fecha,
        estado: r.estado,
        perroNombre: r.perroNombre,
        perroFoto: r.perroFoto,
        refugioNombre: r.refugioNombre,
        adoptanteNombre: r.adoptanteNombre,
      }));

    return {
      solicitudesPendientes: reqs.filter((r) => r.estado === "pending").length,
      solicitudesEnRevision: reqs.filter((r) => r.estado === "in_review").length,
      solicitudesCompletadas: reqs.filter((r) => r.estado === "approved").length,
      solicitudesCanceladas: reqs.filter((r) => r.estado === "cancelled").length,
      solicitudesRechazadas: reqs.filter((r) => r.estado === "rejected").length,
      recentRequests,
    };
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

    const newDogId = String(Math.random());
    const fotosUrls = payload.fotos ?? (payload.foto ? [payload.foto] : []);
    const newDog: Dog = {
      id: newDogId,
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
      fotos: urlsToDogImages(fotosUrls, newDogId),
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

  async updateDog(
    id: string,
    data: DogUpdateData,
  ): Promise<{ dog: Dog; uploadUrls: string[] }> {
    await delay(400);
    const idx = _dogs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`);

    const prev = _dogs[idx];
    const edad = data.edad ?? prev.edad;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      fotos: _ignoredFotos,
      amountImagesToCreate,
      imagesToDelete,
      ...rest
    } = data;

    // 1) Aplicar borrado de imágenes existentes
    const idsAEliminar = new Set(imagesToDelete ?? []);
    const fotosRestantes = prev.fotos.filter(
      (img) => !idsAEliminar.has(img.id),
    );

    // 2) Reservar N "slots" nuevos (mock: tras el upload, sus URLs serán reales)
    const nuevasFotos = Array.from(
      { length: amountImagesToCreate ?? 0 },
      (_v, i) => ({
        id: `${prev.id}-img-new-${Date.now()}-${i}`,
        dogId: prev.id,
        url: `https://mock-gcs/${prev.id}/${Date.now()}-${i}.jpg`,
        status: "pending" as const,
      }),
    );

    const updated: Dog = {
      ...prev,
      ...rest,
      fotos: [...fotosRestantes, ...nuevasFotos],
      edadCategoria: calcularEdadCategoria(edad),
      id: prev.id,
      refugioId: prev.refugioId,
    };

    _dogs = [..._dogs.slice(0, idx), updated, ..._dogs.slice(idx + 1)];

    const uploadUrls = nuevasFotos.map(
      (_f, i) => `https://mock-gcs/upload/${prev.id}/${i}`,
    );
    return { dog: { ...updated }, uploadUrls };
  }

  async deleteDog(id: string): Promise<void> {
    await delay(400);
    const idx = _dogs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`);
    _dogs = _dogs.filter((d) => d.id !== id);
  }

  async updateDogStatus(dogId: string, status: DogStatus): Promise<void> {
    await delay(350);
    const idx = _dogs.findIndex((d) => d.id === dogId);
    if (idx === -1) throw new Error(`Perro ${dogId} no encontrado`);
    _dogs = _dogs.map((d, i) => i === idx ? { ...d, estado: status } : d);
  }

  // ── Solicitudes ─────────────────────────────────────────────────────────────

  async getShelterRequests(
    refugioId: string,
    page = 1,
    limit = 12,
    status?: RequestStatus,
    search?: string,
  ): Promise<PaginatedResult<AdoptionRequestListItem>> {
    await delay(250);
    const q = search?.toLowerCase()
    const all = _requests
      .filter((r) => r.refugioId === refugioId && (!status || r.estado === status))
      .filter((r) => !q || (r.perroNombre ?? '').toLowerCase().includes(q) || (r.adoptanteNombre ?? '').toLowerCase().includes(q))
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map((r) => ({
        id: r.id,
        fecha: r.fecha,
        estado: r.estado,
        perroNombre: r.perroNombre,
        perroFoto: r.perroFoto,
        refugioNombre: r.refugioNombre,
        adoptanteNombre: r.adoptanteNombre,
      }));
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    return { data: all.slice(start, start + limit), total, page, totalPages, limit };
  }

  async getRequestById(id: string): Promise<AdoptionRequest | null> {
    await delay(200);
    const req = _requests.find((r) => r.id === id);
    return req ? { ...req, revisiones: [...req.revisiones] } : null;
  }

  async updateRequestStatus(
    requestId: string,
    _shelterId: string,
    newStatus: RequestStatus,
    note?: string,
  ): Promise<void> {
    await delay(400);
    const idx = _requests.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error(`Solicitud ${requestId} no encontrada`);

    const prev = _requests[idx];
    const change: StatusChange = {
      id: String(Date.now()),
      applicationId: requestId,
      fromStatus: prev.estado,
      toStatus: newStatus,
      note: note ?? null,
      createdAt: new Date().toISOString(),
    };

    const updated: AdoptionRequest = {
      ...prev,
      estado: newStatus,
      revisiones: [...prev.revisiones, change],
    };

    _requests = [
      ..._requests.slice(0, idx),
      updated,
      ..._requests.slice(idx + 1),
    ];
  }
}
