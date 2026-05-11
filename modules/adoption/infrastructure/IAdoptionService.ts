// modules/adoption/infrastructure/IAdoptionService.ts
// Contrato del servicio de adopciones — implementado por Mock y Api.

import type {
  AdoptionRequest,
  AdoptionRequestListItem,
  AdoptionFormData,
  PaginatedResult,
  RequestStatus,
} from "../../shared/domain/AdoptionRequest";

// ─── Resultado del check de existencia de solicitud ───────────────────────────

export interface ExistingApplicationCheck {
  exists: boolean;
  applicationId?: string;
}

// ─── Payload para crear una solicitud ─────────────────────────────────────────

export interface SubmitAdoptionPayload {
  perroId: string;
  refugioId: string;
  perroNombre: string;
  perroRaza: string;
  perroFoto: string | null;
  refugioNombre: string;
  refugioLogo: string | null;
  dogVector: [number, number, number, number] | null;
  userVector: [number, number, number, number] | null;
  formulario: AdoptionFormData;
}

// ─── Interfaz ─────────────────────────────────────────────────────────────────

export interface IAdoptionService {
  /**
   * Envía una nueva solicitud de adopción.
   * El userId se obtiene del authStore dentro de la implementación.
   */
  submit(
    payload: SubmitAdoptionPayload,
    adoptanteId: string,
  ): Promise<AdoptionRequest>;

  /**
   * Lista todas las solicitudes del adoptante autenticado.
   * Filtradas por userId del authStore.
   */
  getMyRequests(
    adoptanteId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<AdoptionRequestListItem>>;

  /**
   * Detalle completo de una solicitud (con historial).
   * Devuelve null si no existe. Si se pasa adoptanteId, valida ownership.
   * D1 — el servicio debe rechazar accesos de otros adoptantes.
   */
  getById(id: string): Promise<AdoptionRequest | null>;

  /**
   * Cancela una solicitud (acción del adoptante).
   * Alias de updateStatus(..., 'cancelled') con validación de rol.
   * D2 — adoptanteId es obligatorio para validar ownership.
   */
  cancel(id: string, applicantId: string): Promise<AdoptionRequest>;

  /**
   * Verifica si el applicant ya tiene una solicitud activa para este perro.
   * Se usa al entrar al formulario para evitar duplicados.
   */
  checkNotExistingRequest(
    dogId: string,
    applicantId: string,
  ): Promise<ExistingApplicationCheck>;

  /**
   * Devuelve el formData de la solicitud más reciente del applicant — para
   * prefill al iniciar una nueva. El shape puede ser de una versión vieja del
   * formulario; el caller debe sanitizar antes de aplicar al form.
   * Devuelve null si no hay solicitud previa.
   */
  getRecentFormData(
    applicantId: string,
  ): Promise<Partial<AdoptionFormData> | null>;
}
