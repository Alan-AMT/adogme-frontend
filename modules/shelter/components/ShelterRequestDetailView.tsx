// modules/shelter/components/ShelterRequestDetailView.tsx
// Archivo 186 — Detalle de solicitud: datos del formulario, galería de fotos de vivienda,
// panel de acción (estado + comentario), timeline de cambios, acceso al chat.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useState } from 'react'
import { useShelterRequestDetail } from '../application/hooks/useShelterRequestDetail'
import type { RequestStatus, StatusChange, AdoptionRequest } from '@/modules/shared/domain/AdoptionRequest'
import FormSummarySections from '@/modules/adoption/components/FormSummarySections'
import { useToast } from '@/modules/shared/application/hooks/useToast'
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

const NEXT_STATUSES: Partial<Record<RequestStatus, RequestStatus[]>> = {
  pending:   ['in_review', 'rejected'],
  in_review: ['approved', 'rejected'],
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function StatusBadge({ estado }: { estado: string }) {
  return (
    <span className={`sv-badge sv-badge--${estado}`}>
      <span className="material-symbols-outlined">{STATUS_ICONS[estado] ?? 'info'}</span>
      {STATUS_LABELS[estado] ?? estado}
    </span>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({ revisiones }: { revisiones: StatusChange[] }) {
  if (revisiones.length === 0) return null

  return (
    <div className="sv-timeline">
      {[...revisiones].reverse().map(item => (
        <div key={item.id} className="sv-timeline-item">
          <div className={`sv-timeline-dot sv-timeline-dot--${item.toStatus}`}>
            <span className="material-symbols-outlined">
              {STATUS_ICONS[item.toStatus] ?? 'circle'}
            </span>
          </div>
          <div className="sv-timeline-content">
            <p className="sv-timeline-label">
              {STATUS_LABELS[item.toStatus] ?? item.toStatus}
            </p>
            <p className="sv-timeline-date">{formatDateTime(item.createdAt)}</p>
            {item.note && (
              <p className="sv-timeline-comment">"{item.note}"</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Panel de acción ──────────────────────────────────────────────────────────

function ActionPanel({
  request,
  isSaving,
  onUpdate,
}: {
  request:  AdoptionRequest
  isSaving: boolean
  onUpdate: (status: RequestStatus, comentario?: string) => Promise<void>
}) {
  const toast   = useToast()
  const options = NEXT_STATUSES[request.estado] ?? []
  const [selected,   setSelected]   = useState<RequestStatus | ''>(options[0] ?? '')
  const [comentario, setComentario] = useState('')

  if (options.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: '#a1a1aa', fontSize: '0.82rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>
          lock
        </span>
        Esta solicitud ya no puede cambiar de estado
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!selected) return
    try {
      await onUpdate(selected as RequestStatus, comentario.trim() || undefined)
      setComentario('')
      toast.success(`Estado actualizado a "${STATUS_LABELS[selected]}"`)
    } catch {
      toast.error('No se pudo actualizar el estado. Intenta de nuevo.')
    }
  }

  return (
    <div className="sv-action-panel">
      <p className="sv-action-panel__label">Cambiar estado</p>

      <select
        className="sv-action-panel__select"
        value={selected}
        onChange={e => setSelected(e.target.value as RequestStatus)}
      >
        {options.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      <textarea
        className="sv-action-panel__textarea"
        placeholder="Comentario (opcional)..."
        value={comentario}
        onChange={e => setComentario(e.target.value)}
        maxLength={500}
      />

      <button
        className="sv-action-panel__btn"
        onClick={handleSubmit}
        disabled={!selected || isSaving}
      >
        {isSaving ? (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>hourglass_top</span>
            Guardando...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
            Actualizar estado
          </>
        )}
      </button>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="sv-detail">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[180, 280, 200].map((h, i) => (
          <div key={i} className="sv-detail-card" style={{ height: h }}>
            <div className="sv-skel-row" style={{ margin: '1rem', height: '100%', borderRadius: '0.9rem' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[240, 300].map((h, i) => (
          <div key={i} className="sv-detail-card" style={{ height: h }}>
            <div className="sv-skel-row" style={{ margin: '1rem', height: '100%', borderRadius: '0.9rem' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function ShelterRequestDetailView({ requestId }: { requestId: string }) {
  const { request, isLoading, isSaving, error, updateStatus } = useShelterRequestDetail(requestId)

  if (isLoading) return <Skeleton />

  if (error || !request) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>
          error
        </span>
        {error ?? 'Solicitud no encontrada'}
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <Link
          href="/refugio/solicitudes"
          style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff6b6b', textDecoration: 'none' }}
        >
          Solicitudes
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#a1a1aa' }}>chevron_right</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#71717a' }}>
          Solicitud #{request.id}
        </span>
      </div>

      <div className="sv-detail">

        {/* ── Columna izquierda ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Card — Dog + adoptante header */}
          <div className="sv-detail-card">
            <div className="sv-req-header">
              {/* Foto perro */}
              {request.perroFoto ? (
                <div className="sv-req-header__photo">
                  <Image
                    src={request.perroFoto}
                    alt={request.perroNombre ?? 'Perro'}
                    fill
                    sizes="64px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div
                  className="sv-req-header__photo"
                  style={{ background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#d4d4d8', fontSize: 28 }}>pets</span>
                </div>
              )}

              <div className="sv-req-header__info">
                <p className="sv-req-header__dog">{request.perroNombre ?? '—'}</p>
                <div className="sv-req-header__meta">
                  <StatusBadge estado={request.estado} />
                  <span>·</span>
                  <span>{formatDate(request.fecha)}</span>
                </div>
              </div>
            </div>

            {/* Info adoptante */}
            <div className="sv-detail-card__body">
              <div className="sv-info-row">
                <span className="sv-info-row__label">Adoptante</span>
                <span className="sv-info-row__value">{request.adoptanteNombre ?? '—'}</span>
              </div>
              {request.formulario.correo && (
                <div className="sv-info-row">
                  <span className="sv-info-row__label">Correo</span>
                  <a
                    href={`mailto:${request.formulario.correo}`}
                    className="sv-info-row__value"
                    style={{ color: '#ff6b6b', textDecoration: 'none' }}
                  >
                    {request.formulario.correo}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de adopción — secciones del nuevo schema */}
          <FormSummarySections formulario={request.formulario} housingPhotos={request.images} />

        </div>

        {/* ── Columna derecha ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Card — Puntuación de compatibilidad */}
          {request.compatibilityScore !== null && (
            <div className="sv-detail-card">
              <div className="sv-detail-card__header">
                <span className="material-symbols-outlined">psychology</span>
                Compatibilidad ML
              </div>
              <div className="sv-detail-card__body" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: request.compatibilityScore >= 80
                    ? 'rgba(22,163,74,0.1)'
                    : request.compatibilityScore >= 60
                      ? 'rgba(202,138,4,0.1)'
                      : 'rgba(220,38,38,0.1)',
                  border: `3px solid ${
                    request.compatibilityScore >= 80
                      ? '#16a34a'
                      : request.compatibilityScore >= 60
                        ? '#ca8a04'
                        : '#dc2626'
                  }`,
                }}>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: request.compatibilityScore >= 80
                      ? '#16a34a'
                      : request.compatibilityScore >= 60
                        ? '#ca8a04'
                        : '#dc2626',
                    lineHeight: 1,
                  }}>
                    {request.compatibilityScore}%
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', marginBottom: '0.2rem' }}>
                    {request.compatibilityScore >= 80
                      ? 'Excelente compatibilidad'
                      : request.compatibilityScore >= 60
                        ? 'Buena compatibilidad'
                        : 'Compatibilidad baja'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500 }}>
                    Puntuación calculada por el modelo de recomendación
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Card — Contacto WhatsApp */}
          {request.formulario.telefono && (
            <div className="sv-detail-card">
              <div className="sv-detail-card__header">
                <span className="material-symbols-outlined">phone</span>
                Contacto
              </div>
              <div className="sv-detail-card__body">
                <p style={{ fontSize: '0.85rem', color: '#52525b', marginBottom: '0.85rem' }}>
                  Contactar a {request.adoptanteNombre} por WhatsApp.
                </p>
                <a
                  href={`https://wa.me/52${request.formulario.telefono.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.2rem',
                    borderRadius: 999,
                    background: '#25d366',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    textDecoration: 'none',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Card — Acción de estado */}
          <div className="sv-detail-card">
            <div className="sv-detail-card__header">
              <span className="material-symbols-outlined">edit_note</span>
              Gestionar solicitud
            </div>
            <div className="sv-detail-card__body">
              <ActionPanel request={request} isSaving={isSaving} onUpdate={updateStatus} />
            </div>
          </div>

          {/* Card — Historial */}
          <div className="sv-detail-card">
            <div className="sv-detail-card__header">
              <span className="material-symbols-outlined">history</span>
              Historial de cambios
            </div>
            <div className="sv-detail-card__body">
              <Timeline revisiones={request.revisiones} />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
