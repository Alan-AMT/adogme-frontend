// modules/recommendations/application/hooks/useLifestyleQuiz.ts
// Estado del quiz de match.
//
// - Mantiene las respuestas del usuario en memoria (no persiste).
// - Valida bloque a bloque antes de avanzar (canAdvance).
// - Al enviar: mapea draft → payload (1-5) y llama al MLService.
'use client'

import { useState, useCallback } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { mlService } from '../../infrastructure/MLServiceFactory'
import { QUIZ_BLOCKS } from '@/modules/shared/domain/LifestyleProfile'
import type {
  QuizDraftState,
  MLRecommendationResponse,
} from '@/modules/shared/domain/LifestyleProfile'
import { mapDraftToPayload, isBlockComplete } from '../quizMapping'

// ─── Constantes ───────────────────────────────────────────────────────────────

export const TOTAL_STEPS = QUIZ_BLOCKS.length  // 4

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type QuizDirection = 'forward' | 'back'

export interface UseLifestyleQuizReturn {
  currentStep:  number
  totalSteps:   number
  draft:        QuizDraftState
  direction:    QuizDirection
  isComplete:   boolean
  canAdvance:   boolean
  isSubmitting: boolean
  submitError:  string | null

  setAnswer:  <K extends keyof QuizDraftState>(key: K, value: QuizDraftState[K]) => void
  nextStep:   () => void
  prevStep:   () => void
  submitQuiz: () => Promise<MLRecommendationResponse | null>
  resetQuiz:  () => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLifestyleQuiz(): UseLifestyleQuizReturn {
  const { user } = useAuthStore()

  const [currentStep,  setCurrentStep]  = useState(0)
  const [direction,    setDirection]    = useState<QuizDirection>('forward')
  const [draft,        setDraft]        = useState<QuizDraftState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError,  setSubmitError]  = useState<string | null>(null)

  // ── setAnswer ──────────────────────────────────────────────────────────────
  const setAnswer = useCallback(
    <K extends keyof QuizDraftState>(key: K, value: QuizDraftState[K]) => {
      setDraft(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  // ── Navegación ─────────────────────────────────────────────────────────────
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

  // ── submitQuiz ─────────────────────────────────────────────────────────────
  const submitQuiz = useCallback(async (): Promise<MLRecommendationResponse | null> => {
    if (!user) return null

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = mapDraftToPayload(draft)
      const result  = await mlService.generateRecommendations(user.id, payload)
      return result
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al generar recomendaciones.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [user, draft])

  // ── resetQuiz ──────────────────────────────────────────────────────────────
  const resetQuiz = useCallback(() => {
    setDraft({})
    setCurrentStep(0)
    setDirection('forward')
    setSubmitError(null)
  }, [])

  // ── Derivados ──────────────────────────────────────────────────────────────
  const canAdvance = isBlockComplete(currentStep, draft)
  const isComplete = QUIZ_BLOCKS.every((_, i) => isBlockComplete(i, draft))

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    draft,
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
