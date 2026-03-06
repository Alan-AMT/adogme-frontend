// modules/shared/components/forms/PersonalityPicker.tsx
// 'use client' — Grid de chips de PersonalityTag clickeables.
// Agrupados por categoría con separador de sección.
// Props: value: PersonalityTag[], onChange, maxSelections?: number
'use client'

import {
  PersonalityTag as PersonalityTagChip,
  PERSONALITY_TAGS,
  type PersonalityTag,
  type PersonalityTagCategory,
} from '../dog/PersonalityTag'

// ─── Props ────────────────────────────────────────────────────────────────────

interface PersonalityPickerProps {
  value:           PersonalityTag[]
  onChange:        (next: PersonalityTag[]) => void
  maxSelections?:  number
}

// ─── Config de categorías ────────────────────────────────────────────────────

const CATEGORY_ORDER: PersonalityTagCategory[] = ['energy', 'social', 'behavior', 'special']

const CATEGORY_META: Record<PersonalityTagCategory, { label: string; icon: string; color: string }> = {
  energy:   { label: 'Energía',          icon: 'bolt',            color: '#ea580c' },
  social:   { label: 'Social',           icon: 'people',          color: '#16a34a' },
  behavior: { label: 'Comportamiento',   icon: 'psychology',      color: '#2563eb' },
  special:  { label: 'Especial',         icon: 'auto_awesome',    color: '#9333ea' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PersonalityPicker({
  value,
  onChange,
  maxSelections,
}: PersonalityPickerProps) {
  const selectedIds = new Set(value.map(t => t.id))
  const count       = value.length
  const atLimit     = maxSelections !== undefined && count >= maxSelections

  function toggle(tag: PersonalityTag) {
    if (selectedIds.has(tag.id)) {
      // Deseleccionar siempre permitido
      onChange(value.filter(t => t.id !== tag.id))
    } else {
      // Seleccionar solo si no se alcanzó el límite
      if (atLimit) return
      onChange([...value, tag])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Contador de seleccionados ── */}
      {maxSelections !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a' }}>
            Selecciona las características del perro
          </span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 900,
            padding: '3px 10px', borderRadius: 999,
            background: atLimit ? '#fef2f2' : '#f5f5f5',
            color:      atLimit ? '#b91c1c' : '#52525b',
            border:     `1px solid ${atLimit ? '#fecaca' : '#e5e7eb'}`,
            transition: 'all 200ms ease',
          }}>
            {count} / {maxSelections}
          </span>
        </div>
      )}

      {/* ── Grupos por categoría ── */}
      {CATEGORY_ORDER.map(cat => {
        const meta = CATEGORY_META[cat]
        const tags = PERSONALITY_TAGS.filter(t => t.category === cat)

        return (
          <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* Separador de sección */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 15,
                  color: meta.color,
                  fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 15",
                }}
              >
                {meta.icon}
              </span>
              <span style={{
                fontSize: '0.72rem', fontWeight: 900,
                color: meta.color,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}>
                {meta.label}
              </span>
              <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
            </div>

            {/* Grid de chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map(tag => {
                const isSelected = selectedIds.has(tag.id)
                const isDisabled = atLimit && !isSelected

                return (
                  <div
                    key={tag.id}
                    style={{
                      opacity:    isDisabled ? 0.45 : 1,
                      cursor:     isDisabled ? 'not-allowed' : 'pointer',
                      transition: 'opacity 150ms ease',
                    }}
                  >
                    <PersonalityTagChip
                      tag={tag}
                      size="md"
                      selected={isSelected}
                      onClick={isDisabled ? undefined : () => toggle(tag)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── Hint cuando se alcanza el límite ── */}
      {atLimit && (
        <p style={{
          fontSize: '0.78rem', fontWeight: 700,
          color: '#b91c1c',
          display: 'flex', alignItems: 'center', gap: 5,
          margin: 0,
        }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          Máximo {maxSelections} características. Deselecciona una para cambiar.
        </p>
      )}

      {/* ── Resumen de seleccionados ── */}
      {value.length > 0 && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '0.85rem',
          background: '#fafafa',
          border: '1.5px solid #f0f0f0',
          display: 'flex', flexWrap: 'wrap', gap: 6,
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#71717a', marginRight: 2 }}>
            Seleccionadas:
          </span>
          {value.map(tag => (
            <PersonalityTagChip
              key={tag.id}
              tag={tag}
              size="sm"
              selected
              onClick={() => toggle(tag)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
