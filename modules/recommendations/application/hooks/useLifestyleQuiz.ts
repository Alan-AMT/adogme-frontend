// modules/recommendations/application/hooks/useLifestyleQuiz.ts
// Estado del quiz de match.
//
// - Persiste el borrador en localStorage (quiz-draft-{userId})
// - Valida bloque a bloque antes de avanzar (canAdvance)
// - Al enviar: mapea draft → payload (1-5) y llama al MLService
// - Persiste el resultado en localStorage para que /mi-match lo lea
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { mlService }    from '../../infrastructure/MLServiceFactory'
import { profileService } from '@/modules/profile/infrastructure/ProfileServiceFactory'
import { QUIZ_BLOCKS } from '@/modules/shared/domain/LifestyleProfile'
import type {
  QuizDraftState,
  MLRecommendationResponse,
} from '@/modules/shared/domain/LifestyleProfile'
import { mapDraftToPayload, isBlockComplete } from '../quizMapping'

// ─── Constantes ───────────────────────────────────────────────────────────────

export const TOTAL_STEPS = QUIZ_BLOCKS.length  // 4

const DRAFT_KEY   = (id: string | number) => `quiz-draft-${id}`
const RESULTS_KEY = (id: string | number) => `ml-results-${id}`

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
  const userId   = user?.id ?? ''

  const [currentStep,  setCurrentStep]  = useState(0)
  const [direction,    setDirection]    = useState<QuizDirection>('forward')
  const [draft,        setDraft]        = useState<QuizDraftState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError,  setSubmitError]  = useState<string | null>(null)

  const userIdRef = useRef(userId)
  useEffect(() => { userIdRef.current = userId }, [userId])

  // ── Cargar draft ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY(userId))
      if (raw) setDraft(JSON.parse(raw) as QuizDraftState)
    } catch { /* noop */ }
  }, [userId])

  // ── setAnswer ───────────────────────────────────────────────────────────────
  const setAnswer = useCallback(
    <K extends keyof QuizDraftState>(key: K, value: QuizDraftState[K]) => {
      setDraft(prev => {
        const updated = { ...prev, [key]: value }
        try {
          if (userIdRef.current) {
            localStorage.setItem(DRAFT_KEY(userIdRef.current), JSON.stringify(updated))
          }
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

  
  const submitQuiz = useCallback(async (): Promise<MLRecommendationResponse | null> => {
    if (!user) return null

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = mapDraftToPayload(draft)
      const result  = await mlService.generateRecommendations(user.id, payload)
      try {
        localStorage.setItem(RESULTS_KEY(user.id), JSON.stringify(result))
      } catch (e) {
        console.warn('[quiz] save results to localStorage failed (non-critical):', e)
      }

      // Estos no deben bloquear el flujo si fallan:
      profileService.saveLifestylePreferences(user.id, payload).catch(e => {
        console.warn('[quiz] saveLifestylePreferences failed (non-critical):', e)
      })
      try {
        localStorage.removeItem(DRAFT_KEY(user.id))
      } catch { /* noop */ }

      return result
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al generar recomendaciones.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [user, draft])

  // ── resetQuiz ───────────────────────────────────────────────────────────────
  const resetQuiz = useCallback(() => {
    setDraft({})
    setCurrentStep(0)
    setDirection('forward')
    setSubmitError(null)
    try {
      if (userIdRef.current) localStorage.removeItem(DRAFT_KEY(userIdRef.current))
    } catch { /* noop */ }
  }, [])

  // ── Derivados ───────────────────────────────────────────────────────────────
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
