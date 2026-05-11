// modules/shelter/components/ShelterDogsView.tsx
// Archivo 175 — Tabla de gestión del catálogo de perros del refugio.
// Columnas: thumbnail · nombre · raza/edad/tamaño · estado · solicitudes · acciones
// Acciones: editar · publicar/despublicar · eliminar (con ConfirmDialog)
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useShelterDogs }      from '../application/hooks/useShelterDogs'
import { useToast }            from '@/modules/shared/application/hooks/useToast'
import type { DogStatusFilter } from '../application/hooks/useShelterDogs'
import type { DogListItem, DogStatus } from '@/modules/shared/domain/Dog'
import '../styles/shelterDashboard.css'
import '../styles/shelterViews.css'

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

// ─── StatusConfirmDialog ──────────────────────────────────────────────────────

function StatusConfirmDialog({
  dog,
  targetStatus,
  onConfirm,
  onCancel,
  isUpdating,
}: {
  dog:          DogListItem
  targetStatus: DogStatus
  onConfirm:    () => void
  onCancel:     () => void
  isUpdating:   boolean
}) {
  const statusStyle = DOG_STATUS_COLORS[targetStatus] ?? { bg: '#f4f4f5', color: '#71717a' }
  const statusLabel = DOG_STATUS_LABELS[targetStatus] ?? targetStatus

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '1.25rem',
          padding: '1.75rem', maxWidth: 400, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: statusStyle.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 26, color: statusStyle.color }}>
            swap_horiz
          </span>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#18181b', marginBottom: '0.5rem' }}>
          Cambiar estado
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#52525b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          ¿Cambiar el estado de <strong>{dog.nombre}</strong> a{' '}
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 8px', borderRadius: 999,
            fontSize: '0.78rem', fontWeight: 900,
            background: statusStyle.bg, color: statusStyle.color,
          }}>
            {statusLabel}
          </span>
          ?
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={isUpdating}
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
            disabled={isUpdating}
            style={{
              padding: '0.55rem 1.1rem', borderRadius: 999,
              border: 'none', background: statusStyle.color,
              fontSize: '0.85rem', fontWeight: 900, color: '#fff',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              opacity: isUpdating ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}
          >
            {isUpdating && (
              <span className="material-symbols-outlined" style={{ fontSize: 14, animation: 'spin 1s linear infinite' }}>
                progress_activity
              </span>
            )}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Fila de la tabla ─────────────────────────────────────────────────────────

const STATUS_OPTIONS: DogStatus[] = ['disponible', 'en_proceso', 'adoptado', 'no_disponible']

function DogRow({
  dog,
  onDelete,
  onStatusChange,
}: {
  dog:            DogListItem
  onDelete:       (dog: DogListItem) => void
  onStatusChange: (dog: DogListItem, status: DogStatus) => void
}) {
  const statusStyle = DOG_STATUS_COLORS[dog.estado] ?? { bg: '#f4f4f5', color: '#71717a' }
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

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

          {/* Cambiar estado */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              title="Cambiar estado"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: '0.5rem', border: 'none',
                background: '#eff6ff', color: '#3b82f6',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>swap_horiz</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 100,
                background: '#fff', borderRadius: '0.75rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #f0f0f0',
                minWidth: 160, overflow: 'hidden',
              }}>
                {STATUS_OPTIONS.map(s => {
                  const style = DOG_STATUS_COLORS[s] ?? { bg: '#f4f4f5', color: '#71717a' }
                  const isCurrent = dog.estado === s
                  return (
                    <button
                      key={s}
                      disabled={isCurrent}
                      onClick={() => {
                        setDropdownOpen(false)
                        onStatusChange(dog, s)
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: '0.5rem', padding: '0.55rem 0.85rem',
                        border: 'none', background: isCurrent ? '#fafafa' : '#fff',
                        cursor: isCurrent ? 'default' : 'pointer',
                        textAlign: 'left', transition: 'background 0.1s',
                      }}
                    >
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: style.color, flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: '0.78rem', fontWeight: isCurrent ? 900 : 700,
                        color: isCurrent ? style.color : '#374151',
                      }}>
                        {DOG_STATUS_LABELS[s]}
                      </span>
                      {isCurrent && (
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: style.color, marginLeft: 'auto' }}>
                          check
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

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

// ─── Pagination helpers ───────────────────────────────────────────────────────

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  const left  = current - 2
  const right = current + 2
  if (left > 2)          pages.push('...')
  for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function ShelterDogsView() {
  const {
    dogs, isLoading, error,
    statusFilter, search, pagination,
    setStatusFilter, setSearch, setPage,
    deleteDog, updateDogStatus,
  } = useShelterDogs()
  const toast = useToast()

  // Estado del ConfirmDialog (eliminar)
  const [confirmDog,  setConfirmDog]  = useState<DogListItem | null>(null)
  const [isDeleting,  setIsDeleting]  = useState(false)

  // Estado del StatusConfirmDialog
  const [statusDog,       setStatusDog]       = useState<DogListItem | null>(null)
  const [pendingStatus,   setPendingStatus]   = useState<DogStatus | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const handleDeleteRequest = (dog: DogListItem) => setConfirmDog(dog)

  const handleDeleteConfirm = async () => {
    if (!confirmDog) return
    setIsDeleting(true)
    try {
      await deleteDog(confirmDog.id)
      toast.success(`${confirmDog.nombre} eliminado correctamente`)
    } catch {
      toast.error('No se pudo eliminar el perro. Intenta de nuevo.')
    } finally {
      setIsDeleting(false)
      setConfirmDog(null)
    }
  }

  const handleStatusSelect = (dog: DogListItem, status: DogStatus) => {
    setStatusDog(dog)
    setPendingStatus(status)
  }

  const handleStatusConfirm = async () => {
    if (!statusDog || !pendingStatus) return
    setIsUpdatingStatus(true)
    try {
      await updateDogStatus(statusDog.id, pendingStatus)
      toast.success(`Estado de ${statusDog.nombre} actualizado a ${DOG_STATUS_LABELS[pendingStatus]}`)
    } catch {
      toast.error('No se pudo cambiar el estado del perro.')
    } finally {
      setIsUpdatingStatus(false)
      setStatusDog(null)
      setPendingStatus(null)
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
        <>
          <div className="sd-card sv-table-wrap">
            <table className="sv-dogs-table">
              <thead>
                <tr>
                  <th style={{ width: 52 }}></th>
                  <th>Nombre</th>
                  <th>Raza / Edad / Talla</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {dogs.map(dog => (
                  <DogRow
                    key={dog.id}
                    dog={dog}
                    onDelete={handleDeleteRequest}
                    onStatusChange={handleStatusSelect}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="sv-pagination">
              <button
                className={`sv-page-btn${pagination.page === 1 ? ' sv-page-btn--disabled' : ''}`}
                onClick={() => setPage(pagination.page - 1)}
                aria-label="Página anterior"
              >
                «
              </button>

              {getPageRange(pagination.page, pagination.totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="sv-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`sv-page-btn${p === pagination.page ? ' sv-page-btn--active' : ''}`}
                    onClick={() => setPage(p)}
                    aria-label={`Página ${p}`}
                    aria-current={p === pagination.page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                className={`sv-page-btn${pagination.page === pagination.totalPages ? ' sv-page-btn--disabled' : ''}`}
                onClick={() => setPage(pagination.page + 1)}
                aria-label="Página siguiente"
              >
                »
              </button>
            </div>
          )}
        </>
      )}

      {/* ConfirmDialog (eliminar) */}
      {confirmDog && (
        <ConfirmDialog
          dog={confirmDog}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setConfirmDog(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* StatusConfirmDialog (cambiar estado) */}
      {statusDog && pendingStatus && (
        <StatusConfirmDialog
          dog={statusDog}
          targetStatus={pendingStatus}
          onConfirm={handleStatusConfirm}
          onCancel={() => !isUpdatingStatus && (setStatusDog(null), setPendingStatus(null))}
          isUpdating={isUpdatingStatus}
        />
      )}
    </>
  )
}
