// modules/recommendations/components/quiz-steps/Step4Coexistence.tsx
// Paso 4 — Convivencia en el hogar
// Campos: conviveConNinos + conviveConMascotas
'use client'

import type { StepProps } from './types'

// ─── Sub-componente: par de cards Sí/No ──────────────────────────────────────

interface YesNoCardsProps {
  value:    boolean | undefined
  onSelect: (v: boolean) => void
  yesLabel: string
  yesDesc:  string
  noLabel:  string
  noDesc:   string
  yesIcon:  string
  noIcon:   string
}

function YesNoCards({
  value, onSelect,
  yesLabel, yesDesc, noLabel, noDesc, yesIcon, noIcon,
}: YesNoCardsProps) {
  return (
    <div className="qz-cards-grid">
      {/* Sí */}
      <button
        type="button"
        className={`qz-card qz-card--sm${value === true ? ' qz-card--selected' : ''}`}
        onClick={() => onSelect(true)}
        aria-pressed={value === true}
      >
        <span
          className="material-symbols-outlined qz-card__icon"
          style={{
            fontSize: 32,
            fontVariationSettings: value === true
              ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
              : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32",
          }}
        >
          {yesIcon}
        </span>
        <p className="qz-card__label">{yesLabel}</p>
        <p className="qz-card__desc">{yesDesc}</p>
      </button>

      {/* No */}
      <button
        type="button"
        className={`qz-card qz-card--sm${value === false ? ' qz-card--selected' : ''}`}
        onClick={() => onSelect(false)}
        aria-pressed={value === false}
      >
        <span
          className="material-symbols-outlined qz-card__icon"
          style={{
            fontSize: 32,
            fontVariationSettings: value === false
              ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
              : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32",
          }}
        >
          {noIcon}
        </span>
        <p className="qz-card__label">{noLabel}</p>
        <p className="qz-card__desc">{noDesc}</p>
      </button>
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function Step4Coexistence({ answers, onChange }: StepProps) {
  return (
    <div className="qz-step">

      <div className="qz-step__head">
        <div className="qz-step__icon">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}>family_restroom</span>
        </div>
        <h2 className="qz-step__title">¿Con quién convives en casa?</h2>
        <p className="qz-step__subtitle">
          Esto nos ayuda a elegir un perro compatible con todos en el hogar
        </p>
      </div>

      {/* Niños */}
      <div>
        <p className="qz-section__label">
          ¿Hay niños en el hogar?
        </p>
        <YesNoCards
          value={answers.conviveConNinos}
          onSelect={v => onChange('conviveConNinos', v)}
          yesIcon="child_care"
          yesLabel="Sí, hay niños"
          yesDesc="El perro convivirá con menores"
          noIcon="person"
          noLabel="No hay niños"
          noDesc="Solo adultos en casa"
        />
      </div>

      {/* Mascotas */}
      <div className="qz-section">
        <p className="qz-section__label">¿Tienes otras mascotas?</p>
        <YesNoCards
          value={answers.conviveConMascotas}
          onSelect={v => onChange('conviveConMascotas', v)}
          yesIcon="pets"
          yesLabel="Sí, tengo"
          yesDesc="Perros, gatos u otras mascotas"
          noIcon="do_not_disturb"
          noLabel="No tengo"
          noDesc="Será el único animal en casa"
        />
      </div>

    </div>
  )
}
