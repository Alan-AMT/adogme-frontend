// modules/shelter/components/dog-form-steps/PersonalityStep.tsx
// Archivo 178 — Paso 1: Personalidad y compatibilidad.
'use client'

import type { DogFormData } from '../../application/hooks/useDogForm'
import type { PersonalityTag } from '@/modules/shared/domain/Dog'
import { PERSONALITY_TAGS_CATALOG } from '@/modules/shared/utils/constants'
import '../../styles/shelterViews.css'

type UpdateFn = <K extends keyof DogFormData>(field: K, value: DogFormData[K]) => void

interface Props {
  formData: DogFormData
  errors: Record<string, string>
  update: UpdateFn
}

const CATEGORY_LABELS: Record<string, string> = {
  caracter: 'Carácter',
  socializacion: 'socializacion',
  actividad: 'Actividad',
  entrenamiento: 'Entrenamiento',
}

const COMPAT_OPTIONS = [
  { key: 'aptoNinos' as const, label: 'Niños', icon: 'child_care', desc: 'Se lleva bien con niños' },
  { key: 'aptoPerros' as const, label: 'Perros', icon: 'pets', desc: 'Convive con otros perros' },
  { key: 'aptoGatos' as const, label: 'Gatos', icon: 'cruelty_free', desc: 'Convive con gatos' },
]

export function PersonalityStep({ formData, errors, update }: Props) {
  const selectedIds = new Set(formData.personalidad.map(t => t.id))
  const maxReached = selectedIds.size >= 8

  function toggleTag(tag: PersonalityTag) {
    if (selectedIds.has(tag.id)) {
      update('personalidad', formData.personalidad.filter(t => t.id !== tag.id))
    } else if (!maxReached) {
      update('personalidad', [...formData.personalidad, tag])
    }
  }

  // Group by category
  const byCategory = PERSONALITY_TAGS_CATALOG.reduce<Record<string, PersonalityTag[]>>((acc, tag) => {
    ; (acc[tag.categoria] ??= []).push(tag)
    return acc
  }, {})

  return (
    <>
      {/* ── Tags de personalidad ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <span className="sv-form-section__header-text">Personalidad</span>
        </div>
        <div className="sv-form-section__body">
          <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '0.25rem' }}>
            Selecciona los rasgos que mejor describan a este perro <span style={{ fontWeight: 700 }}>(máx. 8)</span>
          </p>

          {Object.entries(byCategory).map(([cat, tags]) => (
            <div key={cat} style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                {CATEGORY_LABELS[cat] ?? cat}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {tags.map(tag => {
                  const active = selectedIds.has(tag.id)
                  const disabled = maxReached && !active
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleTag(tag)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 999,
                        border: active ? '1.5px solid rgba(255,107,107,0.35)' : '1.5px solid #e4e4e7',
                        background: active ? 'rgba(255,107,107,0.1)' : '#fff',
                        color: active ? '#ff6b6b' : '#52525b',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.4 : 1,
                        transition: 'all 150ms ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{tag.icon}</span>
                      {tag.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {formData.personalidad.length > 0 && (
            <p style={{ fontSize: '0.73rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
              {formData.personalidad.length} de 8 tags seleccionados
            </p>
          )}
        </div>
      </div>

      {/* ── Compatibilidad ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">diversity_1</span>
          </div>
          <span className="sv-form-section__header-text">Compatibilidad</span>
        </div>
        <div className="sv-form-section__body">
          <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '0.5rem' }}>
            Activa las convivencias que apliquen a este perro
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {COMPAT_OPTIONS.map(opt => {
              const active = formData[opt.key]
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => update(opt.key, !active)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '1.1rem 0.75rem',
                    borderRadius: '1rem',
                    border: active ? '2px solid rgba(255,107,107,0.35)' : '2px solid #e4e4e7',
                    background: active ? 'rgba(255,107,107,0.07)' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    textAlign: 'center',
                    fontFamily: 'inherit',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 30, color: active ? '#ff6b6b' : '#a1a1aa', fontVariationSettings: "'FILL' 1" }}
                  >
                    {opt.icon}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: active ? '#ff6b6b' : '#374151' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 500 }}>{opt.desc}</span>
                  {active && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#ff6b6b', background: 'rgba(255,107,107,0.12)', padding: '0.15rem 0.55rem', borderRadius: 999 }}>
                      ✓ Activo
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {errors.personalidad && <p className="sv-field__error" style={{ marginTop: '0.5rem' }}>{errors.personalidad}</p>}
        </div>
      </div>
    </>
  )
}
