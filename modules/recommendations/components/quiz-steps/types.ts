// modules/recommendations/components/quiz-steps/types.ts
// Tipos compartidos por todos los pasos del quiz

import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

export type OnChangeQuiz = <K extends keyof LifestyleQuizAnswers>(
  key: K,
  value: LifestyleQuizAnswers[K],
) => void

export interface StepProps {
  answers:  Partial<LifestyleQuizAnswers>
  onChange: OnChangeQuiz
}
