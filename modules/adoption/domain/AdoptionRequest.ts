// modules/adoption/domain/AdoptionRequest.ts
// Re-exporta los tipos compartidos y agrega FormDraft + StepValidation
// propios del módulo de adopción (frontend).

// ─── Re-exporta todo del dominio compartido ───────────────────────────────────

export type {
  RequestStatus,
  HousingType,
  Tenencia,
  LugarDormir,
  ActividadFisica,
  ActividadConPerro,
  HousingInfo,
  EntornoHogar,
  RutinaInfo,
  MascotasActuales,
  ExperienciaPrevia,
  AdoptionFormData,
  AdoptionStepId,
  StatusChange,
  AdoptionRequest,
  AdoptionRequestListItem,
} from '../../shared/domain/AdoptionRequest'

export { ADOPTION_STEPS } from '../../shared/domain/AdoptionRequest'

// ─── Draft del formulario en localStorage ─────────────────────────────────────
// Guardamos el borrador paso a paso para no perder datos si el usuario
// navega o recarga antes de enviar.

import type { AdoptionFormData } from '../../shared/domain/AdoptionRequest'

export interface FormDraft {
  perroId:   string
  perroNombre: string
  step:      number          // último paso completado (0-based)
  data:      Partial<AdoptionFormData>
  savedAt:   string          // ISO datetime — para mostrar "guardado hace X"
}

// ─── Validación por paso ───────────────────────────────────────────────────────

export interface StepValidation {
  isValid:  boolean
  errors:   Record<string, string>   // campo → mensaje de error
}

// ─── Transiciones de estado permitidas ────────────────────────────────────────
// Mapa: estado actual → estados a los que puede transicionar
// Usado por el mock y validación del backend.

import type { RequestStatus } from '../../shared/domain/AdoptionRequest'

export const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  pending:   ['in_review', 'rejected', 'cancelled'],
  in_review: ['approved', 'rejected', 'cancelled'],
  approved:  [],                    // terminal — ya no cambia
  rejected:  [],                    // terminal
  cancelled: [],                    // terminal
}
