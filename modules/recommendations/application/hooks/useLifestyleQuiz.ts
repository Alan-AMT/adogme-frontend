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
// 4 pasos — uno por categoría del ML (5 preguntas cada uno)

export const TOTAL_STEPS = 4

const DRAFT_KEY   = (id: number) => `quiz-draft-${id}`
const RESULTS_KEY = (id: number) => `ml-results-${id}`

/** Valor neutro (3) para todas las preguntas al iniciar */
const DEFAULTS: LifestyleQuizAnswers = {
  q1: 3, q2: 3, q3: 3, q4: 3, q5: 3,   // actividad
  q6: 3, q7: 3, q8: 3, q9: 3, q10: 3,  // hogar
  q11: 3, q12: 3, q13: 3, q14: 3, q15: 3, // experiencia
  q16: 3, q17: 3, q18: 3, q19: 3, q20: 3, // recursos
}

// ─── Validadores por paso (0-indexed) ────────────────────────────────────────
// Paso válido si todas sus 5 preguntas tienen respuesta (valor 1-5).

const isAnswered = (v: unknown): boolean =>
  v !== undefined && v !== null && (v as number) >= 1 && (v as number) <= 5

const STEP_VALIDATORS: Array<(a: Partial<LifestyleQuizAnswers>) => boolean> = [
  // Paso 0 — Actividad (q1-q5)
  a => [a.q1, a.q2, a.q3, a.q4, a.q5].every(isAnswered),
  // Paso 1 — Hogar (q6-q10)
  a => [a.q6, a.q7, a.q8, a.q9, a.q10].every(isAnswered),
  // Paso 2 — Experiencia (q11-q15)
  a => [a.q11, a.q12, a.q13, a.q14, a.q15].every(isAnswered),
  // Paso 3 — Recursos y cuidados (q16-q20)
  a => [a.q16, a.q17, a.q18, a.q19, a.q20].every(isAnswered),
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
      // Completar con defaults (valor neutro 3) para preguntas no respondidas
      const fullAnswers: LifestyleQuizAnswers = { ...DEFAULTS, ...answers }

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
