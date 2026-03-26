// modules/adoption/components/AdoptionStatusView.tsx
// Lista de solicitudes del adoptante con tabs por estado
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { Badge, requestStatusBadgeVariant } from '../../shared/components/ui/Badge'
import { Spinner } from '../../shared/components/ui/Spinner'
import { useMyRequests } from '../application/hooks/useMyRequests'
import type { RequestStatus } from '../../shared/domain/AdoptionRequest'
import '../styles/adoptionForm.css'

// ─── Tabs ─────────────────────────────────────────────────────────────────────

interface TabDef {
  key:    string
  label:  string
  status?: RequestStatus
}

const TABS: TabDef[] = [
  { key: 'all',       label: 'Todas' },
  { key: 'pending',   label: 'Pendientes',  status: 'pending' },
  { key: 'in_review', label: 'En revisión', status: 'in_review' },
  { key: 'approved',  label: 'Aprobadas',   status: 'approved' },
  { key: 'rejected',  label: 'Rechazadas',  status: 'rejected' },
  { key: 'cancelled', label: 'Canceladas',  status: 'cancelled' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  pending:   'Pendiente',
  in_review: 'En revisión',
  approved:  'Aprobada',
  rejected:  'Rechazada',
  cancelled: 'Cancelada',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdoptionStatusView() {
  const { requests, isLoading, error, refetch } = useMyRequests()
  const [activeTab, setActiveTab] = useState('all')

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="as-page">
        <div className="as-page-header">
          <h1 className="as-page-header__title">Mis solicitudes</h1>
        </div>
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="as-page">
        <div className="as-page-header">
          <h1 className="as-page-header__title">Mis solicitudes</h1>
        </div>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span
            className="material-symbols-outlined text-[#fca5a5]"
            style={{ fontSize: 40, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 40" }}
          >
            error_circle
          </span>
          <p className="text-[#b91c1c] font-[700]">{error}</p>
          <button onClick={refetch} className="text-sm font-[700] text-[#ff6b6b] underline">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const countOf = (status?: RequestStatus) =>
    status ? requests.filter(r => r.estado === status).length : requests.length

  const filtered = activeTab === 'all'
    ? requests
    : requests.filter(r => r.estado === activeTab)

  const activeTabDef = TABS.find(t => t.key === activeTab)!

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="as-page">

      {/* ── Header ── */}
      <div className="as-page-header">
        <h1 className="as-page-header__title">Mis solicitudes</h1>
        <p className="as-page-header__sub">
          {requests.length
            ? `Tienes ${requests.length} solicitud${requests.length !== 1 ? 'es' : ''} de adopción`
            : 'Aún no has enviado ninguna solicitud'}
        </p>
      </div>

      {/* ── Tabs (solo si hay solicitudes) ── */}
      {requests.length > 0 && (
        <div className="as-tabs">
          {TABS.map(tab => {
            const count = countOf(tab.status)
            if (tab.key !== 'all' && count === 0) return null
            return (
              <button
                key={tab.key}
                type="button"
                className={`as-tab${activeTab === tab.key ? ' as-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="as-tab__count">{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="as-empty">
          <span
            className="material-symbols-outlined as-empty__icon"
            style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}
          >
            pets
          </span>

          {activeTab === 'all' ? (
            <>
              <h2 className="as-empty__title">No tienes solicitudes aún</h2>
              <p className="as-empty__sub">
                Encuentra al perro ideal y envía tu primera solicitud de adopción.
              </p>
              <Link href="/perros" className="as-empty__btn">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                Explorar perros
              </Link>
            </>
          ) : (
            <>
              <h2 className="as-empty__title">
                No tienes solicitudes {activeTabDef.label.toLowerCase()}
              </h2>
              <p className="as-empty__sub">
                Prueba con otra pestaña o vuelve a ver todas.
              </p>
              <button
                type="button"
                className="as-empty__btn"
                onClick={() => setActiveTab('all')}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Ver todas
              </button>
            </>
          )}
        </div>
      )}

      {/* ── List ── */}
      {filtered.length > 0 && (
        <div className="as-list">
          {filtered.map(req => (
            <Link
              key={req.id}
              href={`/mis-solicitudes/${req.id}`}
              className="as-card"
            >
              {/* Photo */}
              <div className="as-card__photo">
                {req.perroFoto ? (
                  <Image
                    src={req.perroFoto}
                    alt={req.perroNombre ?? 'Perro'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span
                      className="material-symbols-outlined text-[#d4d4d8]"
                      style={{ fontSize: 28, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 28" }}
                    >
                      pets
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="as-card__info">
                <p className="as-card__dog-name">{req.perroNombre ?? 'Perro'}</p>
                <p className="as-card__shelter">{req.refugioNombre ?? 'Refugio'}</p>
                <p className="as-card__date">Enviada el {formatDate(req.fecha)}</p>
              </div>

              {/* Right: badge + arrow */}
              <div className="as-card__right">
                <Badge variant={requestStatusBadgeVariant(req.estado)} dot>
                  {STATUS_LABEL[req.estado] ?? req.estado}
                </Badge>
                <span
                  className="material-symbols-outlined as-card__arrow"
                  style={{ fontSize: 18 }}
                >
                  chevron_right
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
