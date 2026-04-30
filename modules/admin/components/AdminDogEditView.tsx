// modules/admin/components/AdminDogEditView.tsx
// Vista de moderación de un perro específico: info básica + cambio de estado.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useMemo, useState } from 'react'
import { useAdminDogs }      from '../application/hooks/useAdminDogs'
import type { Dog, DogStatus } from '@/modules/shared/domain/Dog'
import '@/modules/shelter/styles/shelterDashboard.css'
import '../styles/admin.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: DogStatus; label: string }[] = [
  { value: 'disponible',    label: 'Disponible (publicado)' },
  { value: 'no_disponible', label: 'No disponible (oculto)' },
  { value: 'en_proceso',    label: 'En proceso de adopción' },
  { value: 'adoptado',      label: 'Adoptado' },
]

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  disponible:    { bg: '#dcfce7', color: '#16a34a' },
  en_proceso:    { bg: '#fef9c3', color: '#854d0e' },
  adoptado:      { bg: '#ede9fe', color: '#5b21b6' },
  no_disponible: { bg: '#f4f4f5', color: '#71717a' },
}

function formatAge(meses: number): string {
  if (meses < 12) return `${meses} meses`
  const y = Math.floor(meses / 12)
  return `${y} año${y !== 1 ? 's' : ''}`
}

// ─── Dog detail card ──────────────────────────────────────────────────────────

function DogCard({ dog }: { dog: Dog }) {
  const c = STATUS_COLORS[dog.estado] ?? { bg: '#f4f4f5', color: '#71717a' }

  return (
    <div className="sd-card" style={{ marginBottom: '1.25rem', overflow: 'hidden' }}>
      {/* Foto de portada */}
      <div style={{ position: 'relative', height: 160, background: '#f4f4f5' }}>
        {dog.foto && (
          <Image
            src={dog.foto}
            alt={dog.nombre}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        )}
        {/* Badge de estado */}
        <span
          style={{
            position:     'absolute',
            top:          '0.75rem',
            right:        '0.75rem',
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '0.3rem',
            padding:      '0.3rem 0.75rem',
            borderRadius: 999,
            fontSize:     '0.72rem',
            fontWeight:   900,
            background:   c.bg,
            color:        c.color,
          }}
        >
          {STATUS_OPTIONS.find(o => o.value === dog.estado)?.label ?? dog.estado}
        </span>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#18181b', margin: '0 0 0.25rem' }}>
          {dog.nombre}
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#71717a', fontWeight: 600, margin: '0 0 1rem' }}>
          {dog.raza} · {formatAge(dog.edad)} · {dog.sexo} · {dog.tamano}
        </p>

        {/* Info rows */}
        {[
          { label: 'Refugio',      value: dog.refugioNombre ?? '—' },
          { label: 'Ciudad',       value: dog.refugioCiudad ?? '—' },
          { label: 'Descripción',  value: dog.descripcion },
          { label: 'Salud',        value: dog.salud },
          { label: 'Castrado',     value: dog.castrado ? 'Sí' : 'No' },
          { label: 'Microchip',    value: dog.microchip ? 'Sí' : 'No' },
          { label: 'Apto niños',   value: dog.aptoNinos ? 'Sí' : 'No' },
          { label: 'Apto perros',  value: dog.aptoPerros ? 'Sí' : 'No' },
          { label: 'Apto gatos',   value: dog.aptoGatos ? 'Sí' : 'No' },
          { label: 'Vacunas',      value: dog.vacunas.map(v => v.nombre).join(', ') || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="ad-info-row">
            <span className="ad-info-row__label">{label}</span>
            <span className="ad-info-row__value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Panel de moderación ──────────────────────────────────────────────────────

function ModerationPanel({
  dog,
  isUpdating,
  onSave,
}: {
  dog:        Dog
  isUpdating: boolean
  onSave:     (status: DogStatus) => void
}) {
  const [selectedStatus, setSelectedStatus] = useState<DogStatus>(dog.estado)
  const [saved,          setSaved]          = useState(false)

  function handleSave() {
    onSave(selectedStatus)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="sd-card">
      <div className="sd-card__header">
        <p className="sd-card__title">
          <span className="material-symbols-outlined">tune</span>
          Moderar perro
        </p>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {saved && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1rem', borderRadius: '0.75rem',
            background: '#dcfce7', border: '1.5px solid #bbf7d0',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#16a34a', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>Estado actualizado</p>
          </div>
        )}

        {/* Select de estado */}
        <div className="ad-field">
          <label className="ad-field__label">Estado del perro</label>
          <select
            className="ad-status-select"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as DogStatus)}
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Info note */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
          padding: '0.75rem', background: '#f0f9ff', borderRadius: '0.75rem',
          border: '1.5px solid #bae6fd',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#0369a1', flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }}>info</span>
          <p style={{ fontSize: '0.75rem', color: '#0c4a6e', fontWeight: 500, lineHeight: 1.5 }}>
            "Disponible" publica el perfil en el catálogo público. "No disponible" lo oculta sin eliminarlo.
          </p>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || selectedStatus === dog.estado}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '0.4rem',
            padding:        '0.6rem 1.25rem',
            borderRadius:   999,
            border:         'none',
            background:     (isUpdating || selectedStatus === dog.estado) ? '#f4f4f5' : '#ff6b6b',
            color:          (isUpdating || selectedStatus === dog.estado) ? '#a1a1aa' : '#fff',
            fontSize:       '0.85rem',
            fontWeight:     900,
            cursor:         (isUpdating || selectedStatus === dog.estado) ? 'not-allowed' : 'pointer',
            fontFamily:     'inherit',
            transition:     'background 150ms ease',
          }}
        >
          {isUpdating ? (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 16, animation: 'spin 1s linear infinite' }}>progress_activity</span>
              Guardando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
              Guardar cambios
            </>
          )}
        </button>

        {/* Back link */}
        <Link
          href="/admin/perros"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '0.35rem',
            fontSize:       '0.78rem',
            fontWeight:     700,
            color:          '#71717a',
            textDecoration: 'none',
            marginTop:      '0.25rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
          Volver a perros
        </Link>

      </div>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function AdminDogEditView({ id }: { id: string }) {
  const { dogs, isLoading, isUpdating, updateStatus } = useAdminDogs()
  const dog = useMemo(() => dogs.find(d => d.id === id) ?? null, [dogs, id])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {[200, 280].map((h, i) => (
          <div key={i} style={{ height: h, borderRadius: '1.2rem', background: '#f4f4f5', animation: 'ad-shimmer 1.4s infinite' }} />
        ))}
      </div>
    )
  }

  if (!dog) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#d4d4d8', display: 'block', marginBottom: 8 }}>pets</span>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#71717a' }}>Perro no encontrado</p>
        <Link href="/admin/perros" style={{ fontSize: '0.82rem', color: '#ff6b6b', fontWeight: 800, textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', alignItems: 'start' }}>
      <style>{`@media (min-width: 900px) { .admin-dog-edit-grid { grid-template-columns: 1fr 320px !important; } }`}</style>
      <div className="admin-dog-edit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', alignItems: 'start' }}>
        <DogCard dog={dog} />
        <ModerationPanel
          dog={dog}
          isUpdating={isUpdating}
          onSave={status => updateStatus(dog.id, status)}
        />
      </div>
    </div>
  )
}
