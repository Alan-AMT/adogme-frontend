// modules/recommendations/components/quiz-steps/Step5SizePreference.tsx
// Paso 5 — Tamaño preferido del perro (multi-select)
// Campo: tamanoPreferido[]
// Regla: seleccionar 'sin_preferencia' excluye los demás y viceversa
'use client'

import type { StepProps } from './types'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'

// ─── Opciones ─────────────────────────────────────────────────────────────────

type TamanoPref = LifestyleQuizAnswers['tamanoPreferido'][number]

const OPTIONS: {
  value: TamanoPref
  icon:  string
  label: string
  desc:  string
}[] = [
  { value: 'pequeño',         icon: 'cruelty_free',  label: 'Pequeño',         desc: 'Menos de 10 kg'       },
  { value: 'mediano',         icon: 'pets',          label: 'Mediano',         desc: '10 – 25 kg'           },
  { value: 'grande',          icon: 'service_toolbox', label: 'Grande',        desc: '25 – 45 kg'           },
  { value: 'gigante',         icon: 'skull',         label: 'Gigante',         desc: 'Más de 45 kg'         },
  { value: 'sin_preferencia', icon: 'favorite',      label: 'Sin preferencia', desc: 'Cualquier tamaño'     },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step5SizePreference({ answers, onChange }: StepProps) {
  const selected = answers.tamanoPreferido ?? []

  function handleSelect(value: TamanoPref) {
    if (value === 'sin_preferencia') {
      onChange('tamanoPreferido', ['sin_preferencia'])
      return
    }

    const withoutSin = selected.filter(v => v !== 'sin_preferencia')

    if (withoutSin.includes(value)) {
      const next = withoutSin.filter(v => v !== value)
      onChange('tamanoPreferido', next.length ? next as LifestyleQuizAnswers['tamanoPreferido'] : ['sin_preferencia'])
    } else {
      onChange('tamanoPreferido', [...withoutSin, value] as LifestyleQuizAnswers['tamanoPreferido'])
    }
  }

  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <p className="qz-step__emoji">📏</p>
        <h2 className="qz-step__title">¿Qué tamaño prefieres?</h2>
        <p className="qz-step__subtitle">
          Puedes elegir varios tamaños — o seleccionar "Sin preferencia"
        </p>
      </div>

      {/* 4 tamaños + sin preferencia en fila adicional */}
      <div className="qz-cards-grid">
        {OPTIONS.slice(0, 4).map(opt => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              className={`qz-card${isSelected ? ' qz-card--selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
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

      {/* Sin preferencia — fila completa */}
      {(() => {
        const sinPref    = OPTIONS[4]
        const isSelected = selected.includes('sin_preferencia')
        return (
          <button
            type="button"
            className={`qz-card${isSelected ? ' qz-card--selected' : ''}`}
            style={{ marginTop: '0.875rem', flexDirection: 'row', justifyContent: 'center', gap: '0.75rem', padding: '0.875rem' }}
            onClick={() => handleSelect('sin_preferencia')}
            aria-pressed={isSelected}
          >
            <span
              className="material-symbols-outlined qz-card__icon"
              style={{
                fontSize: 22,
                fontVariationSettings: isSelected
                  ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24"
                  : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24",
              }}
            >
              {sinPref.icon}
            </span>
            <span className="qz-card__label">{sinPref.label}</span>
            <span className="qz-card__desc" style={{ margin: 0 }}>{sinPref.desc}</span>
          </button>
        )
      })()}

      {/* Indicador de selección múltiple */}
      {selected.length > 1 && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#16a34a',
            fontWeight: 700,
            marginTop: '0.75rem',
          }}
        >
          {selected.filter(v => v !== 'sin_preferencia').length} tamaños seleccionados
        </p>
      )}
    </div>
  )
}
