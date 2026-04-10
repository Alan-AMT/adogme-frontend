// modules/recommendations/components/quiz-steps/ScaleQuestion.tsx
// Componente reutilizable: una pregunta con escala 1-5
'use client'

import type { QuizScale } from '@/modules/shared/domain/LifestyleProfile'

interface ScaleQuestionProps {
  text:     string
  min:      string
  max:      string
  value:    QuizScale | undefined
  onChange: (v: QuizScale) => void
}

const SCALE: QuizScale[] = [1, 2, 3, 4, 5]

export function ScaleQuestion({ text, min, max, value, onChange }: ScaleQuestionProps) {
  return (
    <div className="qz-scale-question">
      <p className="qz-scale-question__text">{text}</p>
      <div className="qz-scale-question__buttons">
        {SCALE.map(n => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            className={`qz-scale-btn${value === n ? ' qz-scale-btn--selected' : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="qz-scale-question__labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
