// modules/adoption/infrastructure/MockAdoptionService.ts
// Implementación mock — datos en memoria, simula latencia de red.
// submit / getMyRequests / getById / updateStatus / cancel

import type { AdoptionRequest, AdoptionRequestListItem, RequestStatus } from '../../shared/domain/AdoptionRequest'
import type { IAdoptionService, SubmitAdoptionPayload } from './IAdoptionService'
import { ALLOWED_TRANSITIONS } from '../domain/AdoptionRequest'
import {
  MOCK_ADOPTION_REQUESTS,
  getRequestsByAdoptante,
  getRequestById as sharedGetById,
} from '../../shared/mockData/adoptions.mock'
import { getDogById } from '../../shared/mockData/dogs.mock'
import { dogService } from '../../dogs/infrastructure/DogServiceFactory'

// ─── Copia mutable en memoria ─────────────────────────────────────────────────
// Partimos del mock estático y cualquier submit/update opera aquí.

let _requests: AdoptionRequest[] = [...MOCK_ADOPTION_REQUESTS]
let _nextId = Math.max(...MOCK_ADOPTION_REQUESTS.map((r) => Number(r.id))) + 1
let _nextChangeId = 100

/** Latencia simulada */
const delay = (min = 300, max = 600) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)))

// ─── Helpers internos ─────────────────────────────────────────────────────────

function toListItem(r: AdoptionRequest): AdoptionRequestListItem {
  return {
    id: r.id, adoptanteId: r.adoptanteId, perroId: r.perroId,
    refugioId: r.refugioId, fecha: r.fecha, estado: r.estado,
    perroNombre: r.perroNombre, perroFoto: r.perroFoto,
    refugioNombre: r.refugioNombre, adoptanteNombre: r.adoptanteNombre,
  }
}

function assertTransition(current: RequestStatus, next: RequestStatus): void {
  const allowed = ALLOWED_TRANSITIONS[current]
  if (!allowed.includes(next)) {
    throw new Error(
      `Transición no permitida: "${current}" → "${next}". ` +
      `Permitidas: ${allowed.length ? allowed.join(', ') : 'ninguna (estado terminal)'}`,
    )
  }
}

// ─── Implementación ───────────────────────────────────────────────────────────

export class MockAdoptionService implements IAdoptionService {

  // ── submit ──────────────────────────────────────────────────────────────────

  async submit(payload: SubmitAdoptionPayload, adoptanteId: string): Promise<AdoptionRequest> {
    await delay(500, 800)

    const dog = getDogById(payload.perroId)

    // A1 — Verificar que el perro esté disponible antes de crear la solicitud
    const liveDog = await dogService.getDogById(payload.perroId)
    if (liveDog && liveDog.estado !== 'disponible') {
      throw new Error('Este perro ya no está disponible para adopción')
    }

    const now = new Date().toISOString()
    const newRequest: AdoptionRequest = {
      id:          String(_nextId++),
      adoptanteId,
      perroId:     payload.perroId,
      refugioId:   payload.refugioId,
      fecha:       now.slice(0, 10),        // YYYY-MM-DD
      estado:      'pending',
      comentarios: payload.comentarios,
      formulario:  payload.formulario,
      historial:   [
        {
          id:             _nextChangeId++,
          solicitudId:    String(_nextId - 1),
          estadoAnterior: 'pending',
          estadoNuevo:    'pending',
          cambiadoPor:    adoptanteId,
          rol:            'shelter',
          comentario:     'Solicitud enviada por el adoptante.',
          fecha:          now,
        },
      ],
      // Datos enriquecidos del perro (join simulado)
      perroNombre:   dog?.nombre,
      perroFoto:     dog?.foto,
      perroSlug:     dog ? dog.nombre.toLowerCase().replace(/\s+/g, '-') : undefined,
      refugioNombre: dog?.refugioNombre,
    }

    _requests = [newRequest, ..._requests]

    // A1 — Actualizar estado del perro a "en_proceso" tras crear la solicitud
    await dogService.updateDog(payload.perroId, { estado: 'en_proceso' })

    return newRequest
  }

  // ── getMyRequests ────────────────────────────────────────────────────────────

  async getMyRequests(adoptanteId: string): Promise<AdoptionRequestListItem[]> {
    await delay(200, 400)

    // Busca en la copia mutable (incluye nuevas solicitudes del submit)
    const own = _requests.filter((r) => r.adoptanteId === adoptanteId)

    // Fallback al mock estático si aún no se ha cargado nada en memoria
    const base = own.length ? own : getRequestsByAdoptante(adoptanteId)

    // Ordena por fecha descendente (más reciente primero)
    return base
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map(toListItem)
  }

  // ── getById ──────────────────────────────────────────────────────────────────

  async getById(id: string, adoptanteId?: string): Promise<AdoptionRequest | null> {
    await delay(150, 300)

    const req =
      _requests.find((r) => r.id === id) ??
      sharedGetById(id) ??
      null

    // D1 — Validar ownership si se proporciona adoptanteId
    if (req && adoptanteId !== undefined && req.adoptanteId !== adoptanteId) {
      return null
    }

    return req
  }

  // ── updateStatus ─────────────────────────────────────────────────────────────

  async updateStatus(
    id:          string,
    newStatus:   RequestStatus,
    comentario?: string,
    changedById = '',       // userId del shelter/admin que cambia el estado
  ): Promise<AdoptionRequest> {
    await delay(300, 500)

    const idx = _requests.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Solicitud ${id} no encontrada`)

    const req = _requests[idx]

    // Valida transición
    assertTransition(req.estado, newStatus)

    const now = new Date().toISOString()

    const updated: AdoptionRequest = {
      ...req,
      estado: newStatus,
      historial: [
        ...req.historial,
        {
          id:             _nextChangeId++,
          solicitudId:    id,
          estadoAnterior: req.estado,
          estadoNuevo:    newStatus,
          cambiadoPor:    changedById,
          rol:            'shelter',
          comentario,
          fecha:          now,
        },
      ],
    }

    _requests = _requests.map((r) => (r.id === id ? updated : r))

    // A2 — Actualizar estado del perro según la resolución de la solicitud
    if (newStatus === 'approved') {
      await dogService.updateDog(req.perroId, { estado: 'adoptado' })
    } else if (newStatus === 'rejected' || newStatus === 'cancelled') {
      await dogService.updateDog(req.perroId, { estado: 'disponible' })
    }

    return updated
  }

  // ── cancel (acción del adoptante) ────────────────────────────────────────────

  // D2 — adoptanteId es requerido; no se admite default 0
  async cancel(id: string, adoptanteId: string, motivo?: string): Promise<AdoptionRequest> {
    await delay(300, 500)

    const req = _requests.find((r) => r.id === id)
    if (!req) throw new Error(`Solicitud ${id} no encontrada`)

    // D2 — Validar ownership siempre
    if (req.adoptanteId !== adoptanteId) {
      throw new Error('No tienes permiso para cancelar esta solicitud')
    }

    return this.updateStatus(id, 'cancelled', motivo ?? 'Cancelada por el adoptante', adoptanteId)
  }
}
