// modules/adoption/infrastructure/IAdoptionService.ts
// Contrato del servicio de adopciones — implementado por Mock y Api.

import type {
  AdoptionRequest,
  AdoptionRequestListItem,
  AdoptionFormData,
  RequestStatus,
} from '../../shared/domain/AdoptionRequest'

// ─── Payload para crear una solicitud ─────────────────────────────────────────

export interface SubmitAdoptionPayload {
  perroId:     number
  refugioId:   number
  comentarios: string
  formulario:  AdoptionFormData
}

// ─── Interfaz ─────────────────────────────────────────────────────────────────

export interface IAdoptionService {

  /**
   * Envía una nueva solicitud de adopción.
   * El userId se obtiene del authStore dentro de la implementación.
   */
  submit(payload: SubmitAdoptionPayload, adoptanteId: number): Promise<AdoptionRequest>

  /**
   * Lista todas las solicitudes del adoptante autenticado.
   * Filtradas por userId del authStore.
   */
  getMyRequests(adoptanteId: number): Promise<AdoptionRequestListItem[]>

  /**
   * Detalle completo de una solicitud (con historial).
   * Devuelve null si no existe. Si se pasa adoptanteId, valida ownership.
   * D1 — el servicio debe rechazar accesos de otros adoptantes.
   */
  getById(id: number, adoptanteId?: number): Promise<AdoptionRequest | null>

  /**
   * Cambia el estado de una solicitud.
   * Valida que la transición sea permitida (ALLOWED_TRANSITIONS).
   * Solo shelter/admin pueden llamar esto; el adoptante solo puede cancelar.
   */
  updateStatus(
    id:         number,
    newStatus:  RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest>

  /**
   * Cancela una solicitud (acción del adoptante).
   * Alias de updateStatus(..., 'cancelled') con validación de rol.
   * D2 — adoptanteId es obligatorio para validar ownership.
   */
  cancel(id: number, adoptanteId: number, motivo?: string): Promise<AdoptionRequest>
}
