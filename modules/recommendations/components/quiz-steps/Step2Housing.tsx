// modules/recommendations/components/quiz-steps/Step2Housing.tsx
// Paso 2 — Tu vivienda
// Campos: tipoVivienda + tieneJardin + tamanoEspacio
'use client'

import type { StepProps } from './types'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

// ─── Opciones ─────────────────────────────────────────────────────────────────

type TipoVivienda = LifestyleQuizAnswers['tipoVivienda']
type TamanoEspacio = LifestyleQuizAnswers['tamanoEspacio']

const TIPOS: { value: TipoVivienda; icon: string; label: string; desc: string }[] = [
  { value: 'casa',          icon: 'house',     label: 'Casa',           desc: 'Con o sin patio propio'     },
  { value: 'departamento',  icon: 'apartment', label: 'Departamento',   desc: 'Piso en edificio o torre'   },
  { value: 'casa_campo',    icon: 'cabin',     label: 'Casa de campo',  desc: 'Rancho, granja o terreno'   },
  { value: 'otro',          icon: 'home_work', label: 'Otro',           desc: 'Habitación, cuarto, etc.'   },
]

const GARDEN: { value: boolean; icon: string; label: string; desc: string }[] = [
  { value: true,  icon: 'yard',            label: 'Sí, tengo',     desc: 'Jardín, patio o terraza' },
  { value: false, icon: 'do_not_disturb',  label: 'No tengo',      desc: 'Sin espacio exterior'    },
]

const TAMANOS: { value: TamanoEspacio; label: string }[] = [
  { value: 'pequeño', label: 'Pequeño' },
  { value: 'mediano', label: 'Mediano' },
  { value: 'grande',  label: 'Grande'  },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step2Housing({ answers, onChange }: StepProps) {
  const tipoSelected   = answers.tipoVivienda
  const jardinSelected = answers.tieneJardin
  const tamanoSelected = answers.tamanoEspacio

  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <p className="qz-step__emoji">🏠</p>
        <h2 className="qz-step__title">¿Cómo es tu vivienda?</h2>
        <p className="qz-step__subtitle">
          El espacio es clave para elegir el compañero perfecto
        </p>
      </div>

      {/* Tipo de vivienda */}
      <div className="qz-cards-grid">
        {TIPOS.map(opt => {
          const isSelected = tipoSelected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              className={`qz-card${isSelected ? ' qz-card--selected' : ''}`}
              onClick={() => onChange('tipoVivienda', opt.value)}
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

      {/* ¿Tienes jardín? */}
      <div className="qz-section">
        <p className="qz-section__label">¿Cuentas con jardín o patio?</p>
        <div className="qz-cards-grid">
          {GARDEN.map(opt => {
            const isSelected = jardinSelected === opt.value
            return (
              <button
                key={String(opt.value)}
                type="button"
                className={`qz-card qz-card--sm${isSelected ? ' qz-card--selected' : ''}`}
                onClick={() => onChange('tieneJardin', opt.value)}
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

      {/* Tamaño del espacio */}
      <div className="qz-section">
        <p className="qz-section__label">Tamaño del espacio interior</p>
        <div className="qz-pills">
          {TAMANOS.map(opt => {
            const isSelected = tamanoSelected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={`qz-pill${isSelected ? ' qz-pill--selected' : ''}`}
                onClick={() => onChange('tamanoEspacio', opt.value)}
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
