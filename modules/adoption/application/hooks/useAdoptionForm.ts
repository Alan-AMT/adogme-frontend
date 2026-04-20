// modules/adoption/application/hooks/useAdoptionForm.ts
// Estado multi-paso + validación + draft persistido en localStorage
//
// Pasos (0-based, según ADOPTION_STEPS):
//   0 — Datos personales (readonly del authStore, sin campos en formData)
//   1 — Vivienda          (vivienda: HousingInfo)
//   2 — Rutina            (horasEnCasa, actividadFisica, conviveConNinos/Mascotas)
//   3 — Experiencia       (motivacion, experienciaPrevia, descripcionExperiencia?)
//   4 — Compromisos       (aceptaVisitaPrevia, aceptaTerminos, comentariosAdicionales?)
//   5 — Resumen           (review — sin campos nuevos)
'use client'

import { useState, useEffect } from 'react'
import type { AdoptionFormData, AdoptionRequest } from '../../../shared/domain/AdoptionRequest'
import { adoptionService } from '../../infrastructure/AdoptionServiceFactory'
import { useAuthStore } from '../../../shared/infrastructure/store/authStore'
import type { FormDraft } from '../../domain/AdoptionRequest'
import { ADOPTION_STEPS } from '../../domain/AdoptionRequest'

// ─── Tipos expuestos ──────────────────────────────────────────────────────────

export interface UseAdoptionFormOptions {
  perroId:     string
  perroSlug:   string
  perroNombre: string
  refugioId:   string
}

export interface UseAdoptionFormState {
  currentStep:      number
  formData:         Partial<AdoptionFormData>
  errors:           Record<string, string>
  isSubmitting:     boolean
  savedAt:          string | null       // ISO — para mostrar «guardado hace X min»
  submittedRequest: AdoptionRequest | null  // seteado al enviar con éxito
}

export interface UseAdoptionFormActions {
  nextStep:    () => void
  prevStep:    () => void
  updateField: <K extends keyof AdoptionFormData>(key: K, value: AdoptionFormData[K]) => void
  submitForm:  () => Promise<void>
  resetForm:   () => void
}

export type UseAdoptionFormReturn = UseAdoptionFormState & UseAdoptionFormActions

// ─── Constantes ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = ADOPTION_STEPS.length  // 6

// ─── Validación por paso ──────────────────────────────────────────────────────

function validateStep(step: number, data: Partial<AdoptionFormData>): Record<string, string> {
  const e: Record<string, string> = {}

  switch (step) {
    case 0:  // Datos personales — sólo lectura, sin campos en formData
      break

    case 1:  // Vivienda
      if (!data.vivienda?.tipo)
        e['vivienda.tipo'] = 'Selecciona el tipo de vivienda.'
      if (data.vivienda?.esPropietario === false && data.vivienda?.permiteAnimales === undefined)
        e['vivienda.permiteAnimales'] = 'Indica si tu arrendador permite animales.'
      break

    case 2:  // Rutina
      if (!data.horasEnCasa || data.horasEnCasa < 1)
        e.horasEnCasa = 'Indica cuántas horas estás en casa (mínimo 1).'
      if (!data.actividadFisica)
        e.actividadFisica = 'Selecciona tu nivel de actividad física.'
      if (data.conviveConNinos === undefined)
        e.conviveConNinos = 'Indica si hay niños en el hogar.'
      if (data.conviveConMascotas === undefined)
        e.conviveConMascotas = 'Indica si convives con otras mascotas.'
      break

    case 3:  // Experiencia
      if (!data.motivacion?.trim())
        e.motivacion = 'Cuéntanos por qué quieres adoptar a este perro.'
      if (data.experienciaPrevia === undefined)
        e.experienciaPrevia = 'Indica si has tenido mascotas anteriormente.'
      break

    case 4:  // Compromisos
      if (!data.aceptaVisitaPrevia)
        e.aceptaVisitaPrevia = 'Debes aceptar la visita previa al hogar.'
      if (!data.aceptaTerminos)
        e.aceptaTerminos = 'Debes aceptar los términos y condiciones de adopción.'
      break

    case 5:  // Resumen — sin campos nuevos
      break
  }

  return e
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdoptionForm({
  perroId,
  perroSlug,
  perroNombre,
  refugioId,
}: UseAdoptionFormOptions): UseAdoptionFormReturn {

  const user     = useAuthStore(s => s.user)
  const draftKey = `adoption-draft-${perroId}`

  // ── Estado ────────────────────────────────────────────────────────────────

  const [currentStep,      setCurrentStep]      = useState(0)
  const [formData,         setFormData]         = useState<Partial<AdoptionFormData>>({})
  const [errors,           setErrors]           = useState<Record<string, string>>({})
  const [isSubmitting,     setIsSubmitting]     = useState(false)
  const [savedAt,          setSavedAt]          = useState<string | null>(null)
  const [submittedRequest, setSubmittedRequest] = useState<AdoptionRequest | null>(null)

  // ── Carga el draft guardado al montar ─────────────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(draftKey)
      if (!raw) return
      const draft: FormDraft = JSON.parse(raw)
      if (draft.perroId === perroId) {
        setFormData(draft.data)
        setCurrentStep(draft.step)
        setSavedAt(draft.savedAt)
      }
    } catch {
      // Draft corrupto o inválido — ignorar silenciosamente
    }
  }, [draftKey, perroId])

  // ── Helpers de persistencia ───────────────────────────────────────────────

  function persist(step: number, data: Partial<AdoptionFormData>): void {
    if (typeof window === 'undefined') return
    const now   = new Date().toISOString()
    const draft: FormDraft = { perroId, perroSlug, perroNombre, step, data, savedAt: now }
    localStorage.setItem(draftKey, JSON.stringify(draft))
    setSavedAt(now)
  }

  function purgeDraft(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(draftKey)
    setSavedAt(null)
  }

  // ── updateField ───────────────────────────────────────────────────────────
  // Actualiza un campo del formulario, persiste el draft y limpia su error.

  function updateField<K extends keyof AdoptionFormData>(
    key: K,
    value: AdoptionFormData[K],
  ): void {
    const next = { ...formData, [key]: value }
    setFormData(next)
    persist(currentStep, next)

    // Limpia el error del campo si existía
    const k = key as string
    if (k in errors) {
      setErrors(prev => {
        const copy = { ...prev }
        delete (copy as Record<string, string>)[k]
        return copy
      })
    }
  }

  // ── nextStep ──────────────────────────────────────────────────────────────
  // Valida el paso actual antes de avanzar.

  function nextStep(): void {
    const errs = validateStep(currentStep, formData)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    const next = Math.min(currentStep + 1, TOTAL_STEPS - 1)
    setCurrentStep(next)
    persist(next, formData)
  }

  // ── prevStep ──────────────────────────────────────────────────────────────

  function prevStep(): void {
    setErrors({})
    setCurrentStep(s => Math.max(s - 1, 0))
  }

  // ── submitForm ────────────────────────────────────────────────────────────
  // Valida compromisos (paso 4) y envía la solicitud.
  // Si el servicio responde OK, limpia el draft y redirige.

  async function submitForm(): Promise<void> {
    // Valida paso 4 (compromisos) aunque estemos en el resumen (paso 5)
    const errs = validateStep(4, formData)
    if (Object.keys(errs).length) {
      setErrors(errs)
      setCurrentStep(4)
      return
    }

    if (!user) {
      setErrors({ _form: 'Debes iniciar sesión para enviar la solicitud.' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const request = await adoptionService.submit(
        {
          perroId,
          refugioId,
          comentarios: formData.comentariosAdicionales ?? '',
          formulario:  formData as AdoptionFormData,
        },
        user.id,
      )
      purgeDraft()
      setSubmittedRequest(request)
    } catch (err) {
      setErrors({
        _form: err instanceof Error ? err.message : 'Error al enviar la solicitud.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── resetForm ─────────────────────────────────────────────────────────────

  function resetForm(): void {
    purgeDraft()
    setFormData({})
    setCurrentStep(0)
    setErrors({})
  }

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    savedAt,
    submittedRequest,
    nextStep,
    prevStep,
    updateField,
    submitForm,
    resetForm,
  }
}
