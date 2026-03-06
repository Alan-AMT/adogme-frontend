// modules/recommendations/components/quiz-steps/Step3Experience.tsx
// Paso 3 — Experiencia previa con perros
// Campos: experienciaPrevia
'use client'

import type { StepProps } from './types'

// ─── Opciones ─────────────────────────────────────────────────────────────────

const OPTIONS = [
  {
    value:   true,
    icon:    'military_tech',
    label:   'Tengo experiencia',
    desc:    'He tenido o cuidado perros antes',
    color:   '#16a34a',
    bgLight: '#f0fdf4',
  },
  {
    value:   false,
    icon:    'emoji_nature',
    label:   'Soy nuevo en esto',
    desc:    'Primera vez que adoptaré un perro',
    color:   '#2563eb',
    bgLight: '#eff6ff',
  },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step3Experience({ answers, onChange }: StepProps) {
  const selected = answers.experienciaPrevia

  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <p className="qz-step__emoji">🐾</p>
        <h2 className="qz-step__title">¿Tienes experiencia con perros?</h2>
        <p className="qz-step__subtitle">
          Tu experiencia nos ayuda a recomendar el compañero ideal para ti
        </p>
      </div>

      {/* 2 cards grandes centradas */}
      <div className="qz-cards-grid" style={{ maxWidth: 480, margin: '0 auto' }}>
        {OPTIONS.map(opt => {
          const isSelected = selected === opt.value
          return (
            <button
              key={String(opt.value)}
              type="button"
              className={`qz-card${isSelected ? ' qz-card--selected' : ''}`}
              style={isSelected
                ? { borderColor: '#ff6b6b', background: '#fff5f5' }
                : undefined
              }
              onClick={() => onChange('experienciaPrevia', opt.value)}
              aria-pressed={isSelected}
            >
              <span
                className="material-symbols-outlined qz-card__icon"
                style={{
                  fontSize: 48,
                  fontVariationSettings: isSelected
                    ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 48"
                    : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 48",
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

      {/* Nota informativa */}
      <p
        style={{
          fontSize: '0.78rem',
          color: '#a1a1aa',
          fontWeight: 500,
          textAlign: 'center',
          marginTop: '1.5rem',
          lineHeight: 1.55,
        }}
      >
        No hay respuesta incorrecta. Tenemos perros ideales para todos los niveles de experiencia.
      </p>
    </div>
  )
}
