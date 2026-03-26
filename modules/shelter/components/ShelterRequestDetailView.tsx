// modules/shelter/components/ShelterRequestDetailView.tsx
// Archivo 186 — Detalle de solicitud: datos del formulario, galería de fotos de vivienda,
// panel de acción (estado + comentario), timeline de cambios, acceso al chat.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useState } from 'react'
import { useShelterRequestDetail } from '../application/hooks/useShelterRequestDetail'
import type { RequestStatus, StatusChange, AdoptionRequest } from '@/modules/shared/domain/AdoptionRequest'
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

function Timeline({ historial }: { historial: StatusChange[] }) {
  if (historial.length === 0) return null

  return (
    <div className="sv-timeline">
      {[...historial].reverse().map(item => (
        <div key={item.id} className="sv-timeline-item">
          <div className={`sv-timeline-dot sv-timeline-dot--${item.estadoNuevo}`}>
            <span className="material-symbols-outlined">
              {STATUS_ICONS[item.estadoNuevo] ?? 'circle'}
            </span>
          </div>
          <div className="sv-timeline-content">
            <p className="sv-timeline-label">
              {STATUS_LABELS[item.estadoNuevo] ?? item.estadoNuevo}
            </p>
            <p className="sv-timeline-date">{formatDateTime(item.fecha)}</p>
            {item.comentario && (
              <p className="sv-timeline-comment">"{item.comentario}"</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Panel de info del formulario ─────────────────────────────────────────────

function FormDataPanel({ r }: { r: AdoptionRequest }) {
  const { formulario: f } = r
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const housingLabel: Record<string, string> = {
    casa:         'Casa',
    departamento: 'Departamento',
    casa_campo:   'Casa de campo',
    otro:         'Otro',
  }

  const actividadLabel: Record<string, string> = {
    sedentario: 'Sedentario',
    moderado:   'Moderado',
    activo:     'Activo',
    muy_activo: 'Muy activo',
  }

  const fotos: string[] = f.vivienda.fotosVivienda ?? []

  return (
    <>
      {/* Motivación */}
      <div className="sv-info-row">
        <span className="sv-info-row__label">Motivación</span>
        <span className="sv-info-row__value">{f.motivacion}</span>
      </div>

      {/* Experiencia */}
      <div className="sv-info-row">
        <span className="sv-info-row__label">Experiencia previa</span>
        <span className="sv-info-row__value">
          {f.experienciaPrevia ? 'Sí' : 'No'}
          {f.descripcionExperiencia && ` — ${f.descripcionExperiencia}`}
        </span>
      </div>

      {/* Vivienda */}
      <div className="sv-info-row">
        <span className="sv-info-row__label">Vivienda</span>
        <span className="sv-info-row__value">
          {housingLabel[f.vivienda.tipo] ?? f.vivienda.tipo}
          {f.vivienda.tieneJardin && f.vivienda.tamanoJardinM2
            ? ` · Jardín ${f.vivienda.tamanoJardinM2} m²`
            : f.vivienda.tieneJardin ? ' · Con jardín' : ''}
          {' · '}
          {f.vivienda.tieneRejaOCerca ? 'Con reja/cerca' : 'Sin reja/cerca'}
          {' · '}
          {f.vivienda.esPropietario ? 'Propietario' : 'Arrendatario'}
        </span>
      </div>

      {/* Fotos de vivienda */}
      {fotos.length > 0 && (
        <div className="sv-info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span className="sv-info-row__label">Fotos de vivienda</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {fotos.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '2px solid #e4e4e7',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none',
                  flexShrink: 0,
                }}
                aria-label={`Ver foto de vivienda ${idx + 1}`}
              >
                <Image
                  src={src}
                  alt={`Foto de vivienda ${idx + 1}`}
                  fill
                  sizes="80px"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Horas en casa / actividad */}
      <div className="sv-info-row">
        <span className="sv-info-row__label">Estilo de vida</span>
        <span className="sv-info-row__value">
          {f.horasEnCasa}h/día en casa · {actividadLabel[f.actividadFisica] ?? f.actividadFisica}
        </span>
      </div>

      {/* Convivencia */}
      <div className="sv-info-row">
        <span className="sv-info-row__label">Convivencia</span>
        <span className="sv-info-row__value">
          {f.conviveConNinos
            ? `Niños: sí${f.edadesNinos?.length ? ` (${f.edadesNinos.join(', ')} años)` : ''}`
            : 'Sin niños'}
          {' · '}
          {f.conviveConMascotas
            ? `Mascotas: sí${f.descripcionMascotas ? ` (${f.descripcionMascotas})` : ''}`
            : 'Sin mascotas'}
        </span>
      </div>

      {/* Visita + comentarios */}
      <div className="sv-info-row">
        <span className="sv-info-row__label">Visita previa</span>
        <span className="sv-info-row__value">
          {f.aceptaVisitaPrevia ? 'Acepta' : 'No acepta'}
        </span>
      </div>

      {f.comentariosAdicionales && (
        <div className="sv-info-row">
          <span className="sv-info-row__label">Notas</span>
          <span className="sv-info-row__value">{f.comentariosAdicionales}</span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null) }}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fff' }}>close</span>
          </button>

          {/* Left arrow */}
          {fotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((lightboxIndex - 1 + fotos.length) % fotos.length)
              }}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Foto anterior"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#fff' }}>chevron_left</span>
            </button>
          )}

          {/* Right arrow */}
          {fotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((lightboxIndex + 1) % fotos.length)
              }}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Foto siguiente"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#fff' }}>chevron_right</span>
            </button>
          )}

          {/* Photo */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: '90vw',
              height: '90vh',
            }}
          >
            <Image
              src={fotos[lightboxIndex]}
              alt={`Foto de vivienda ${lightboxIndex + 1}`}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </>
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
  const options = NEXT_STATUSES[request.estado] ?? []
  const [selected,   setSelected]   = useState<RequestStatus | ''>(options[0] ?? '')
  const [comentario, setComentario] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

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
    setLocalError(null)
    try {
      await onUpdate(selected as RequestStatus, comentario.trim() || undefined)
      setComentario('')
    } catch {
      setLocalError('No se pudo actualizar el estado. Intenta de nuevo.')
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

      {localError && (
        <p style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>{localError}</p>
      )}

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

export default function ShelterRequestDetailView({ requestId }: { requestId: number }) {
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
              {request.adoptanteCorreo && (
                <div className="sv-info-row">
                  <span className="sv-info-row__label">Correo</span>
                  <a
                    href={`mailto:${request.adoptanteCorreo}`}
                    className="sv-info-row__value"
                    style={{ color: '#ff6b6b', textDecoration: 'none' }}
                  >
                    {request.adoptanteCorreo}
                  </a>
                </div>
              )}
              {request.comentarios && (
                <div className="sv-info-row">
                  <span className="sv-info-row__label">Comentarios</span>
                  <span className="sv-info-row__value" style={{ fontStyle: 'italic', color: '#52525b' }}>
                    "{request.comentarios}"
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card — Formulario de adopción */}
          <div className="sv-detail-card">
            <div className="sv-detail-card__header">
              <span className="material-symbols-outlined">assignment_ind</span>
              Formulario de adopción
            </div>
            <div className="sv-detail-card__body">
              <FormDataPanel r={request} />
            </div>
          </div>

        </div>

        {/* ── Columna derecha ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Card — Mensajes / chat */}
          <div className="sv-detail-card">
            <div className="sv-detail-card__header">
              <span className="material-symbols-outlined">chat</span>
              Mensajes
            </div>
            <div className="sv-detail-card__body">
              <p style={{ fontSize: '0.85rem', color: '#52525b', marginBottom: '0.85rem' }}>
                Contactar a {request.adoptanteNombre} directamente por chat.
              </p>
              <Link
                href={`/refugio/mensajes?adoptanteId=${request.adoptanteId}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.2rem',
                  borderRadius: 999,
                  background: '#ff6b6b',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  textDecoration: 'none',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                Ir al chat
              </Link>
            </div>
          </div>

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
              <Timeline historial={request.historial} />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
