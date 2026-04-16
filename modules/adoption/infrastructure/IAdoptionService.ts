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
  perroId:     string
  refugioId:   string
  comentarios: string
  formulario:  AdoptionFormData
}

// ─── Interfaz ─────────────────────────────────────────────────────────────────

export interface IAdoptionService {

  /**
   * Envía una nueva solicitud de adopción.
   * El userId se obtiene del authStore dentro de la implementación.
   */
  submit(payload: SubmitAdoptionPayload, adoptanteId: string): Promise<AdoptionRequest>

  /**
   * Lista todas las solicitudes del adoptante autenticado.
   * Filtradas por userId del authStore.
   */
  getMyRequests(adoptanteId: string): Promise<AdoptionRequestListItem[]>

  /**
   * Detalle completo de una solicitud (con historial).
   * Devuelve null si no existe. Si se pasa adoptanteId, valida ownership.
   * D1 — el servicio debe rechazar accesos de otros adoptantes.
   */
  getById(id: string, adoptanteId?: string): Promise<AdoptionRequest | null>

  /**
   * Cambia el estado de una solicitud.
   * Valida que la transición sea permitida (ALLOWED_TRANSITIONS).
   * Solo shelter/admin pueden llamar esto; el adoptante solo puede cancelar.
   */
  updateStatus(
    id:         string,
    newStatus:  RequestStatus,
    comentario?: string,
  ): Promise<AdoptionRequest>

  /**
   * Cancela una solicitud (acción del adoptante).
   * Alias de updateStatus(..., 'cancelled') con validación de rol.
   * D2 — adoptanteId es obligatorio para validar ownership.
   */
  cancel(id: string, adoptanteId: string, motivo?: string): Promise<AdoptionRequest>
}
