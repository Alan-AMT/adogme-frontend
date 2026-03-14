// modules/shelter/components/dog-form-steps/BasicDataStep.tsx
// Archivo 177 — Paso 0: Datos básicos del perro.
'use client'

import type { CSSProperties } from 'react'
import type { DogFormData } from '../../application/hooks/useDogForm'
import type { DogSize, DogSex, EnergyLevel } from '@/modules/shared/domain/Dog'
import '../../styles/shelterViews.css'

type UpdateFn = <K extends keyof DogFormData>(field: K, value: DogFormData[K]) => void

interface Props {
  formData: DogFormData
  errors:   Record<string, string>
  update:   UpdateFn
}

const SIZES: { value: DogSize; label: string; sub: string }[] = [
  { value: 'pequeño', label: 'Pequeño', sub: '< 10 kg'  },
  { value: 'mediano', label: 'Mediano', sub: '10–25 kg' },
  { value: 'grande',  label: 'Grande',  sub: '25–45 kg' },
  { value: 'gigante', label: 'Gigante', sub: '+45 kg'   },
]

const SEXES: { value: DogSex; label: string; icon: string }[] = [
  { value: 'macho',  label: 'Macho',  icon: 'male'   },
  { value: 'hembra', label: 'Hembra', icon: 'female' },
]

const ENERGIES: { value: EnergyLevel; label: string; icon: string }[] = [
  { value: 'baja',     label: 'Baja',     icon: 'self_care'       },
  { value: 'moderada', label: 'Moderada', icon: 'directions_walk'  },
  { value: 'alta',     label: 'Alta',     icon: 'directions_run'   },
  { value: 'muy_alta', label: 'Muy alta', icon: 'bolt'             },
]

function pill(active: boolean): CSSProperties {
  return {
    display:      'inline-flex',
    alignItems:   'center',
    gap:          '0.3rem',
    padding:      '0.45rem 0.95rem',
    borderRadius: 999,
    border:       active ? '1.5px solid rgba(255,107,107,0.35)' : '1.5px solid #e4e4e7',
    background:   active ? 'rgba(255,107,107,0.1)' : '#fff',
    color:        active ? '#ff6b6b' : '#374151',
    fontSize:     '0.82rem',
    fontWeight:   700,
    cursor:       'pointer',
    transition:   'all 150ms ease',
    fontFamily:   'inherit',
    whiteSpace:   'nowrap',
  }
}

function formatAge(m: number): string {
  if (m < 12) return `${m} mes${m !== 1 ? 'es' : ''}`
  const y = Math.floor(m / 12)
  const rm = m % 12
  return `${y} año${y !== 1 ? 's' : ''}${rm > 0 ? ` y ${rm} mes${rm !== 1 ? 'es' : ''}` : ''}`
}

export function BasicDataStep({ formData, errors, update }: Props) {
  return (
    <>
      {/* ── Identificación ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">badge</span>
          </div>
          <span className="sv-form-section__header-text">Identificación</span>
        </div>
        <div className="sv-form-section__body">
          <div className="sv-form-row">
            <div className="sv-field">
              <label className="sv-field__label">Nombre <span className="sv-field__required">*</span></label>
              <input
                type="text" className="sv-field__input"
                value={formData.nombre}
                onChange={e => update('nombre', e.target.value)}
                placeholder="Ej: Max" maxLength={80}
              />
              {errors.nombre && <p className="sv-field__error">{errors.nombre}</p>}
            </div>
            <div className="sv-field">
              <label className="sv-field__label">Raza <span className="sv-field__required">*</span></label>
              <input
                type="text" className="sv-field__input"
                value={formData.raza}
                onChange={e => update('raza', e.target.value)}
                placeholder="Ej: Labrador Retriever" maxLength={100}
              />
              {errors.raza && <p className="sv-field__error">{errors.raza}</p>}
            </div>
          </div>

          <div className="sv-form-row sv-form-row--3">
            <div className="sv-field">
              <label className="sv-field__label">Edad (meses) <span className="sv-field__required">*</span></label>
              <input
                type="number" className="sv-field__input"
                value={formData.edad || ''}
                onChange={e => update('edad', Number(e.target.value))}
                placeholder="Ej: 24" min={1} max={300}
              />
              {formData.edad > 0 && <p className="sv-field__helper">{formatAge(formData.edad)}</p>}
              {errors.edad && <p className="sv-field__error">{errors.edad}</p>}
            </div>
            <div className="sv-field">
              <label className="sv-field__label">Peso (kg)</label>
              <input
                type="number" className="sv-field__input"
                value={formData.pesoKg ?? ''}
                onChange={e => update('pesoKg', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Opcional" min={0.5} max={100} step={0.1}
              />
              <p className="sv-field__helper">Kilogramos · opcional</p>
            </div>
            <div />
          </div>
        </div>
      </div>

      {/* ── Características ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">pets</span>
          </div>
          <span className="sv-form-section__header-text">Características</span>
        </div>
        <div className="sv-form-section__body">
          <div className="sv-field">
            <label className="sv-field__label">Sexo <span className="sv-field__required">*</span></label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {SEXES.map(s => (
                <button key={s.value} type="button" onClick={() => update('sexo', s.value)} style={pill(formData.sexo === s.value)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
            {errors.sexo && <p className="sv-field__error">{errors.sexo}</p>}
          </div>

          <div className="sv-field">
            <label className="sv-field__label">Tamaño <span className="sv-field__required">*</span></label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {SIZES.map(s => (
                <button key={s.value} type="button" onClick={() => update('tamano', s.value)} style={pill(formData.tamano === s.value)}>
                  {s.label}
                  <span style={{ fontSize: '0.72rem', opacity: 0.65 }}>{s.sub}</span>
                </button>
              ))}
            </div>
            {errors.tamano && <p className="sv-field__error">{errors.tamano}</p>}
          </div>

          <div className="sv-field">
            <label className="sv-field__label">Nivel de energía <span className="sv-field__required">*</span></label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {ENERGIES.map(e => (
                <button key={e.value} type="button" onClick={() => update('nivelEnergia', e.value)} style={pill(formData.nivelEnergia === e.value)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{e.icon}</span>
                  {e.label}
                </button>
              ))}
            </div>
            {errors.nivelEnergia && <p className="sv-field__error">{errors.nivelEnergia}</p>}
          </div>
        </div>
      </div>

      {/* ── Descripción ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">description</span>
          </div>
          <span className="sv-form-section__header-text">Descripción</span>
        </div>
        <div className="sv-form-section__body">
          <div className="sv-field">
            <label className="sv-field__label">Descripción <span className="sv-field__required">*</span></label>
            <textarea
              className="sv-field__textarea"
              value={formData.descripcion}
              onChange={e => update('descripcion', e.target.value)}
              placeholder="Cuéntanos sobre la personalidad, historia y necesidades especiales de este perro..."
              rows={5} maxLength={1000} style={{ minHeight: 120 }}
            />
            <p className="sv-field__helper">{formData.descripcion.length}/1000 caracteres</p>
            {errors.descripcion && <p className="sv-field__error">{errors.descripcion}</p>}
          </div>
        </div>
      </div>
    </>
  )
}
