// modules/shared/components/forms/VaccinationFormTable.tsx
// 'use client' — Tabla editable de vacunas.
// Props: value: Vaccination[], onChange
// Filas: nombre (Input), fecha aplicada (date), próxima dosis (date), X eliminar
// Footer: botón "+ Agregar vacuna"
// Usa el tipo Vaccination de VaccinationCard.tsx y el estilo visual de back.jpg
'use client'

import { type Vaccination } from '../dog/VaccinationCard'

// ─── Props ────────────────────────────────────────────────────────────────────

interface VaccinationFormTableProps {
  value:    Vaccination[]
  onChange: (next: Vaccination[]) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return `vac-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function emptyRow(): Vaccination {
  return { id: genId(), nombre: '', fecha: '', vencimiento: '' }
}

// ─── Estilos compartidos de input ─────────────────────────────────────────────
// Replica el look de Input.tsx sin el wrapper label/error

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  borderRadius: 10,
  border: '1.5px solid #e5e7eb',
  background: '#f9fafb',
  color: '#111827',
  fontSize: '0.82rem',
  fontWeight: 600,
  padding: '7px 10px',
  outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
  fontFamily: 'inherit',
}

// ─── Sub-componente: celda de input ──────────────────────────────────────────

function CellInput({
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  value:       string
  onChange:    (v: string) => void
  type?:       'text' | 'date'
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={INPUT_BASE}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'var(--brand, #ff6b6b)'
        e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(255,107,107,0.18)'
        e.currentTarget.style.background  = '#fff'
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow   = 'none'
        e.currentTarget.style.background  = '#f9fafb'
      }}
    />
  )
}

// ─── Component principal ──────────────────────────────────────────────────────

export function VaccinationFormTable({ value, onChange }: VaccinationFormTableProps) {

  function updateRow(id: string, patch: Partial<Vaccination>) {
    onChange(value.map(v => v.id === id ? { ...v, ...patch } : v))
  }

  function removeRow(id: string) {
    onChange(value.filter(v => v.id !== id))
  }

  function addRow() {
    onChange([...value, emptyRow()])
  }

  return (
    <div
      style={{
        borderRadius: '1.25rem',
        padding: 10,
        backgroundImage: "url('/assets/ui/back.jpg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '180px auto',
        boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '13px 16px 11px',
            borderBottom: '1px solid #f4f4f5',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: '#fff5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18, color: '#ff6b6b',
                fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18",
              }}
            >
              vaccines
            </span>
          </div>
          <div>
            <p style={{ fontSize: '0.92rem', fontWeight: 900, color: '#18181b', margin: 0, lineHeight: 1.2 }}>
              Historial de vacunación
            </p>
            <p style={{ fontSize: '0.73rem', fontWeight: 600, color: '#a1a1aa', margin: 0 }}>
              {value.length === 0 ? 'Sin vacunas registradas' : `${value.length} ${value.length === 1 ? 'vacuna' : 'vacunas'}`}
            </p>
          </div>
        </div>

        {/* ── Cabecera de columnas (solo si hay filas) ── */}
        {value.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 140px 36px',
              gap: 8,
              padding: '8px 14px 6px',
              background: '#fafafa',
              borderBottom: '1px solid #f4f4f5',
            }}
          >
            {['Nombre de la vacuna', 'Fecha aplicada', 'Próxima dosis', ''].map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.68rem', fontWeight: 900,
                  color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* ── Filas de vacunas ── */}
        {value.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 36, color: '#e5e7eb', display: 'block', marginBottom: 6,
                fontVariationSettings: "'FILL' 1",
              }}
            >
              vaccines
            </span>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 600, margin: 0 }}>
              Sin vacunas registradas. Agrega la primera.
            </p>
          </div>
        ) : (
          <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {value.map((vac, idx) => (
              <div
                key={vac.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px 140px 36px',
                  gap: 8,
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: '0.75rem',
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                  transition: 'border-color 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#ffe4e4')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#f0f0f0')}
              >
                {/* Número de fila + input nombre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    flexShrink: 0,
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#ff6b6b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 900, color: '#fff',
                  }}>
                    {idx + 1}
                  </span>
                  <CellInput
                    value={vac.nombre}
                    onChange={v => updateRow(vac.id, { nombre: v })}
                    placeholder="Ej: Rabia, Parvovirus…"
                  />
                </div>

                {/* Fecha aplicada */}
                <CellInput
                  type="date"
                  value={vac.fecha ?? ''}
                  onChange={v => updateRow(vac.id, { fecha: v })}
                />

                {/* Próxima dosis (vencimiento) */}
                <CellInput
                  type="date"
                  value={vac.vencimiento ?? ''}
                  onChange={v => updateRow(vac.id, { vencimiento: v })}
                />

                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={() => removeRow(vac.id)}
                  aria-label={`Eliminar vacuna ${vac.nombre || idx + 1}`}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1.5px solid #fecaca',
                    background: '#fff5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 150ms ease, border-color 150ms ease, transform 150ms ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background    = '#fef2f2'
                    el.style.borderColor   = '#f87171'
                    el.style.transform     = 'scale(1.1)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background    = '#fff5f5'
                    el.style.borderColor   = '#fecaca'
                    el.style.transform     = 'scale(1)'
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, color: '#ef4444', fontVariationSettings: "'FILL' 1" }}
                  >
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer: botón agregar ── */}
        <div style={{ padding: '10px 14px 14px' }}>
          <button
            type="button"
            onClick={addRow}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 16px',
              borderRadius: '0.85rem',
              border: '1.5px dashed #fca5a5',
              background: 'transparent',
              color: '#ff6b6b',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'background 150ms ease, border-color 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background   = '#fff5f5'
              el.style.borderColor  = '#f87171'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background   = 'transparent'
              el.style.borderColor  = '#fca5a5'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, fontVariationSettings: "'FILL' 0,'wght' 500" }}
            >
              add
            </span>
            Agregar vacuna
          </button>
        </div>

      </div>
    </div>
  )
}
