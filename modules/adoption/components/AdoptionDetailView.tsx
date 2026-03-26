// modules/adoption/components/AdoptionDetailView.tsx
// Detalle de una solicitud con timeline de estado y datos del formulario
'use client'

import Image  from 'next/image'
import Link   from 'next/link'
import { useState } from 'react'
import { Badge, requestStatusBadgeVariant } from '../../shared/components/ui/Badge'
import { Spinner } from '../../shared/components/ui/Spinner'
import { useRequestDetail } from '../application/hooks/useMyRequests'
import { getShelterById } from '@/modules/shared/mockData/shelters.mock'
import type { RequestStatus } from '../../shared/domain/AdoptionRequest'
import '../styles/adoptionForm.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending:   'Solicitud enviada',
  in_review: 'En revisión',
  approved:  'Aprobada',
  rejected:  'Rechazada',
  cancelled: 'Cancelada',
}

const STATUS_DESC: Record<RequestStatus, string> = {
  pending:   'El refugio ha recibido tu solicitud y la revisará pronto.',
  in_review: 'El refugio está evaluando tu perfil y formulario.',
  approved:  '¡Enhorabuena! El refugio aprobó tu solicitud. Te contactarán para coordinar la entrega.',
  rejected:  'El refugio no pudo aprobar esta solicitud en este momento.',
  cancelled: 'Esta solicitud fue cancelada.',
}

const HOUSING_LABEL: Record<string, string> = {
  casa:         'Casa',
  departamento: 'Departamento',
  casa_campo:   'Casa de campo / Rancho',
  otro:         'Otro',
}

const ACTIVITY_LABEL: Record<string, string> = {
  sedentario: 'Sedentario',
  moderado:   'Moderado',
  activo:     'Activo',
  muy_activo: 'Muy activo',
}

function yesNo(v: boolean | undefined): string {
  if (v === undefined) return '—'
  return v ? 'Sí' : 'No'
}

function formatDate(iso: string, withTime = false): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

const ACTIVE_STATES: RequestStatus[] = ['pending', 'in_review']

function whatsappUrl(phone: string, shelterName: string, dogName: string): string {
  const digits = phone.replace(/\D/g, '')
  const full = digits.length === 10 ? `52${digits}` : digits
  const text = encodeURIComponent(`Hola, soy adoptante de aDOGme. Envié una solicitud para adoptar a ${dogName} del refugio ${shelterName}.`)
  return `https://wa.me/${full}?text=${text}`
}

function dotClass(status: RequestStatus, isCurrent = false): string {
  const base = 'ad-timeline-item__dot'
  if (isCurrent && ACTIVE_STATES.includes(status)) return `${base} ${base}--current`
  if (status === 'approved') return `${base} ${base}--approved`
  if (status === 'rejected') return `${base} ${base}--rejected`
  return `${base} ${base}--active`
}

// ─── Data row ─────────────────────────────────────────────────────────────────

function DataRow({ label, value }: { label: string; value: string }) {
  if (!value || value === '—') return null
  return (
    <div className="ad-data-row">
      <span className="ad-data-row__key">{label}</span>
      <span className="ad-data-row__val">{value}</span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdoptionDetailView({ requestId }: { requestId: number }) {
  const { request, isLoading, error, cancelling, cancel } = useRequestDetail(requestId)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="ad-page flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Error / Not found ──────────────────────────────────────────────────────
  if (error || !request) {
    return (
      <div className="ad-page">
        <nav className="ad-breadcrumb">
          <Link href="/mis-solicitudes">Mis solicitudes</Link>
          <span className="ad-breadcrumb__sep">›</span>
          <span className="ad-breadcrumb__current">Solicitud no encontrada</span>
        </nav>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span
            className="material-symbols-outlined text-[#fca5a5]"
            style={{ fontSize: 40, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 40" }}
          >
            error_circle
          </span>
          <p className="text-[#b91c1c] font-[700]">{error ?? 'Solicitud no encontrada'}</p>
          <Link href="/mis-solicitudes" className="text-sm font-[700] text-[#ff6b6b] underline">
            Volver a mis solicitudes
          </Link>
        </div>
      </div>
    )
  }

  const { formulario: f, historial } = request
  const canCancel  = ACTIVE_STATES.includes(request.estado)
  const shelter    = getShelterById(request.refugioId)
  const waUrl      = shelter?.telefono
    ? whatsappUrl(shelter.telefono, request.refugioNombre ?? shelter.nombre, request.perroNombre ?? 'el perro')
    : null
  const rejectionComment = request.estado === 'rejected'
    ? [...historial].reverse().find(h => h.estadoNuevo === 'rejected' && h.comentario)?.comentario
    : undefined

  return (
    <div className="ad-page">

      {/* ── Breadcrumb ── */}
      <nav className="ad-breadcrumb">
        <Link href="/mis-solicitudes">Mis solicitudes</Link>
        <span className="ad-breadcrumb__sep">›</span>
        <span className="ad-breadcrumb__current">
          {request.perroNombre ?? 'Solicitud'}
        </span>
      </nav>

      <div className="ad-layout">

        {/* ── Sidebar ── */}
        <aside className="ad-sidebar">

          {/* Dog card */}
          <div className="ad-dog-card">
            <div className="ad-dog-card__photo">
              {request.perroFoto ? (
                <Image
                  src={request.perroFoto}
                  alt={request.perroNombre ?? 'Perro'}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-[#f4f4f5]">
                  <span
                    className="material-symbols-outlined text-[#d4d4d8]"
                    style={{ fontSize: 36, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 36" }}
                  >
                    pets
                  </span>
                </div>
              )}
            </div>
            <div className="ad-dog-card__body">
              <p className="ad-dog-card__name">{request.perroNombre ?? 'Perro'}</p>
              <p className="ad-dog-card__shelter">{request.refugioNombre ?? 'Refugio'}</p>
              {request.perroSlug && (
                <Link
                  href={`/perros/${request.perroSlug}`}
                  className="ad-dog-card__link"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                  Ver perfil del perro
                </Link>
              )}
            </div>
          </div>

          {/* Status card */}
          <div className="ad-status-card">
            <p className="ad-status-card__label">Estado actual</p>
            <Badge variant={requestStatusBadgeVariant(request.estado)} size="md" dot>
              {STATUS_LABEL[request.estado]}
            </Badge>
            <p className="ad-status-card__date">
              Enviada el {formatDate(request.fecha)}
            </p>
            <p className="text-[12px] text-[#71717a] font-[500] mt-2 leading-relaxed">
              {STATUS_DESC[request.estado]}
            </p>
          </div>

          {/* WhatsApp — contacto directo con el refugio */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ad-chat-btn"
              style={{ textDecoration: 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>phone_in_talk</span>
              Contactar por WhatsApp
            </a>
          )}

          {/* Cancel button */}
          {canCancel && !showCancelConfirm && (
            <button
              className="ad-cancel-btn"
              onClick={() => setShowCancelConfirm(true)}
              disabled={cancelling}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>cancel</span>
              Cancelar solicitud
            </button>
          )}

          {showCancelConfirm && (
            <div className="flex flex-col gap-2 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-2xl">
              <p className="text-[13px] font-[700] text-[#b91c1c]">
                ¿Seguro que deseas cancelar esta solicitud?
              </p>
              <p className="text-[12px] text-[#ef4444] font-[500]">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-2 mt-1">
                <button
                  className="flex-1 py-2 rounded-xl border border-[#e4e4e7] bg-white text-[13px] font-[700] text-[#3f3f46] transition hover:bg-[#fafafa]"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  No, volver
                </button>
                <button
                  className="flex-1 py-2 rounded-xl bg-[#ef4444] text-white text-[13px] font-[800] transition hover:bg-[#dc2626] disabled:opacity-50"
                  onClick={() => cancel('Cancelada por el adoptante').then(() => setShowCancelConfirm(false))}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main ── */}
        <main className="ad-main">

          {/* Rejection banner */}
          {rejectionComment && (
            <div className="ad-rejection-banner">
              <span className="material-symbols-outlined ad-rejection-banner__icon">
                do_not_disturb_on
              </span>
              <div>
                <p className="ad-rejection-banner__title">Motivo del rechazo</p>
                <p className="ad-rejection-banner__reason">{rejectionComment}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="ad-card">
            <h2 className="ad-card__title">
              <span className="material-symbols-outlined">timeline</span>
              Historial de la solicitud
            </h2>
            <div className="ad-timeline">
              {historial.map((item, i) => {
                const isCurrent = i === historial.length - 1
                return (
                  <div key={item.id} className="ad-timeline-item">
                    <div className="ad-timeline-item__left">
                      <div className={dotClass(item.estadoNuevo, isCurrent)} />
                      {!isCurrent && <div className="ad-timeline-item__line" />}
                    </div>
                    <div className="ad-timeline-item__content">
                      <div className="ad-timeline-item__status-row">
                        <p className="ad-timeline-item__status">
                          {STATUS_LABEL[item.estadoNuevo]}
                        </p>
                        {isCurrent && (
                          <span className="ad-timeline-item__current-badge">Actual</span>
                        )}
                      </div>
                      {item.comentario && (
                        <p className="ad-timeline-item__comment">{item.comentario}</p>
                      )}
                      <p className="ad-timeline-item__date">
                        {formatDate(item.fecha, true)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Formulario — Datos personales */}
          <div className="ad-card">
            <h2 className="ad-card__title">
              <span className="material-symbols-outlined">person</span>
              Datos personales
            </h2>
            <DataRow label="Nombre"    value={request.adoptanteNombre ?? ''} />
            <DataRow label="Correo"    value={request.adoptanteCorreo ?? ''} />
          </div>

          {/* Vivienda */}
          {f.vivienda && (
            <div className="ad-card">
              <h2 className="ad-card__title">
                <span className="material-symbols-outlined">home</span>
                Vivienda
              </h2>
              <DataRow label="Tipo"              value={HOUSING_LABEL[f.vivienda.tipo] ?? f.vivienda.tipo} />
              <DataRow label="Propietario"       value={yesNo(f.vivienda.esPropietario)} />
              {f.vivienda.esPropietario === false && (
                <DataRow label="Permite animales" value={yesNo(f.vivienda.permiteAnimales)} />
              )}
              <DataRow label="Jardín / patio"    value={yesNo(f.vivienda.tieneJardin)} />
              {f.vivienda.tieneJardin && f.vivienda.tamanoJardinM2 !== undefined && (
                <DataRow label="Tamaño jardín"   value={`${f.vivienda.tamanoJardinM2} m²`} />
              )}
              {f.vivienda.tieneJardin !== undefined && (
                <DataRow label="Barda / cerca"   value={yesNo(f.vivienda.tieneRejaOCerca)} />
              )}
            </div>
          )}

          {/* Rutina */}
          <div className="ad-card">
            <h2 className="ad-card__title">
              <span className="material-symbols-outlined">schedule</span>
              Estilo de vida
            </h2>
            <DataRow label="Horas en casa / día" value={f.horasEnCasa ? `${f.horasEnCasa} hrs` : ''} />
            <DataRow label="Actividad física"    value={ACTIVITY_LABEL[f.actividadFisica ?? ''] ?? f.actividadFisica ?? ''} />
            <DataRow label="Niños en el hogar"   value={yesNo(f.conviveConNinos)} />
            <DataRow label="Otras mascotas"      value={yesNo(f.conviveConMascotas)} />
            {f.conviveConMascotas && f.descripcionMascotas && (
              <DataRow label="Descripción mascotas" value={f.descripcionMascotas} />
            )}
          </div>

          {/* Experiencia */}
          <div className="ad-card">
            <h2 className="ad-card__title">
              <span className="material-symbols-outlined">pets</span>
              Experiencia y motivación
            </h2>
            <DataRow label="Experiencia previa"  value={yesNo(f.experienciaPrevia)} />
            {f.experienciaPrevia && f.descripcionExperiencia && (
              <DataRow label="Descripción"       value={f.descripcionExperiencia} />
            )}
            <DataRow label="Motivación"          value={f.motivacion ?? ''} />
          </div>

          {/* Comentarios */}
          {request.comentarios && (
            <div className="ad-card">
              <h2 className="ad-card__title">
                <span className="material-symbols-outlined">chat_bubble</span>
                Comentarios adicionales
              </h2>
              <p className="text-[0.9rem] text-[#3f3f46] font-[500] leading-relaxed">
                {request.comentarios}
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
