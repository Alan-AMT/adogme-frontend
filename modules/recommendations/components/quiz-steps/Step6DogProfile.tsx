// modules/recommendations/components/quiz-steps/Step6DogProfile.tsx
// Paso 6 — Preferencias del perro
// Campos: energiaPreferida (single) + sexoPreferido (pills) + edadPreferida (multi pills)
'use client'

import type { StepProps } from './types'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

// ─── Opciones ─────────────────────────────────────────────────────────────────

type Energia  = LifestyleQuizAnswers['energiaPreferida']
type Sexo     = LifestyleQuizAnswers['sexoPreferido']
type EdadPref = LifestyleQuizAnswers['edadPreferida'][number]

const ENERGIAS: { value: Energia; icon: string; label: string; desc: string }[] = [
  { value: 'baja',            icon: 'self_care',      label: 'Tranquilo',      desc: 'Ideal para el sofá'        },
  { value: 'moderada',        icon: 'directions_walk', label: 'Moderado',      desc: 'Equilibrado y adaptable'   },
  { value: 'alta',            icon: 'directions_run', label: 'Energético',     desc: 'Le encanta el movimiento'  },
  { value: 'sin_preferencia', icon: 'favorite',       label: 'Cualquiera',     desc: 'Sin preferencia de energía'},
]

const SEXOS: { value: Sexo; icon: string; label: string }[] = [
  { value: 'macho',           icon: 'male',   label: 'Macho'  },
  { value: 'hembra',          icon: 'female', label: 'Hembra' },
  { value: 'sin_preferencia', icon: 'transgender', label: 'Sin preferencia' },
]

const EDADES: { value: EdadPref; label: string }[] = [
  { value: 'cachorro',        label: 'Cachorro (0-1 año)' },
  { value: 'joven',           label: 'Joven (1-3 años)'   },
  { value: 'adulto',          label: 'Adulto (3-8 años)'  },
  { value: 'senior',          label: 'Senior (8+ años)'   },
  { value: 'sin_preferencia', label: 'Sin preferencia'    },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step6DogProfile({ answers, onChange }: StepProps) {
  const energiaSelected = answers.energiaPreferida
  const sexoSelected    = answers.sexoPreferido
  const edadSelected    = answers.edadPreferida ?? []

  function handleEdad(value: EdadPref) {
    if (value === 'sin_preferencia') {
      onChange('edadPreferida', ['sin_preferencia'])
      return
    }

    const withoutSin = edadSelected.filter(v => v !== 'sin_preferencia')

    if (withoutSin.includes(value)) {
      const next = withoutSin.filter(v => v !== value)
      onChange('edadPreferida', next.length ? next as LifestyleQuizAnswers['edadPreferida'] : ['sin_preferencia'])
    } else {
      onChange('edadPreferida', [...withoutSin, value] as LifestyleQuizAnswers['edadPreferida'])
    }
  }

  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <p className="qz-step__emoji">🐕</p>
        <h2 className="qz-step__title">¿Cómo es el perro ideal para ti?</h2>
        <p className="qz-step__subtitle">
          Define las características que buscas
        </p>
      </div>

      {/* Energía — 4 cards 2×2 */}
      <div>
        <p className="qz-section__label" style={{ marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.82rem', fontWeight: 900, color: '#3f3f46', letterSpacing: '0.04em' }}>
          Nivel de energía
        </p>
        <div className="qz-cards-grid">
          {ENERGIAS.map(opt => {
            const isSelected = energiaSelected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={`qz-card qz-card--sm${isSelected ? ' qz-card--selected' : ''}`}
                onClick={() => onChange('energiaPreferida', opt.value)}
                aria-pressed={isSelected}
              >
                <span
                  className="material-symbols-outlined qz-card__icon"
                  style={{
                    fontSize: 30,
                    fontVariationSettings: isSelected
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32",
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
      </div>

      {/* Sexo — pills */}
      <div className="qz-section">
        <p className="qz-section__label">Sexo preferido</p>
        <div className="qz-pills">
          {SEXOS.map(opt => {
            const isSelected = sexoSelected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={`qz-pill${isSelected ? ' qz-pill--selected' : ''}`}
                onClick={() => onChange('sexoPreferido', opt.value)}
                aria-pressed={isSelected}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}
                >
                  {opt.icon}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Edad — pills multi-select */}
      <div className="qz-section">
        <p className="qz-section__label">Edad (puedes elegir varias)</p>
        <div className="qz-pills">
          {EDADES.map(opt => {
            const isSelected = edadSelected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                className={`qz-pill${isSelected ? ' qz-pill--selected' : ''}`}
                onClick={() => handleEdad(opt.value)}
                aria-pressed={isSelected}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
