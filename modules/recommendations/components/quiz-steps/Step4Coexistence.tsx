// modules/recommendations/components/quiz-steps/Step4Coexistence.tsx
// Paso 4 — Recursos y cuidados (q16-q20)
'use client'

import type { StepProps } from './types'
import type { QuizScale } from '@/modules/shared/domain/LifestyleProfile'
import { ScaleQuestion } from './ScaleQuestion'

const QUESTIONS: {
  key: 'q16' | 'q17' | 'q18' | 'q19' | 'q20'
  text: string
  min: string
  max: string
}[] = [
  { key: 'q16', text: '¿Qué tan preparado estás para cubrir gastos veterinarios inesperados?',   min: 'Nada preparado', max: 'Totalmente preparado'    },
  { key: 'q17', text: '¿Qué tan cómodo estás administrando medicación si fuera necesario?',      min: 'Nada cómodo',    max: 'Muy cómodo'              },
  { key: 'q18', text: '¿Cuánto podrías gastar mensualmente en el cuidado de tu perro?',          min: 'Muy poco',       max: 'Sin restricción'         },
  { key: 'q19', text: '¿Estarías dispuesto a pagar tratamientos médicos si el perro lo necesitara?', min: 'No',         max: 'Sin duda'                },
  { key: 'q20', text: '¿Qué tan comprometido estás con mantener vacunas y cuidados preventivos?', min: 'Poco',         max: 'Totalmente comprometido'  },
]

export function Step4Coexistence({ answers, onChange }: StepProps) {
  return (
    <div className="qz-step">
      <div className="qz-step__head">
        <div className="qz-step__icon">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}>favorite</span>
        </div>
        <h2 className="qz-step__title">Recursos y cuidados</h2>
        <p className="qz-step__subtitle">¿Qué tan comprometido estás con el bienestar del perro?</p>
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
