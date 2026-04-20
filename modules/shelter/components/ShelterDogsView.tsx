// modules/shelter/components/ShelterDogsView.tsx
// Archivo 175 — Tabla de gestión del catálogo de perros del refugio.
// Columnas: thumbnail · nombre · raza/edad/tamaño · estado · solicitudes · acciones
// Acciones: editar · publicar/despublicar · eliminar (con ConfirmDialog)
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useEffect, useState } from 'react'

import { useShelterDogs }      from '../application/hooks/useShelterDogs'
import type { DogStatusFilter } from '../application/hooks/useShelterDogs'
import type { DogListItem }    from '@/modules/shared/domain/Dog'
import { shelterService }      from '../infrastructure/ShelterServiceFactory'
import '../styles/shelterDashboard.css'
import '../styles/shelterViews.css'

const CURRENT_SHELTER_ID = "1"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOG_STATUS_LABELS: Record<string, string> = {
  disponible:    'Disponible',
  en_proceso:    'En proceso',
  adoptado:      'Adoptado',
  no_disponible: 'No disponible',
}

const DOG_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  disponible:    { bg: '#dcfce7', color: '#16a34a' },
  en_proceso:    { bg: '#fef9c3', color: '#854d0e' },
  adoptado:      { bg: '#fce7f3', color: '#9d174d' },
  no_disponible: { bg: '#f4f4f5', color: '#71717a' },
}

function formatAge(meses: number): string {
  if (meses < 12) return `${meses}m`
  const y = Math.floor(meses / 12)
  return `${y} año${y !== 1 ? 's' : ''}`
}

const SIZE_LABELS: Record<string, string> = {
  pequeño: 'Pequeño',
  mediano: 'Mediano',
  grande:  'Grande',
  gigante: 'Gigante',
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

function ConfirmDialog({
  dog,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  dog:        DogListItem
  onConfirm:  () => void
  onCancel:   () => void
  isDeleting: boolean
}) {
  return (
    /* Backdrop */
    <div
      style={{
        position:   'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onCancel}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '1.25rem',
          padding: '1.75rem', maxWidth: 400, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        {/* Icono de advertencia */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: '#fee2e2', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#dc2626' }}>
            delete_forever
          </span>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#18181b', marginBottom: '0.5rem' }}>
          Eliminar perro
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#52525b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          ¿Seguro que quieres eliminar a <strong>{dog.nombre}</strong>?
          Esta acción no se puede deshacer.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              padding: '0.55rem 1.1rem', borderRadius: 999,
              border: '1.5px solid #e4e4e7', background: '#fff',
              fontSize: '0.85rem', fontWeight: 800, color: '#374151',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '0.55rem 1.1rem', borderRadius: 999,
              border: 'none', background: '#dc2626',
              fontSize: '0.85rem', fontWeight: 900, color: '#fff',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}
          >
            {isDeleting && (
              <span className="material-symbols-outlined" style={{ fontSize: 14, animation: 'spin 1s linear infinite' }}>
                progress_activity
              </span>
            )}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Fila de la tabla ─────────────────────────────────────────────────────────

function DogRow({
  dog,
  solicitudesCount,
  onDelete,
  onTogglePublish,
  isToggling,
}: {
  dog:              DogListItem
  solicitudesCount: number
  onDelete:         (dog: DogListItem) => void
  onTogglePublish:  (id: string) => void
  isToggling:       boolean
}) {
  const statusStyle = DOG_STATUS_COLORS[dog.estado] ?? { bg: '#f4f4f5', color: '#71717a' }
  const isPublished = dog.estado === 'disponible'
  const canToggle   = dog.estado !== 'adoptado' && dog.estado !== 'en_proceso'

  return (
    <tr>
      {/* Thumbnail */}
      <td>
        <div style={{ width: 44, height: 44, borderRadius: '0.6rem', overflow: 'hidden',
          flexShrink: 0, border: '1.5px solid #f0f0f0', position: 'relative',
          background: '#f9fafb' }}>
          {dog.foto ? (
            <Image src={dog.foto} alt={dog.nombre} fill style={{ objectFit: 'cover' }} sizes="44px" />
          ) : (
            <span className="material-symbols-outlined"
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22, color: '#d4d4d8' }}>
              pets
            </span>
          )}
        </div>
      </td>

      {/* Nombre */}
      <td>
        <span style={{ fontWeight: 900, color: '#18181b', fontSize: '0.85rem' }}>{dog.nombre}</span>
      </td>

      {/* Raza / Edad / Tamaño */}
      <td>
        <div style={{ fontSize: '0.78rem', color: '#52525b', lineHeight: 1.4 }}>
          <span style={{ fontWeight: 700 }}>{dog.raza}</span>
          <br />
          <span style={{ color: '#a1a1aa' }}>
            {formatAge(dog.edad)} · {SIZE_LABELS[dog.tamano] ?? dog.tamano}
            {' · '}{dog.sexo === 'macho' ? 'Macho' : 'Hembra'}
          </span>
        </div>
      </td>

      {/* Estado badge */}
      <td>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '3px 10px', borderRadius: 999,
          fontSize: '0.72rem', fontWeight: 900,
          background: statusStyle.bg, color: statusStyle.color,
          whiteSpace: 'nowrap',
        }}>
          {DOG_STATUS_LABELS[dog.estado] ?? dog.estado}
        </span>
      </td>

      {/* Solicitudes recibidas */}
      <td style={{ textAlign: 'center' }}>
        {solicitudesCount > 0 ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,107,107,0.1)', color: '#ff6b6b',
            fontSize: '0.78rem', fontWeight: 900,
          }}>
            {solicitudesCount}
          </span>
        ) : (
          <span style={{ color: '#d4d4d8', fontSize: '0.8rem' }}>—</span>
        )}
      </td>

      {/* Acciones */}
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Editar */}
          <Link
            href={`/refugio/perros/${dog.id}/editar`}
            title="Editar"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: '0.5rem',
              background: '#f4f4f5', color: '#52525b', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
          </Link>

          {/* Publicar / Despublicar */}
          {canToggle && (
            <button
              onClick={() => onTogglePublish(dog.id)}
              disabled={isToggling}
              title={isPublished ? 'Despublicar' : 'Publicar'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: '0.5rem', border: 'none',
                background: isPublished ? '#fef9c3' : '#dcfce7',
                color:      isPublished ? '#854d0e'  : '#16a34a',
                cursor: isToggling ? 'not-allowed' : 'pointer',
                opacity: isToggling ? 0.6 : 1,
                transition: 'background 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {isPublished ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}

          {/* Eliminar */}
          <button
            onClick={() => onDelete(dog)}
            title="Eliminar"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: '0.5rem', border: 'none',
              background: '#fee2e2', color: '#dc2626',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="sd-card">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="sd-skel-row" style={{ margin: '0.5rem 1.25rem' }} />
      ))}
    </div>
  )
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { label: string; value: DogStatusFilter }[] = [
  { label: 'Todos',          value: 'all' },
  { label: 'Disponibles',    value: 'disponible' },
  { label: 'En proceso',     value: 'en_proceso' },
  { label: 'Adoptados',      value: 'adoptado' },
  { label: 'No disponibles', value: 'no_disponible' },
]

// ─── View ─────────────────────────────────────────────────────────────────────

export default function ShelterDogsView() {
  const {
    dogs, isLoading, error,
    statusFilter, search,
    setStatusFilter, setSearch,
    deleteDog, togglePublish,
  } = useShelterDogs()

  // Mapa perroId → cantidad de solicitudes
  const [reqCountMap, setReqCountMap] = useState<Map<string, number>>(new Map())
  useEffect(() => {
    shelterService.getShelterRequests(CURRENT_SHELTER_ID).then(reqs => {
      const map = new Map<string, number>()
      reqs.forEach(r => map.set(r.perroId, (map.get(r.perroId) ?? 0) + 1))
      setReqCountMap(map)
    }).catch(() => { /* silencioso */ })
  }, [])

  // Estado del ConfirmDialog
  const [confirmDog,  setConfirmDog]  = useState<DogListItem | null>(null)
  const [isDeleting,  setIsDeleting]  = useState(false)
  const [togglingId,  setTogglingId]  = useState<string | null>(null)

  const handleDeleteRequest = (dog: DogListItem) => setConfirmDog(dog)

  const handleDeleteConfirm = async () => {
    if (!confirmDog) return
    setIsDeleting(true)
    try {
      await deleteDog(confirmDog.id)
    } finally {
      setIsDeleting(false)
      setConfirmDog(null)
    }
  }

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id)
    try {
      await togglePublish(id)
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <>
      {/* Barra superior */}
      <div className="sv-toolbar">
        {/* Búsqueda */}
        <div className="sv-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            className="sv-search__input"
            placeholder="Buscar por nombre o raza..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="sv-filters">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`sv-filter-chip${statusFilter === opt.value ? ' sv-filter-chip--active' : ''}`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* + Nuevo perro */}
        <Link
          href="/refugio/perros/nuevo"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.45rem 1rem', borderRadius: 999,
            background: '#ff6b6b', color: '#fff',
            fontSize: '0.8rem', fontWeight: 900,
            textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 'auto',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          Nuevo perro
        </Link>
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
      )}

      {/* Tabla */}
      {isLoading ? (
        <Skeleton />
      ) : dogs.length === 0 ? (
        <div className="sv-empty">
          <span className="material-symbols-outlined">pets</span>
          <p className="sv-empty__title">Sin perros</p>
          <p className="sv-empty__sub">
            {search || statusFilter !== 'all'
              ? 'No hay perros que coincidan con los filtros'
              : 'Aún no tienes perros registrados'}
          </p>
        </div>
      ) : (
        <div className="sd-card sv-table-wrap">
          <table className="sv-dogs-table">
            <thead>
              <tr>
                <th style={{ width: 52 }}></th>
                <th>Nombre</th>
                <th>Raza / Edad / Talla</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Solicitudes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map(dog => (
                <DogRow
                  key={dog.id}
                  dog={dog}
                  solicitudesCount={reqCountMap.get(dog.id) ?? 0}
                  onDelete={handleDeleteRequest}
                  onTogglePublish={handleTogglePublish}
                  isToggling={togglingId === dog.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ConfirmDialog */}
      {confirmDog && (
        <ConfirmDialog
          dog={confirmDog}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setConfirmDog(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}
