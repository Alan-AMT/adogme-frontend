// modules/admin/components/AdminDogsView.tsx
// Archivo 204 — Tabla global de perros. Filtros de calidad: sin vacuna rabia,
// sin esterilización, solo publicados. Acciones: publicar/despublicar, editar.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useMemo, useState } from 'react'
import { useAdminDogs }      from '../application/hooks/useAdminDogs'
import type { Dog }          from '@/modules/shared/domain/Dog'
import '../styles/admin.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  disponible:    'Disponible',
  en_proceso:    'En proceso',
  adoptado:      'Adoptado',
  no_disponible: 'No publicado',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  disponible:    { bg: '#dcfce7', color: '#16a34a' },
  en_proceso:    { bg: '#fef9c3', color: '#854d0e' },
  adoptado:      { bg: '#ede9fe', color: '#5b21b6' },
  no_disponible: { bg: '#f4f4f5', color: '#71717a' },
}

function formatAge(meses: number): string {
  if (meses < 12) return `${meses} m`
  const y = Math.floor(meses / 12)
  return `${y} año${y !== 1 ? 's' : ''}`
}

function hasRabiesVaccine(dog: Dog): boolean {
  return dog.vacunas.some(v => v.nombre.toLowerCase().includes('rabia'))
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="ad-card" style={{ marginTop: '1.5rem' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="ad-skel-row" />
      ))}
    </div>
  )
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active:  boolean
  icon:    string
  label:   string
  count:   number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '0.35rem',
        padding:      '0.4rem 0.9rem',
        borderRadius: 999,
        border:       active ? '1.5px solid rgba(255,107,107,0.35)' : '1.5px solid #e4e4e7',
        background:   active ? 'rgba(255,107,107,0.08)' : '#fafafa',
        fontSize:     '0.78rem',
        fontWeight:   800,
        color:        active ? '#ff6b6b' : '#52525b',
        cursor:       'pointer',
        fontFamily:   'inherit',
        transition:   'all 150ms ease',
        whiteSpace:   'nowrap',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      {label}
      {count > 0 && (
        <span
          style={{
            fontSize:    '0.68rem',
            fontWeight:  900,
            padding:     '0.1rem 0.4rem',
            borderRadius: 999,
            background:  active ? 'rgba(255,107,107,0.15)' : '#f0f0f0',
            color:       active ? '#ff6b6b' : '#71717a',
          }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// ─── Status badge inline ──────────────────────────────────────────────────────

function DogStatusBadge({ estado }: { estado: string }) {
  const c = STATUS_COLORS[estado] ?? { bg: '#f4f4f5', color: '#71717a' }
  return (
    <span
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '0.25rem',
        padding:      '0.25rem 0.65rem',
        borderRadius: 999,
        fontSize:     '0.72rem',
        fontWeight:   900,
        whiteSpace:   'nowrap',
        background:   c.bg,
        color:        c.color,
      }}
    >
      {STATUS_LABELS[estado] ?? estado}
    </span>
  )
}

// ─── Tabla de perros ──────────────────────────────────────────────────────────

function DogsTable({
  dogs,
  isUpdating,
  onTogglePublish,
}: {
  dogs:            Dog[]
  isUpdating:      boolean
  onTogglePublish: (dog: Dog) => void
}) {
  if (dogs.length === 0) {
    return (
      <div className="ad-empty">
        <span className="material-symbols-outlined" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>pets</span>
        No hay perros que coincidan con los filtros
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="ad-table">
        <thead>
          <tr>
            <th>Perro</th>
            <th>Refugio</th>
            <th>Info</th>
            <th>Estado</th>
            <th style={{ textAlign: 'center' }}>Rabia</th>
            <th style={{ textAlign: 'center' }}>Castrado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map(dog => {
            const canToggle  = dog.estado === 'disponible' || dog.estado === 'no_disponible'
            const isPublished = dog.estado !== 'no_disponible'
            const hasRabies  = hasRabiesVaccine(dog)

            return (
              <tr key={dog.id}>
                {/* Foto + nombre */}
                <td>
                  <div className="ad-shelter-cell">
                    <div
                      style={{
                        position:     'relative',
                        width:        40,
                        height:       40,
                        borderRadius: '0.65rem',
                        overflow:     'hidden',
                        flexShrink:   0,
                        border:       '1.5px solid #f0f0f0',
                        background:   '#fafafa',
                      }}
                    >
                      {dog.foto ? (
                        <Image
                          src={dog.foto}
                          alt={dog.nombre}
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            position:  'absolute',
                            inset:     0,
                            display:   'flex',
                            alignItems:'center',
                            justifyContent: 'center',
                            fontSize:  20,
                            color:     '#d4d4d8',
                          }}
                        >
                          pets
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="ad-shelter-cell__name">{dog.nombre}</p>
                      <p className="ad-shelter-cell__city">#{dog.id}</p>
                    </div>
                  </div>
                </td>

                {/* Refugio */}
                <td>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#18181b' }}>
                    {dog.refugioNombre ?? '—'}
                  </p>
                  {dog.refugioCiudad && (
                    <p style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>
                      {dog.refugioCiudad}
                    </p>
                  )}
                </td>

                {/* Raza / edad / tamaño */}
                <td>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>{dog.raza}</p>
                  <p style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>
                    {formatAge(dog.edad)} · {dog.tamano} · {dog.sexo}
                  </p>
                </td>

                {/* Estado */}
                <td>
                  <DogStatusBadge estado={dog.estado} />
                </td>

                {/* Vacuna rabia */}
                <td style={{ textAlign: 'center' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 18,
                      color:    hasRabies ? '#16a34a' : '#dc2626',
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {hasRabies ? 'verified' : 'cancel'}
                  </span>
                </td>

                {/* Castrado */}
                <td style={{ textAlign: 'center' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 18,
                      color:    dog.castrado ? '#16a34a' : '#dc2626',
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {dog.castrado ? 'verified' : 'cancel'}
                  </span>
                </td>

                {/* Acciones */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    {/* Publicar / Despublicar */}
                    {canToggle && (
                      <button
                        type="button"
                        onClick={() => onTogglePublish(dog)}
                        disabled={isUpdating}
                        title={isPublished ? 'Despublicar' : 'Publicar'}
                        style={{
                          display:        'inline-flex',
                          alignItems:     'center',
                          gap:            '0.25rem',
                          padding:        '0.3rem 0.65rem',
                          borderRadius:   0.5 * 16,
                          border:         'none',
                          background:     isPublished ? '#fee2e2' : '#dcfce7',
                          color:          isPublished ? '#dc2626' : '#16a34a',
                          fontSize:       '0.75rem',
                          fontWeight:     900,
                          cursor:         isUpdating ? 'not-allowed' : 'pointer',
                          opacity:        isUpdating ? 0.6 : 1,
                          fontFamily:     'inherit',
                          whiteSpace:     'nowrap',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                          {isPublished ? 'visibility_off' : 'visibility'}
                        </span>
                        {isPublished ? 'Ocultar' : 'Publicar'}
                      </button>
                    )}

                    {/* Editar */}
                    <Link
                      href={`/admin/perros/${dog.id}/editar`}
                      className="ad-action-link"
                    >
                      <span className="material-symbols-outlined">edit</span>
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function AdminDogsView() {
  const { dogs, isLoading, isUpdating, error, updateStatus } = useAdminDogs()

  const [search,           setSearch]           = useState('')
  const [sinRabia,         setSinRabia]         = useState(false)
  const [sinEsterilizacion,setSinEsterilizacion] = useState(false)
  const [soloPublicados,   setSoloPublicados]   = useState(false)

  // Conteos para los chips (siempre sobre la lista completa, sin los filtros activos)
  const countSinRabia         = dogs.filter(d => !hasRabiesVaccine(d)).length
  const countSinEsterilizacion = dogs.filter(d => !d.castrado).length
  const countPublicados       = dogs.filter(d => d.estado !== 'no_disponible').length

  const filtered = useMemo(() => {
    let result = dogs

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.nombre.toLowerCase().includes(q) ||
        d.raza.toLowerCase().includes(q) ||
        (d.refugioNombre?.toLowerCase().includes(q) ?? false)
      )
    }

    if (sinRabia)          result = result.filter(d => !hasRabiesVaccine(d))
    if (sinEsterilizacion) result = result.filter(d => !d.castrado)
    if (soloPublicados)    result = result.filter(d => d.estado !== 'no_disponible')

    return result
  }, [dogs, search, sinRabia, sinEsterilizacion, soloPublicados])

  function handleTogglePublish(dog: Dog) {
    const next = dog.estado === 'no_disponible' ? 'disponible' : 'no_disponible'
    updateStatus(dog.id, next)
  }

  if (isLoading) return <Skeleton />

  if (error) {
    return (
      <p style={{ color: '#dc2626', fontSize: '0.85rem', padding: '1rem' }}>{error}</p>
    )
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="ad-toolbar">
        {/* Búsqueda */}
        <div className="ad-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            className="ad-search__input"
            placeholder="Buscar por nombre, raza o refugio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a1a1aa' }}>close</span>
            </button>
          )}
        </div>

        {/* Filtros de calidad */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <FilterChip
            active={sinRabia}
            icon="vaccines"
            label="Sin vacuna rabia"
            count={countSinRabia}
            onClick={() => setSinRabia(v => !v)}
          />
          <FilterChip
            active={sinEsterilizacion}
            icon="cut"
            label="Sin esterilizar"
            count={countSinEsterilizacion}
            onClick={() => setSinEsterilizacion(v => !v)}
          />
          <FilterChip
            active={soloPublicados}
            icon="visibility"
            label="Solo publicados"
            count={countPublicados}
            onClick={() => setSoloPublicados(v => !v)}
          />
        </div>

        {/* Conteo */}
        <p style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {filtered.length} de {dogs.length} perro{dogs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Tabla ── */}
      <div className="ad-card">
        <DogsTable
          dogs={filtered}
          isUpdating={isUpdating}
          onTogglePublish={handleTogglePublish}
        />
      </div>
    </>
  )
}
