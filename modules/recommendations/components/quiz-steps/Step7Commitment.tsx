// modules/recommendations/components/quiz-steps/Step7Commitment.tsx
// Paso 7 — Compromisos y presupuesto
// Campos: presupuestoMensualMXN + disponibilidadEntrenamiento + aceptaPerroConNecesidadesEspeciales
'use client'

import type { StepProps } from './types'

// ─── Opciones de presupuesto ──────────────────────────────────────────────────

const BUDGET_OPTIONS: {
  value:  number
  label:  string
  range:  string
  icon:   string
}[] = [
  { value: 500,  label: 'Básico',     range: 'hasta $500/mes',        icon: 'savings'    },
  { value: 1500, label: 'Estándar',   range: '$500 – $1,500/mes',     icon: 'account_balance_wallet' },
  { value: 3000, label: 'Cómodo',     range: '$1,500 – $3,000/mes',   icon: 'credit_card' },
  { value: 5000, label: 'Sin límite', range: 'más de $3,000/mes',     icon: 'diamond'    },
]

// ─── Sub-componente: par Sí/No pequeño ───────────────────────────────────────

interface YesNoPairProps {
  value:    boolean | undefined
  onSelect: (v: boolean) => void
}

function YesNoPair({ value, onSelect }: YesNoPairProps) {
  return (
    <div className="qz-pills">
      <button
        type="button"
        className={`qz-pill${value === true ? ' qz-pill--selected' : ''}`}
        onClick={() => onSelect(true)}
        aria-pressed={value === true}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}
        >
          check_circle
        </span>
        Sí
      </button>
      <button
        type="button"
        className={`qz-pill${value === false ? ' qz-pill--selected' : ''}`}
        onClick={() => onSelect(false)}
        aria-pressed={value === false}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}
        >
          cancel
        </span>
        No
      </button>
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step7Commitment({ answers, onChange }: StepProps) {
  const budgetSelected    = answers.presupuestoMensualMXN
  const entrenamientoSel  = answers.disponibilidadEntrenamiento
  const necesidadesSel    = answers.aceptaPerroConNecesidadesEspeciales

  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <p className="qz-step__emoji">💛</p>
        <h2 className="qz-step__title">Compromisos y presupuesto</h2>
        <p className="qz-step__subtitle">
          El último paso — ¡ya casi terminamos!
        </p>
      </div>

      {/* Presupuesto mensual — 4 cards en 2×2 */}
      <div>
        <p className="qz-section__label" style={{ marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.82rem', fontWeight: 900, color: '#3f3f46', letterSpacing: '0.04em' }}>
          Presupuesto mensual estimado
        </p>
        <div className="qz-budget-grid">
          {BUDGET_OPTIONS.map(opt => {
            const isSelected = budgetSelected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={`qz-budget-card${isSelected ? ' qz-budget-card--selected' : ''}`}
                onClick={() => onChange('presupuestoMensualMXN', opt.value)}
                aria-pressed={isSelected}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 26,
                    color: isSelected ? '#ff6b6b' : '#a1a1aa',
                    fontVariationSettings: isSelected
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 28"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 28",
                    marginBottom: '0.2rem',
                  }}
                >
                  {opt.icon}
                </span>
                <p className="qz-budget-card__amount">{opt.label}</p>
                <p className="qz-budget-card__range">{opt.range}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Disponibilidad para entrenamiento */}
      <div className="qz-section">
        <p className="qz-section__label">¿Estás dispuesto a entrenar al perro?</p>
        <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, marginBottom: '0.6rem', lineHeight: 1.4 }}>
          Algunos perros necesitan adiestramiento básico y paciencia inicial
        </p>
        <YesNoPair
          value={entrenamientoSel}
          onSelect={v => onChange('disponibilidadEntrenamiento', v)}
        />
      </div>

      {/* Perros con necesidades especiales */}
      <div className="qz-section">
        <p className="qz-section__label">¿Aceptas perros con necesidades especiales?</p>
        <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, marginBottom: '0.6rem', lineHeight: 1.4 }}>
          Perros con discapacidades, enfermedades crónicas o que requieren cuidados extra
        </p>
        <YesNoPair
          value={necesidadesSel}
          onSelect={v => onChange('aceptaPerroConNecesidadesEspeciales', v)}
        />
      </div>

      {/* Nota de privacidad */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginTop: '1.5rem',
          padding: '0.75rem 1rem',
          background: '#f0fdf4',
          borderRadius: '0.875rem',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 16,
            color: '#16a34a',
            flexShrink: 0,
            marginTop: 1,
            fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18",
          }}
        >
          verified_user
        </span>
        <p style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, lineHeight: 1.5 }}>
          Tus respuestas se usan solo para recomendaciones personalizadas. No las compartimos con terceros.
        </p>
      </div>

    </div>
  )
}
