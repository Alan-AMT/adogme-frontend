// modules/recommendations/components/quiz-steps/Step3Experience.tsx
// Paso 3 — Experiencia y entrenamiento (q11-q15)
'use client'

import type { StepProps } from './types'
import type { QuizScale } from '@/modules/shared/domain/LifestyleProfile'
import { ScaleQuestion } from './ScaleQuestion'

const QUESTIONS: {
  key: 'q11' | 'q12' | 'q13' | 'q14' | 'q15'
  text: string
  min: string
  max: string
}[] = [
  { key: 'q11', text: '¿Has tenido perros antes?',                                               min: 'Nunca',            max: 'Muchos años de experiencia'  },
  { key: 'q12', text: '¿Qué tan cómodo te sientes entrenando a un perro?',                       min: 'Nada cómodo',      max: 'Muy experimentado'           },
  { key: 'q13', text: '¿Cuánta paciencia tienes para enseñar comportamientos nuevos?',           min: 'Poca',             max: 'Mucha'                       },
  { key: 'q14', text: '¿Estarías dispuesto a asistir a clases de entrenamiento?',                min: 'No',               max: 'Definitivamente'             },
  { key: 'q15', text: '¿Qué tan preparado te sientes para adaptarte a un perro rescatado?',      min: 'Nada preparado',   max: 'Totalmente preparado'        },
]

export function Step3Experience({ answers, onChange }: StepProps) {
  return (
    <div className="qz-step">
      <div className="qz-step__head">
        <div className="qz-step__icon">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}>school</span>
        </div>
        <h2 className="qz-step__title">Experiencia y entrenamiento</h2>
        <p className="qz-step__subtitle">¿Cuánta experiencia tienes con perros?</p>
      </div>

      {QUESTIONS.map(q => (
        <ScaleQuestion
          key={q.key}
          text={q.text}
          min={q.min}
          max={q.max}
          value={answers[q.key]}
          onChange={v => onChange(q.key, v as QuizScale)}
        />
      ))}
    </div>
  )
}
