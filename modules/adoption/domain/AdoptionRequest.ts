// modules/adoption/domain/AdoptionRequest.ts
// Re-exporta los tipos compartidos y agrega FormDraft + StepValidation
// propios del módulo de adopción (frontend).

// ─── Re-exporta todo del dominio compartido ───────────────────────────────────

export type {
  RequestStatus,
  HousingType,
  HousingInfo,
  AdoptionFormData,
  StatusChange,
  AdoptionRequest,
  AdoptionRequestListItem,
} from '../../shared/domain/AdoptionRequest'

// ─── Draft del formulario en localStorage ─────────────────────────────────────
// Guardamos el borrador paso a paso para no perder datos si el usuario
// navega o recarga antes de enviar.

import type { AdoptionFormData } from '../../shared/domain/AdoptionRequest'

export interface FormDraft {
  perroId:   number
  perroSlug: string
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

// ─── Configuración de los pasos del formulario ────────────────────────────────

export interface StepConfig {
  id:       number    // índice 0-based
  label:    string    // etiqueta para el Stepper
  title:    string    // título del paso
  subtitle: string    // descripción breve
}

export const ADOPTION_STEPS: StepConfig[] = [
  { id: 0, label: 'Datos',        title: 'Tus datos personales',  subtitle: 'Verifica que tu información esté actualizada' },
  { id: 1, label: 'Vivienda',     title: 'Tu hogar',              subtitle: 'Cuéntanos sobre el espacio donde vivirá el perro' },
  { id: 2, label: 'Rutina',       title: 'Tu estilo de vida',     subtitle: 'Necesitamos entender tu día a día' },
  { id: 3, label: 'Experiencia',  title: 'Experiencia con perros',subtitle: '¿Has tenido mascotas antes?' },
  { id: 4, label: 'Compromisos',  title: 'Tus compromisos',       subtitle: 'Lee y acepta las condiciones de adopción' },
  { id: 5, label: 'Resumen',      title: 'Revisa tu solicitud',   subtitle: 'Confirma los datos antes de enviar' },
]

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
