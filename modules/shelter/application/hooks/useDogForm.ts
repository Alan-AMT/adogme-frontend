// modules/shelter/application/hooks/useDogForm.ts
// Archivo 176 — Estado multi-paso del formulario de perro.
//
// Modos:
//   Crear  → useDogForm()           — draft key = "shelter-dog-form-new"
//   Editar → useDogForm(dogId)      — pre-rellena desde servicio, draft key = "shelter-dog-form-{id}"
//
// Pasos (0-based):
//   0 Datos básicos   · 1 Personalidad  · 2 Cuidados
//   3 Salud           · 4 Fotos         · 5 Revisión
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { DogSize, DogSex, EnergyLevel, PersonalityTag, Vaccination } from '@/modules/shared/domain/Dog'
import type { DogCreateData, DogUpdateData } from '../../infrastructure/IShelterService'
import { shelterService }        from '../../infrastructure/ShelterServiceFactory'
import { mediaValidationService } from '../../infrastructure/MockMediaValidationService'
import type { ValidationResult } from '../../infrastructure/MockMediaValidationService'

const CURRENT_SHELTER_ID = 1

// ─── Definición de pasos ──────────────────────────────────────────────────────

export const DOG_FORM_STEPS = [
  { id: 0, label: 'Datos básicos' },
  { id: 1, label: 'Personalidad' },
  { id: 2, label: 'Cuidados' },
  { id: 3, label: 'Salud' },
  { id: 4, label: 'Fotos' },
  { id: 5, label: 'Revisión' },
] as const

export type DogFormStep = typeof DOG_FORM_STEPS[number]['id']

// ─── Tipo del formulario ──────────────────────────────────────────────────────
// Incluye todos los campos editables por el refugio (espejo de DogCreateData sin refugioId)

export interface DogFormData {
  // Step 0 — Datos básicos
  nombre:       string
  edad:         number
  raza:         string
  tamano:       DogSize | ''
  sexo:         DogSex  | ''
  nivelEnergia: EnergyLevel | ''
  descripcion:  string

  // Step 1 — Personalidad
  personalidad: PersonalityTag[]
  aptoNinos:    boolean
  aptoPerros:   boolean
  aptoGatos:    boolean

  // Step 2 — Cuidados
  castrado:      boolean
  microchip:     boolean
  necesitaJardin: boolean
  pesoKg:        number | undefined

  // Step 3 — Salud
  salud:   string
  vacunas: Vaccination[]

  // Step 4 — Fotos
  foto:  string        // URL principal
  fotos: string[]      // galería completa
}

const FORM_DEFAULTS: DogFormData = {
  nombre: '', edad: 0, raza: '', tamano: '', sexo: '', nivelEnergia: '', descripcion: '',
  personalidad: [], aptoNinos: false, aptoPerros: false, aptoGatos: false,
  castrado: false, microchip: false, necesitaJardin: false, pesoKg: undefined,
  salud: '', vacunas: [],
  foto: '', fotos: [],
}

// ─── Resultado por imagen validada ────────────────────────────────────────────

export interface MediaValidationResult extends ValidationResult {
  fileIndex: number
  fileName:  string
}

// ─── Validadores por paso ────────────────────────────────────────────────────

function validateStep(step: number, data: DogFormData): Record<string, string> {
  const e: Record<string, string> = {}
  if (step === 0) {
    if (!data.nombre.trim())   e.nombre       = 'El nombre es requerido'
    if (!data.raza.trim())     e.raza         = 'La raza es requerida'
    if (!data.edad || data.edad <= 0) e.edad  = 'Ingresa la edad en meses'
    if (!data.tamano)          e.tamano       = 'Selecciona el tamaño'
    if (!data.sexo)            e.sexo         = 'Selecciona el sexo'
    if (!data.nivelEnergia)    e.nivelEnergia = 'Selecciona el nivel de energía'
    if (!data.descripcion.trim()) e.descripcion = 'Agrega una descripción'
  }
  if (step === 4) {
    if (!data.foto.trim()) e.foto = 'Debes agregar al menos una foto principal'
  }
  return e
}

// ─── Persistencia localStorage ────────────────────────────────────────────────

function draftKey(dogId: number | undefined) {
  return `shelter-dog-form-${dogId ?? 'new'}`
}

function loadDraft(dogId: number | undefined): DogFormData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(draftKey(dogId))
    return raw ? (JSON.parse(raw) as DogFormData) : null
  } catch { return null }
}

function saveDraftToStorage(dogId: number | undefined, data: DogFormData) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(draftKey(dogId), JSON.stringify(data)) } catch { /* ignore */ }
}

function removeDraft(dogId: number | undefined) {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(draftKey(dogId)) } catch { /* ignore */ }
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export interface UseDogFormReturn {
  // Estado
  currentStep:            DogFormStep
  formData:               DogFormData
  errors:                 Record<string, string>
  mediaValidationResults: MediaValidationResult[]
  isDraft:                boolean
  isSubmitting:           boolean
  isValidatingMedia:      boolean
  submitError:            string | null

  // Acciones de navegación
  nextStep:  () => boolean            // retorna false si hay errores de validación
  prevStep:  () => void
  goToStep:  (step: DogFormStep) => void

  // Acciones de datos
  update:     <K extends keyof DogFormData>(field: K, value: DogFormData[K]) => void
  updateMany: (partial: Partial<DogFormData>) => void
  saveDraft:  () => void
  clearDraft: () => void

  // Media
  validateMedia: (files: File[]) => Promise<void>

  // Submit
  submit: () => Promise<void>
}

export function useDogForm(dogId?: number): UseDogFormReturn {
  const [currentStep, setCurrentStep]   = useState<DogFormStep>(0)
  const [formData,    setFormData]      = useState<DogFormData>(FORM_DEFAULTS)
  const [errors,      setErrors]        = useState<Record<string, string>>({})
  const [mediaVR,     setMediaVR]       = useState<MediaValidationResult[]>([])
  const [isDraft,     setIsDraft]       = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [submitError,  setSubmitError]  = useState<string | null>(null)

  const initializedRef = useRef(false)

  // ── Inicialización ───────────────────────────────────────────────────────────
  // 1. Si hay draft en localStorage → usarlo
  // 2. Si es modo edición y no hay draft → cargar desde el servicio

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const draft = loadDraft(dogId)
    if (draft) {
      setFormData(draft)
      setIsDraft(true)
      return
    }

    if (dogId) {
      shelterService.getDogById(dogId).then(dog => {
        if (!dog) return
        setFormData({
          nombre:        dog.nombre,
          edad:          dog.edad,
          raza:          dog.raza,
          tamano:        dog.tamano,
          sexo:          dog.sexo,
          nivelEnergia:  dog.nivelEnergia,
          descripcion:   dog.descripcion,
          personalidad:  dog.personalidad  ?? [],
          aptoNinos:     dog.aptoNinos,
          aptoPerros:    dog.aptoPerros,
          aptoGatos:     dog.aptoGatos,
          castrado:      dog.castrado,
          microchip:     dog.microchip,
          necesitaJardin: dog.necesitaJardin,
          pesoKg:        dog.pesoKg,
          salud:         dog.salud,
          vacunas:       dog.vacunas        ?? [],
          foto:          dog.foto,
          fotos:         dog.fotos          ?? [dog.foto],
        })
      }).catch(() => { /* silencioso: usa defaults */ })
    }
  }, [dogId])

  // ── Actualizar un campo ───────────────────────────────────────────────────────

  const update = useCallback(<K extends keyof DogFormData>(field: K, value: DogFormData[K]) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value }
      // Auto-guardar draft al modificar (silencioso)
      saveDraftToStorage(dogId, next)
      setIsDraft(true)
      return next
    })
    // Limpiar error del campo cuando el usuario lo modifica
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }, [dogId])

  const updateMany = useCallback((partial: Partial<DogFormData>) => {
    setFormData(prev => {
      const next = { ...prev, ...partial }
      saveDraftToStorage(dogId, next)
      setIsDraft(true)
      return next
    })
  }, [dogId])

  // ── Navegación ────────────────────────────────────────────────────────────────

  const nextStep = useCallback((): boolean => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return false
    }
    setErrors({})
    if (currentStep < DOG_FORM_STEPS.length - 1) {
      setCurrentStep(prev => (prev + 1) as DogFormStep)
    }
    return true
  }, [currentStep, formData])

  const prevStep = useCallback(() => {
    setErrors({})
    if (currentStep > 0) setCurrentStep(prev => (prev - 1) as DogFormStep)
  }, [currentStep])

  const goToStep = useCallback((step: DogFormStep) => {
    setErrors({})
    setCurrentStep(step)
  }, [])

  // ── Draft ────────────────────────────────────────────────────────────────────

  const saveDraft = useCallback(() => {
    saveDraftToStorage(dogId, formData)
    setIsDraft(true)
  }, [dogId, formData])

  const clearDraft = useCallback(() => {
    removeDraft(dogId)
    setIsDraft(false)
    setFormData(FORM_DEFAULTS)
    setCurrentStep(0)
    setErrors({})
    setMediaVR([])
  }, [dogId])

  // ── Validación de media ──────────────────────────────────────────────────────

  const validateMedia = useCallback(async (files: File[]) => {
    if (files.length === 0) return
    setIsValidating(true)
    setMediaVR([])
    try {
      const results = await Promise.all(
        files.map(async (file, i) => {
          const res = await mediaValidationService.validate(file)
          return { ...res, fileIndex: i, fileName: file.name } satisfies MediaValidationResult
        })
      )
      setMediaVR(results)
    } finally {
      setIsValidating(false)
    }
  }, [])

  // ── Submit ───────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    // Validar paso 0 (básicos) y paso 4 (fotos) como mínimo
    const step0Errors = validateStep(0, formData)
    const step4Errors = validateStep(4, formData)
    const allErrors   = { ...step0Errors, ...step4Errors }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      // Llevar al primer paso con error
      if (Object.keys(step0Errors).length > 0) setCurrentStep(0)
      else setCurrentStep(4)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (dogId) {
        // Modo edición
        const updateData: DogUpdateData = {
          nombre:        formData.nombre,
          edad:          formData.edad,
          raza:          formData.raza,
          tamano:        formData.tamano  || undefined,
          sexo:          formData.sexo    || undefined,
          nivelEnergia:  formData.nivelEnergia || undefined,
          descripcion:   formData.descripcion,
          foto:          formData.foto,
          fotos:         formData.fotos,
          salud:         formData.salud,
          personalidad:  formData.personalidad,
          aptoNinos:     formData.aptoNinos,
          aptoPerros:    formData.aptoPerros,
          aptoGatos:     formData.aptoGatos,
          castrado:      formData.castrado,
          microchip:     formData.microchip,
          necesitaJardin: formData.necesitaJardin,
          pesoKg:        formData.pesoKg,
          vacunas:       formData.vacunas,
        }
        await shelterService.updateDog(dogId, updateData)
      } else {
        // Modo crear — los campos vacíos no son posibles aquí por la validación
        const createData: DogCreateData = {
          refugioId:     CURRENT_SHELTER_ID,
          nombre:        formData.nombre,
          edad:          formData.edad,
          raza:          formData.raza,
          tamano:        formData.tamano  as DogSize,
          sexo:          formData.sexo    as DogSex,
          nivelEnergia:  formData.nivelEnergia as EnergyLevel,
          descripcion:   formData.descripcion,
          foto:          formData.foto,
          fotos:         formData.fotos,
          salud:         formData.salud,
          personalidad:  formData.personalidad,
          aptoNinos:     formData.aptoNinos,
          aptoPerros:    formData.aptoPerros,
          aptoGatos:     formData.aptoGatos,
          castrado:      formData.castrado,
          microchip:     formData.microchip,
          necesitaJardin: formData.necesitaJardin,
          pesoKg:        formData.pesoKg,
          vacunas:       formData.vacunas,
        }
        await shelterService.createDog(createData)
      }

      // Limpiar draft tras submit exitoso
      removeDraft(dogId)
      setIsDraft(false)
    } catch (e: unknown) {
      setSubmitError((e as Error).message ?? 'Error al guardar el perro')
      throw e
    } finally {
      setIsSubmitting(false)
    }
  }, [dogId, formData])

  return {
    currentStep,
    formData,
    errors,
    mediaValidationResults: mediaVR,
    isDraft,
    isSubmitting,
    isValidatingMedia: isValidating,
    submitError,
    nextStep,
    prevStep,
    goToStep,
    update,
    updateMany,
    saveDraft,
    clearDraft,
    validateMedia,
    submit,
  }
}
