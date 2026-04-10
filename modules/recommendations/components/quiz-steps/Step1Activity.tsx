// modules/recommendations/components/quiz-steps/Step1Activity.tsx
// Paso 1 — Actividad (q1-q5)
'use client'

import type { StepProps } from './types'
import type { QuizScale } from '@/modules/shared/domain/LifestyleProfile'
import { ScaleQuestion } from './ScaleQuestion'

const QUESTIONS: {
  key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5'
  text: string
  min: string
  max: string
}[] = [
  { key: 'q1', text: '¿Qué tan activo eres físicamente durante la semana?',              min: 'Sedentario',      max: 'Muy activo'         },
  { key: 'q2', text: '¿Con qué frecuencia podrías sacar a pasear a un perro?',           min: 'Rara vez',        max: 'Varias veces al día' },
  { key: 'q3', text: '¿Qué tan importante es para ti hacer actividades al aire libre?',  min: 'Nada importante', max: 'Muy importante'      },
  { key: 'q4', text: '¿Cuánto tiempo podrías dedicar diariamente al ejercicio con tu perro?', min: 'Menos de 15 min', max: 'Más de 2 horas' },
  { key: 'q5', text: '¿Qué tan cómodo te sientes con un perro muy enérgico?',            min: 'Nada cómodo',     max: 'Muy cómodo'         },
]

export function Step1Activity({ answers, onChange }: StepProps) {
  return (
    <div className="qz-step">
      <div className="qz-step__head">
        <div className="qz-step__icon">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}>directions_run</span>
        </div>
        <h2 className="qz-step__title">Estilo de vida y actividad</h2>
        <p className="qz-step__subtitle">¿Cómo es tu día a día y qué tan activo eres?</p>
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
