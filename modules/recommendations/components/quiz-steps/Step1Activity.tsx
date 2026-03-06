// modules/recommendations/components/quiz-steps/Step1Activity.tsx
// Paso 1 — Estilo de vida
// Campos: actividadFisica (single-select) + horasLibresParaPerro (chips)
'use client'

import type { StepProps } from './types'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

// ─── Opciones ─────────────────────────────────────────────────────────────────

type Activity = LifestyleQuizAnswers['actividadFisica']

const ACTIVITIES: {
  value: Activity
  icon:  string
  label: string
  desc:  string
}[] = [
  {
    value: 'sedentario',
    icon:  'weekend',
    label: 'Sedentario',
    desc:  'Prefiero el descanso, salidas cortas',
  },
  {
    value: 'moderado',
    icon:  'directions_walk',
    label: 'Moderado',
    desc:  'Caminatas y actividad ocasional',
  },
  {
    value: 'activo',
    icon:  'directions_run',
    label: 'Activo',
    desc:  'Ejercito varias veces por semana',
  },
  {
    value: 'muy_activo',
    icon:  'sports',
    label: 'Muy activo',
    desc:  'Deporte diario o actividad intensa',
  },
]

const HORAS: { value: number; label: string }[] = [
  { value: 0.5, label: '< 1 hora' },
  { value: 1.5, label: '1 – 2 horas' },
  { value: 3.5, label: '3 – 4 horas' },
  { value: 5,   label: '+ 4 horas' },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step1Activity({ answers, onChange }: StepProps) {
  const selected      = answers.actividadFisica
  const horasSelected = answers.horasLibresParaPerro

  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <p className="qz-step__emoji">🏃</p>
        <h2 className="qz-step__title">¿Cómo es tu estilo de vida?</h2>
        <p className="qz-step__subtitle">
          Selecciona la opción que mejor te describe
        </p>
      </div>

      {/* Actividad física — 4 cards 2×2 */}
      <div className="qz-cards-grid">
        {ACTIVITIES.map(opt => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              className={`qz-card${isSelected ? ' qz-card--selected' : ''}`}
              onClick={() => onChange('actividadFisica', opt.value)}
              aria-pressed={isSelected}
            >
              <span
                className="material-symbols-outlined qz-card__icon"
                style={{
                  fontVariationSettings: isSelected
                    ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 40"
                    : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 40",
                }}
              >
                {opt.icon}
              </span>
              <p className="qz-card__label">{opt.label}</p>
              <p className="qz-card__desc">{opt.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Horas disponibles — chips */}
      <div className="qz-section">
        <p className="qz-section__label">Horas al día para tu perro</p>
        <div className="qz-pills">
          {HORAS.map(h => {
            const isSelected = horasSelected === h.value
            return (
              <button
                key={h.value}
                type="button"
                className={`qz-pill${isSelected ? ' qz-pill--selected' : ''}`}
                onClick={() => onChange('horasLibresParaPerro', h.value)}
                aria-pressed={isSelected}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14" }}
                >
                  schedule
                </span>
                {h.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
