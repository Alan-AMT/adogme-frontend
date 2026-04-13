// modules/recommendations/components/quiz-steps/Step2Housing.tsx
// Paso 2 — Hogar y espacio (q6-q10)
'use client'

import type { StepProps } from './types'
import type { QuizScale } from '@/modules/shared/domain/LifestyleProfile'
import { ScaleQuestion } from './ScaleQuestion'

const QUESTIONS: {
  key: 'q6' | 'q7' | 'q8' | 'q9' | 'q10'
  text: string
  min: string
  max: string
}[] = [
  { key: 'q6',  text: '¿Qué tipo de vivienda tienes?',                                     min: 'Depto pequeño',    max: 'Casa con jardín grande' },
  { key: 'q7',  text: '¿Tienes acceso a un espacio exterior donde el perro pueda moverse?', min: 'Sin acceso',       max: 'Jardín / parque propio' },
  { key: 'q8',  text: '¿Qué tan cómodo estás con perros grandes dentro del hogar?',         min: 'Nada cómodo',      max: 'Muy cómodo'             },
  { key: 'q9',  text: '¿Qué tan tranquilo o ruidoso es tu hogar normalmente?',              min: 'Muy ruidoso',      max: 'Muy tranquilo'          },
  { key: 'q10', text: '¿Cuántas personas viven en tu casa?',                                min: 'Vivo solo',        max: 'Familia grande (5+)'    },
]

export function Step2Housing({ answers, onChange }: StepProps) {
  return (
    <div className="qz-step">
      <div className="qz-step__head">
        <div className="qz-step__icon">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}>home</span>
        </div>
        <h2 className="qz-step__title">Hogar y espacio</h2>
        <p className="qz-step__subtitle">Cuéntanos sobre tu vivienda y el espacio disponible</p>
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
