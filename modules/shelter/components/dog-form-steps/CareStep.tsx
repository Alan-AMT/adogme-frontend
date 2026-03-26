// modules/shelter/components/dog-form-steps/CareStep.tsx
// Archivo 179 — Paso 2: Cuidados especiales.
// Campos: toggle castrado, toggle microchip, toggle necesitaJardin.
'use client'

import type { DogFormData } from '../../application/hooks/useDogForm'
import { Toggle } from '@/modules/shared/components/ui/Toggle'
import '../../styles/shelterViews.css'

type UpdateFn = <K extends keyof DogFormData>(field: K, value: DogFormData[K]) => void

interface Props {
  formData: DogFormData
  errors:   Record<string, string>
  update:   UpdateFn
}

const CARE_TOGGLES = [
  {
    key:         'castrado'      as const,
    label:       'Esterilizado / Castrado',
    description: 'El perro ha sido esterilizado o castrado quirúrgicamente',
    icon:        'medical_services',
  },
  {
    key:         'microchip'     as const,
    label:       'Con microchip',
    description: 'Identificado con microchip de rastreo',
    icon:        'memory',
  },
  {
    key:         'necesitaJardin' as const,
    label:       'Necesita jardín',
    description: 'Requiere acceso a espacio exterior para su bienestar',
    icon:        'yard',
  },
]

export function CareStep({ formData, update }: Props) {
  return (
    <div className="sv-form-section">
      <div className="sv-form-section__header">
        <div className="sv-form-section__header-icon">
          <span className="material-symbols-outlined">health_and_safety</span>
        </div>
        <span className="sv-form-section__header-text">Cuidados y características</span>
      </div>
      <div className="sv-form-section__body">
        <p style={{ fontSize: '0.82rem', color: '#71717a', marginBottom: '0.25rem' }}>
          Indica las características de salud y cuidados especiales de este perro.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {CARE_TOGGLES.map((item, i) => (
            <div
              key={item.key}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '1rem',
                padding:        '1rem 1.1rem',
                borderRadius:   '0.9rem',
                background:     formData[item.key] ? 'rgba(255,107,107,0.05)' : '#fafafa',
                border:         formData[item.key] ? '1.5px solid rgba(255,107,107,0.2)' : '1.5px solid #f0f0f0',
                transition:     'all 150ms ease',
                marginBottom:   i < CARE_TOGGLES.length - 1 ? '0.65rem' : 0,
                cursor:         'pointer',
              }}
              onClick={() => update(item.key, !formData[item.key])}
            >
              {/* Icon */}
              <div style={{
                width:          40,
                height:         40,
                borderRadius:   '0.75rem',
                background:     formData[item.key] ? 'rgba(255,107,107,0.12)' : '#f4f4f5',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: formData[item.key] ? '#ff6b6b' : '#a1a1aa', fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', marginBottom: '0.1rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>{item.description}</p>
              </div>

              {/* Toggle (click event is on the row, toggle is visual-only here) */}
              <div style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <Toggle
                  id={item.key}
                  checked={formData[item.key]}
                  onChange={v => update(item.key, v)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
