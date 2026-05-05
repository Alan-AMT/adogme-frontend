// modules/recommendations/components/quiz-steps/OptionQuestion.tsx
// Pregunta de opción única — renderiza opciones con texto humano como cards.
'use client'

import type { QuizScale, QuizOption } from '@/modules/shared/domain/LifestyleProfile'

interface OptionQuestionProps {
  text:     string
  options:  QuizOption[]
  value:    QuizScale | undefined
  onChange: (v: QuizScale) => void
}

export function OptionQuestion({ text, options, value, onChange }: OptionQuestionProps) {
  return (
    <div className="qz-option-question">
      <p className="qz-option-question__text">{text}</p>
      <div className="qz-option-question__options">
        {options.map(opt => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`qz-option${selected ? ' qz-option--selected' : ''}`}
              onClick={() => onChange(opt.value)}
            >
              <span className="qz-option__radio" aria-hidden="true">
                {selected && <span className="qz-option__radio-dot" />}
              </span>
              <span className="qz-option__label">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
