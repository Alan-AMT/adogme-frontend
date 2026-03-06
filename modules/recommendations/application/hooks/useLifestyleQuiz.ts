// modules/recommendations/application/hooks/useLifestyleQuiz.ts
// Estado completo del quiz de estilo de vida.
//
// - Persiste el borrador en localStorage (clave quiz-draft-{userId})
// - Valida paso a paso antes de avanzar (canAdvance)
// - Al enviar: llama al mlService + guarda preferencias + limpia borrador
// - Devuelve MLRecommendationResponse — la vista redirige al resultado
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { mlService } from '../../infrastructure/MLServiceFactory'
import { profileService } from '@/modules/profile/infrastructure/ProfileServiceFactory'
import type {
  LifestyleQuizAnswers,
  MLRecommendationResponse,
} from '@/modules/shared/domain/LifestyleProfile'
import type { OnChangeQuiz } from '../../components/quiz-steps/types'

// ─── Constantes ───────────────────────────────────────────────────────────────

export const TOTAL_STEPS = 7

const DRAFT_KEY   = (id: number) => `quiz-draft-${id}`
const RESULTS_KEY = (id: number) => `ml-results-${id}`

/** Valores por defecto para campos no cubiertos en el quiz simplificado */
const DEFAULTS: LifestyleQuizAnswers = {
  actividadFisica:                    'moderado',
  horasEnCasaDiarias:                 10,
  horasLibresParaPerro:               2,
  tipoVivienda:                       'departamento',
  tieneJardin:                        false,
  tamanoEspacio:                      'mediano',
  experienciaPrevia:                  false,
  conviveConNinos:                    false,
  conviveConMascotas:                 false,
  tamanoPreferido:                    ['sin_preferencia'],
  energiaPreferida:                   'sin_preferencia',
  sexoPreferido:                      'sin_preferencia',
  edadPreferida:                      ['sin_preferencia'],
  presupuestoMensualMXN:              2000,
  disponibilidadEntrenamiento:        false,
  aceptaPerroConNecesidadesEspeciales: false,
}

/** horasEnCasaDiarias derivado de actividadFisica */
function deriveHorasEnCasa(actividad: LifestyleQuizAnswers['actividadFisica']): number {
  const map: Record<string, number> = {
    sedentario: 14, moderado: 10, activo: 8, muy_activo: 6,
  }
  return map[actividad] ?? 10
}

// ─── Validadores por paso (0-indexed) ────────────────────────────────────────
// Devuelven true si los campos requeridos del paso están respondidos.

const STEP_VALIDATORS: Array<(a: Partial<LifestyleQuizAnswers>) => boolean> = [
  // Paso 1 — Actividad
  a => a.actividadFisica !== undefined && a.horasLibresParaPerro !== undefined,
  // Paso 2 — Vivienda
  a => a.tipoVivienda !== undefined && a.tieneJardin !== undefined && a.tamanoEspacio !== undefined,
  // Paso 3 — Experiencia
  a => a.experienciaPrevia !== undefined,
  // Paso 4 — Convivencia
  a => a.conviveConNinos !== undefined && a.conviveConMascotas !== undefined,
  // Paso 5 — Tamaño preferido
  a => (a.tamanoPreferido?.length ?? 0) > 0,
  // Paso 6 — Perfil del perro
  a =>
    a.energiaPreferida !== undefined &&
    a.sexoPreferido    !== undefined &&
    (a.edadPreferida?.length ?? 0) > 0,
  // Paso 7 — Compromisos
  a =>
    a.presupuestoMensualMXN              !== undefined &&
    a.disponibilidadEntrenamiento        !== undefined &&
    a.aceptaPerroConNecesidadesEspeciales !== undefined,
]

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export type QuizDirection = 'forward' | 'back'

export interface UseLifestyleQuizReturn {
  // ── Estado ─────────────────────────────────────────────────────────────────
  currentStep:  number
  totalSteps:   number
  answers:      Partial<LifestyleQuizAnswers>
  direction:    QuizDirection
  isComplete:   boolean          // todos los 7 pasos válidos
  canAdvance:   boolean          // paso actual válido
  isSubmitting: boolean
  submitError:  string | null

  // ── Acciones ───────────────────────────────────────────────────────────────
  setAnswer:  OnChangeQuiz
  nextStep:   () => void
  prevStep:   () => void
  submitQuiz: () => Promise<MLRecommendationResponse | null>
  resetQuiz:  () => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLifestyleQuiz(): UseLifestyleQuizReturn {
  const { user } = useAuthStore()
  const userId   = user?.id ?? 0

  const [currentStep,  setCurrentStep]  = useState(0)
  const [direction,    setDirection]    = useState<QuizDirection>('forward')
  const [answers,      setAnswers]      = useState<Partial<LifestyleQuizAnswers>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError,  setSubmitError]  = useState<string | null>(null)

  // Ref para userIdactual sin causar dependencias en callbacks
  const userIdRef = useRef(userId)
  useEffect(() => { userIdRef.current = userId }, [userId])

  // ── Cargar borrador guardado al montar ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY(userId))
      if (raw) setAnswers(JSON.parse(raw) as Partial<LifestyleQuizAnswers>)
    } catch { /* noop */ }
  }, [userId])

  // ── setAnswer ───────────────────────────────────────────────────────────────
  const setAnswer: OnChangeQuiz = useCallback(
    <K extends keyof LifestyleQuizAnswers>(key: K, value: LifestyleQuizAnswers[K]) => {
      setAnswers(prev => {
        const updated = { ...prev, [key]: value }
        try {
          localStorage.setItem(DRAFT_KEY(userIdRef.current), JSON.stringify(updated))
        } catch { /* noop */ }
        return updated
      })
    },
    [],
  )

  // ── Navegación ──────────────────────────────────────────────────────────────
  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= TOTAL_STEPS - 1) return prev
      setDirection('forward')
      return prev + 1
    })
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev <= 0) return prev
      setDirection('back')
      return prev - 1
    })
  }, [])

  // ── submitQuiz ──────────────────────────────────────────────────────────────
  const submitQuiz = useCallback(async (): Promise<MLRecommendationResponse | null> => {
    if (!user) return null

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Completar campos derivados o ausentes con defaults
      const fullAnswers: LifestyleQuizAnswers = {
        ...DEFAULTS,
        ...answers,
        // derivar horasEnCasaDiarias si no está seteado explícitamente
        horasEnCasaDiarias: answers.horasEnCasaDiarias
          ?? deriveHorasEnCasa(answers.actividadFisica ?? 'moderado'),
      }

      const result = await mlService.generateRecommendations(user.id, fullAnswers)

      // Persistir resultado y preferencias; limpiar borrador
      try {
        localStorage.setItem(RESULTS_KEY(user.id), JSON.stringify(result))
        await profileService.saveLifestylePreferences(user.id, fullAnswers)
        localStorage.removeItem(DRAFT_KEY(user.id))
      } catch { /* noop — el resultado ya está en memoria */ }

      return result

    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al generar recomendaciones.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [user, answers])

  // ── resetQuiz ───────────────────────────────────────────────────────────────
  const resetQuiz = useCallback(() => {
    setAnswers({})
    setCurrentStep(0)
    setDirection('forward')
    setSubmitError(null)
    try { localStorage.removeItem(DRAFT_KEY(userIdRef.current)) } catch { /* noop */ }
  }, [])

  // ── Derivados ───────────────────────────────────────────────────────────────
  const canAdvance = STEP_VALIDATORS[currentStep]?.(answers) ?? false
  const isComplete = STEP_VALIDATORS.every(v => v(answers))

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    answers,
    direction,
    isComplete,
    canAdvance,
    isSubmitting,
    submitError,
    setAnswer,
    nextStep,
    prevStep,
    submitQuiz,
    resetQuiz,
  }
}
