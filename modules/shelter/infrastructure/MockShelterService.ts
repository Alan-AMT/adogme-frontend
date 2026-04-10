// modules/shelter/infrastructure/MockShelterService.ts
// Archivo 168 — Implementación en memoria de IShelterService.
//
// Toda mutación (crear, editar, eliminar perro; actualizar perfil; cambiar
// estado de solicitud) opera sobre arrays locales copiados de los mocks.
// Los cambios son visibles durante la sesión; al recargar se pierde el estado.

import type { IShelterService, ShelterDashboardStats, DogCreateData, DogUpdateData } from './IShelterService'
import type { Shelter } from '../../shared/domain/Shelter'
import type {
  Dog,
  DogFilters,
  DogListItem,
  PaginatedDogs,
  AgeCategory,
} from '../../shared/domain/Dog'
import type {
  AdoptionRequest,
  AdoptionRequestListItem,
  RequestStatus,
  StatusChange,
} from '../../shared/domain/AdoptionRequest'

import { MOCK_SHELTERS } from '../../shared/mockData/shelters.mock'
import { MOCK_DOGS }     from '../../shared/mockData/dogs.mock'
import {
  MOCK_ADOPTION_REQUESTS,
} from '../../shared/mockData/adoptions.mock'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms))

/** Calcula la categoría de edad a partir de los meses */
function calcEdadCategoria(meses: number): AgeCategory {
  if (meses < 12)  return 'cachorro'
  if (meses < 36)  return 'joven'
  if (meses < 84)  return 'adulto'
  return 'senior'
}

/** Convierte un Dog completo al shape DogListItem para getShelterDogs */
function toDogListItem(d: Dog): DogListItem {
  return {
    id: d.id, refugioId: d.refugioId, nombre: d.nombre,
    edad: d.edad, edadCategoria: d.edadCategoria, raza: d.raza,
    tamano: d.tamano, sexo: d.sexo, nivelEnergia: d.nivelEnergia,
    estado: d.estado, foto: d.foto, compatibilidad: d.compatibilidad,
    aptoNinos: d.aptoNinos, aptoPerros: d.aptoPerros, necesitaJardin: d.necesitaJardin,
    refugioNombre: d.refugioNombre, refugioSlug: d.refugioSlug,
    refugioCiudad: d.refugioCiudad,
  }
}

// ─── Estado mutable en memoria ────────────────────────────────────────────────
// Se inicializa una sola vez cuando el módulo se carga (import).
// Al recargar la página el módulo se re-evalúa y los arrays vuelven al estado inicial.

let _shelters: Shelter[]        = MOCK_SHELTERS.map((s) => ({ ...s }))
let _dogs:     Dog[]            = MOCK_DOGS.map((d) => ({ ...d }))
let _requests: AdoptionRequest[] = MOCK_ADOPTION_REQUESTS.map((r) => ({ ...r, historial: [...r.historial] }))

// Contador para IDs autoincrement de perros nuevos
let _nextDogId = Math.max(...MOCK_DOGS.map((d) => d.id)) + 1

// ─── Implementación ───────────────────────────────────────────────────────────

export class MockShelterService implements IShelterService {

  // ── Perfil del refugio ──────────────────────────────────────────────────────

  async getShelterProfile(refugioId: number): Promise<Shelter> {
    await delay(200)
    const shelter = _shelters.find((s) => s.id === refugioId)
    if (!shelter) throw new Error(`Refugio ${refugioId} no encontrado`)
    return { ...shelter }
  }

  async updateShelterProfile(refugioId: number, data: Partial<Shelter>): Promise<Shelter> {
    await delay(400)
    const idx = _shelters.findIndex((s) => s.id === refugioId)
    if (idx === -1) throw new Error(`Refugio ${refugioId} no encontrado`)

    const updated: Shelter = { ..._shelters[idx], ...data, id: refugioId }
    _shelters = [..._shelters.slice(0, idx), updated, ..._shelters.slice(idx + 1)]
    return { ...updated }
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────

  async getDashboardStats(refugioId: number): Promise<ShelterDashboardStats> {
    await delay(250)

    const dogs    = _dogs.filter((d) => d.refugioId === refugioId)
    const shelter = _shelters.find((s) => s.id === refugioId)
    const reqs    = _requests.filter((r) => r.refugioId === refugioId)

    return {
      perrosTotales:         dogs.length,
      perrosDisponibles:     dogs.filter((d) => d.estado === 'disponible').length,
      perrosEnProceso:       dogs.filter((d) => d.estado === 'en_proceso').length,
      adopcionesTotales:     shelter?.adopcionesRealizadas ?? 0,
      solicitudesPendientes: reqs.filter((r) => r.estado === 'pending').length,
      solicitudesEnRevision: reqs.filter((r) => r.estado === 'in_review').length,
      calificacion:          shelter?.calificacion,
    }
  }

  async getRecentRequests(refugioId: number, limit = 5): Promise<AdoptionRequestListItem[]> {
    await delay(200)
    return _requests
      .filter((r) => r.refugioId === refugioId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, limit)
      .map((r) => ({
        id: r.id, adoptanteId: r.adoptanteId, perroId: r.perroId,
        refugioId: r.refugioId, fecha: r.fecha, estado: r.estado,
        perroNombre: r.perroNombre, perroFoto: r.perroFoto,
        refugioNombre: r.refugioNombre, adoptanteNombre: r.adoptanteNombre,
      }))
  }

  // ── Perros — lectura ────────────────────────────────────────────────────────

  async getShelterDogs(refugioId: number, filters: DogFilters = {}): Promise<PaginatedDogs> {
    await delay(300)
    const page  = filters.page  ?? 1
    const limit = filters.limit ?? 30

    let data = _dogs.filter((d) => d.refugioId === refugioId)

    if (filters.estado) {
      data = data.filter((d) => d.estado === filters.estado)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      data = data.filter(
        (d) => d.nombre.toLowerCase().includes(q) || d.raza.toLowerCase().includes(q),
      )
    }

    const total = data.length
    const start = (page - 1) * limit

    return {
      data:       data.slice(start, start + limit).map(toDogListItem),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    }
  }

  async getDogById(id: number): Promise<Dog | null> {
    await delay(200)
    const dog = _dogs.find((d) => d.id === id)
    return dog ? { ...dog } : null
  }

  // ── Perros — escritura (CRUD) ────────────────────────────────────────────────

  async createDog(data: DogCreateData): Promise<Dog> {
    await delay(500)

    const shelter = _shelters.find((s) => s.id === data.refugioId)

    const newDog: Dog = {
      // Campos proporcionados por el formulario
      refugioId:     data.refugioId,
      nombre:        data.nombre,
      edad:          data.edad,
      raza:          data.raza,
      tamano:        data.tamano,
      nivelEnergia:  data.nivelEnergia,
      sexo:          data.sexo,
      descripcion:   data.descripcion,
      foto:          data.foto,
      fotos:         data.fotos        ?? [data.foto],
      salud:         [
        data.vacunado      ? 'Vacunado'      : null,
        data.desparasitado ? 'Desparasitado' : null,
        data.castrado      ? 'Castrado'      : null,
      ].filter(Boolean).join(', ') || 'Sin información',
      edadCategoria: data.edadCategoria ?? calcEdadCategoria(data.edad),
      castrado:      data.castrado     ?? false,
      microchip:     data.microchip    ?? false,
      aptoNinos:     data.aptoNinos    ?? false,
      aptoPerros:    data.aptoPerros   ?? false,
      aptoGatos:     data.aptoGatos    ?? false,
      necesitaJardin: data.necesitaJardin ?? false,
      pesoKg:        data.pesoKg,
      personalidad:  data.personalidad ?? [],
      vacunas:       data.vacunas      ?? [],

      // Generados por el servicio
      id:            _nextDogId++,
      estado:        'no_disponible',    // siempre borrador al crear
      compatibilidad: 0,                 // sin calcular hasta publicar
      fechaRegistro: new Date().toISOString().split('T')[0],

      // Join con refugio
      refugioNombre: shelter?.nombre,
      refugioSlug:   shelter?.slug,
      refugioCiudad: shelter?.ubicacion,
      refugioLogo:   shelter?.logo,
    }

    _dogs = [..._dogs, newDog]
    return { ...newDog }
  }

  async updateDog(id: number, data: DogUpdateData): Promise<Dog> {
    await delay(400)
    const idx = _dogs.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`)

    const prev = _dogs[idx]
    const updated: Dog = {
      ...prev,
      ...data,
      // Recalcular edadCategoria si cambió la edad y no se proporcionó categoría
      edadCategoria: data.edadCategoria
        ?? (data.edad !== undefined ? calcEdadCategoria(data.edad) : prev.edadCategoria),
      id: prev.id,
      refugioId: prev.refugioId,
    }

    _dogs = [..._dogs.slice(0, idx), updated, ..._dogs.slice(idx + 1)]
    return { ...updated }
  }

  async deleteDog(id: number): Promise<void> {
    await delay(400)
    const idx = _dogs.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`)
    _dogs = _dogs.filter((d) => d.id !== id)
  }

  async togglePublish(id: number): Promise<Dog> {
    await delay(350)
    const idx = _dogs.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`)

    const prev = _dogs[idx]
    const nuevoEstado = prev.estado === 'disponible' ? 'no_disponible' : 'disponible'
    const updated: Dog = { ...prev, estado: nuevoEstado }

    _dogs = [..._dogs.slice(0, idx), updated, ..._dogs.slice(idx + 1)]
    return { ...updated }
  }

  // ── Solicitudes ─────────────────────────────────────────────────────────────

  async getShelterRequests(refugioId: number): Promise<AdoptionRequestListItem[]> {
    await delay(250)
    return _requests
      .filter((r) => r.refugioId === refugioId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map((r) => ({
        id: r.id, adoptanteId: r.adoptanteId, perroId: r.perroId,
        refugioId: r.refugioId, fecha: r.fecha, estado: r.estado,
        perroNombre: r.perroNombre, perroFoto: r.perroFoto,
        refugioNombre: r.refugioNombre, adoptanteNombre: r.adoptanteNombre,
      }))
  }

  async getRequestById(id: number): Promise<AdoptionRequest | null> {
    await delay(200)
    const req = _requests.find((r) => r.id === id)
    return req ? { ...req, historial: [...req.historial] } : null
  }

  async updateRequestStatus(
    requestId: number,
    newStatus: RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest> {
    await delay(400)
    const idx = _requests.findIndex((r) => r.id === requestId)
    if (idx === -1) throw new Error(`Solicitud ${requestId} no encontrada`)

    const prev = _requests[idx]
    const change: StatusChange = {
      id:             Date.now(),
      solicitudId:    requestId,
      estadoAnterior: prev.estado,
      estadoNuevo:    newStatus,
      cambiadoPor:    201, // mock shelter user
      rol:            'shelter',
      comentario,
      fecha:          new Date().toISOString(),
    }

    const updated: AdoptionRequest = {
      ...prev,
      estado:    newStatus,
      historial: [...prev.historial, change],
    }

    _requests = [..._requests.slice(0, idx), updated, ..._requests.slice(idx + 1)]
    return { ...updated, historial: [...updated.historial] }
  }
}
