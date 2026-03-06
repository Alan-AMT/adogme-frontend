// modules/shelter/components/ShelterRequestsView.tsx
// Archivo 185 — Lista de solicitudes del refugio.
// Tabs por estado · tabla: foto perro + nombre · foto adoptante + nombre · fecha · badge · ver detalle
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useShelterRequests } from '../application/hooks/useShelterRequests'
import type { RequestFilter }  from '../application/hooks/useShelterRequests'
import type { AdoptionRequestListItem } from '@/modules/shared/domain/AdoptionRequest'
import '../styles/shelterDashboard.css'
import '../styles/shelterViews.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  in_review: 'En revisión',
  approved:  'Aprobada',
  rejected:  'Rechazada',
  cancelled: 'Cancelada',
}

const STATUS_ICONS: Record<string, string> = {
  pending:   'schedule',
  in_review: 'manage_search',
  approved:  'check_circle',
  rejected:  'cancel',
  cancelled: 'block',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#fef9c3', color: '#854d0e' },
  in_review: { bg: '#dbeafe', color: '#1e40af' },
  approved:  { bg: '#dcfce7', color: '#166534' },
  rejected:  { bg: '#fee2e2', color: '#991b1b' },
  cancelled: { bg: '#f4f4f5', color: '#52525b' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────

const TABS: { label: string; value: RequestFilter }[] = [
  { label: 'Todas',       value: 'all' },
  { label: 'Pendientes',  value: 'pending' },
  { label: 'En revisión', value: 'in_review' },
  { label: 'Aprobadas',   value: 'approved' },
  { label: 'Rechazadas',  value: 'rejected' },
  { label: 'Canceladas',  value: 'cancelled' },
]

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ estado }: { estado: string }) {
  const c = STATUS_COLORS[estado] ?? { bg: '#f4f4f5', color: '#52525b' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.28rem 0.7rem', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 900, whiteSpace: 'nowrap',
      background: c.bg, color: c.color,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>
        {STATUS_ICONS[estado] ?? 'info'}
      </span>
      {STATUS_LABELS[estado] ?? estado}
    </span>
  )
}

// ─── Avatar del adoptante ─────────────────────────────────────────────────────

function ApplicantAvatar({ name }: { name?: string }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, border: '2px solid #fff',
      boxShadow: '0 0 0 1.5px #f0f0f0',
    }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
        {getInitials(name)}
      </span>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ padding: '0.75rem 1rem' }}>
      {[1,2,3,4,5].map(i => <div key={i} className="sv-skel-row" />)}
    </div>
  )
}

// ─── Tabla ────────────────────────────────────────────────────────────────────

function RequestsTable({ rows }: { rows: AdoptionRequestListItem[] }) {
  if (rows.length === 0) {
    return (
      <div className="sv-empty">
        <span className="material-symbols-outlined">assignment</span>
        <p className="sv-empty__title">Sin solicitudes</p>
        <p className="sv-empty__sub">No hay solicitudes que coincidan con los filtros aplicados</p>
      </div>
    )
  }

  return (
    <div className="sv-table-wrap">
      <table className="sv-table">
        <thead>
          <tr>
            <th>Perro</th>
            <th>Solicitante</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>

              {/* Perro */}
              <td>
                <div className="sv-dog-cell">
                  {r.perroFoto ? (
                    <Image
                      src={r.perroFoto}
                      alt={r.perroNombre ?? 'Perro'}
                      width={40}
                      height={40}
                      className="sv-dog-cell__img"
                    />
                  ) : (
                    <div className="sv-dog-cell__placeholder">
                      <span className="material-symbols-outlined">pets</span>
                    </div>
                  )}
                  <p className="sv-dog-cell__name">{r.perroNombre ?? '—'}</p>
                </div>
              </td>

              {/* Solicitante */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ApplicantAvatar name={r.adoptanteNombre} />
                  <p style={{ fontSize: '0.83rem', fontWeight: 700, color: '#18181b' }}>
                    {r.adoptanteNombre ?? '—'}
                  </p>
                </div>
              </td>

              {/* Fecha */}
              <td>
                <span style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatDate(r.fecha)}
                </span>
              </td>

              {/* Estado */}
              <td><StatusBadge estado={r.estado} /></td>

              {/* Acción */}
              <td>
                <Link href={`/refugio/solicitudes/${r.id}`} className="sv-action-link">
                  <span className="material-symbols-outlined">open_in_new</span>
                  Ver detalle
                </Link>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function ShelterRequestsView() {
  const { requests, filtered, isLoading, error, filter, search, setFilter, setSearch } =
    useShelterRequests()

  const countByStatus = (value: RequestFilter) =>
    value === 'all'
      ? requests.length
      : requests.filter(r => r.estado === value).length

  return (
    <>
      {/* Tabs por estado */}
      <div style={{
        display: 'flex', gap: 0, overflowX: 'auto',
        borderBottom: '1.5px solid #f0f0f0',
        marginBottom: '1.25rem',
      }}>
        {TABS.map(tab => {
          const isActive = filter === tab.value
          const count    = countByStatus(tab.value)
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              style={{
                flexShrink: 0,
                padding: '0.7rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                color:      isActive ? '#ff6b6b' : '#71717a',
                background: 'none',
                border:     'none',
                borderBottom: isActive ? '2.5px solid #ff6b6b' : '2.5px solid transparent',
                cursor:     'pointer',
                transition: 'all 150ms ease',
                display:    'inline-flex',
                alignItems: 'center',
                gap:        '0.4rem',
                marginBottom: '-1.5px',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  fontSize: '0.68rem', fontWeight: 900, lineHeight: 1,
                  padding: '0.15rem 0.45rem', borderRadius: 999,
                  background: isActive ? 'rgba(255,107,107,0.12)' : '#f4f4f5',
                  color:      isActive ? '#ff6b6b' : '#71717a',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Buscador */}
      <div className="sv-toolbar">
        <div className="sv-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            className="sv-search__input"
            placeholder="Buscar por perro o adoptante..."
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
        <p style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, marginLeft: 'auto' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Card con tabla */}
      <div className="sd-card">
        {error && (
          <p style={{ padding: '1.5rem', color: '#dc2626', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </p>
        )}
        {isLoading ? <Skeleton /> : <RequestsTable rows={filtered} />}
      </div>
    </>
  )
}
