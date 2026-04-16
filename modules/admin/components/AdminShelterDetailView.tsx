// modules/admin/components/AdminShelterDetailView.tsx
// Detalle completo del refugio — panel de gestión de estado e historial.

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminShelterDetail } from '../application/hooks/useAdminShelterDetail';
import '@/modules/shelter/styles/shelterDashboard.css';
import '../styles/admin.css';

type ShelterStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

const STATUS_LABELS: Record<ShelterStatus, string> = {
  pending:   'Pendiente',
  approved:  'Aprobado',
  rejected:  'Rechazado',
  suspended: 'Suspendido',
};

const STATUS_BADGE: Record<ShelterStatus, React.CSSProperties> = {
  pending:   { background: '#fef9c3', color: '#92400e', border: '1.5px solid #fde68a' },
  approved:  { background: '#dcfce7', color: '#166534', border: '1.5px solid #86efac' },
  rejected:  { background: '#fee2e2', color: '#991b1b', border: '1.5px solid #fca5a5' },
  suspended: { background: '#f3f4f6', color: '#374151', border: '1.5px solid #d1d5db' },
};

const STATUS_ICONS: Record<ShelterStatus, string> = {
  pending:   'schedule',
  approved:  'check_circle',
  rejected:  'cancel',
  suspended: 'pause_circle',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function deriveDate(iso: string, offsetDays: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

interface InfoRowProps { label: string; value: string; mono?: boolean }
function InfoRow({ label, value, mono = false }: InfoRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.7rem 0', borderBottom: '1px solid #f4f4f5' }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#18181b', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  );
}

interface AdminShelterDetailViewProps { id: string }

export default function AdminShelterDetailView({ id }: AdminShelterDetailViewProps) {
  const { shelter, isLoading, isSaving, error, success, updateStatus } = useAdminShelterDetail(id);
  const [selectedStatus, setSelectedStatus] = useState<ShelterStatus>('pending');
  const [nota, setNota] = useState('');

  useEffect(() => {
    if (shelter) setSelectedStatus(shelter.status as ShelterStatus);
  }, [shelter]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[280, 180, 120].map((h, i) => (
          <div key={i} style={{ height: h, borderRadius: '1.2rem', background: '#f4f4f5', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  if (error || !shelter) {
    return <p style={{ color: '#dc2626', padding: '1rem' }}>{error ?? 'No se pudo cargar el refugio.'}</p>;
  }

  const shelterStatus = shelter.status as ShelterStatus;

  // Timeline mock
  type TimelineEvent = { status: ShelterStatus; date: string; nota: string };
  const timeline: TimelineEvent[] = [
    { status: 'pending', date: shelter.fechaRegistro, nota: 'Solicitud recibida' },
  ];
  if (shelterStatus === 'approved') {
    timeline.push({ status: 'approved', date: deriveDate(shelter.fechaRegistro, 5), nota: 'Documentación verificada correctamente' });
  } else if (shelterStatus === 'rejected') {
    timeline.push({ status: 'rejected', date: deriveDate(shelter.fechaRegistro, 3), nota: 'Documentos insuficientes' });
  } else if (shelterStatus === 'suspended') {
    timeline.push({ status: 'approved',  date: deriveDate(shelter.fechaRegistro, 5),  nota: 'Documentación verificada correctamente' });
    timeline.push({ status: 'suspended', date: deriveDate(shelter.fechaRegistro, 30), nota: 'Reportes de incumplimiento' });
  }

  return (
    <>
      {/* Back */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link href="/admin/refugios" className="ad-action-link" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Volver a refugios
        </Link>
      </div>

      {/* ── Hero card ─────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: '1.4rem', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>

        {/* Cover */}
        <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #ff6b6b22 0%, #3b82f622 100%)' }}>
          {shelter.imagenPortada ? (
            <Image src={shelter.imagenPortada} alt={`Portada de ${shelter.nombre}`} fill sizes="900px" style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#d4d4d8' }}>home_work</span>
            </div>
          )}
          {/* Overlay gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
        </div>

        {/* Identity row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem', padding: '1.25rem 1.75rem 1.5rem', flexWrap: 'wrap' }}>

          {/* Logo */}
          <div style={{ flexShrink: 0, marginTop: '-2.5rem', zIndex: 1 }}>
            {shelter.logo ? (
              <Image
                src={shelter.logo}
                alt={shelter.nombre}
                width={72}
                height={72}
                style={{ borderRadius: '1.1rem', border: '3px solid #fff', objectFit: 'cover', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: '1.1rem', border: '3px solid #fff',
                background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#a1a1aa' }}>home_work</span>
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 200, paddingTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#18181b', lineHeight: 1.2 }}>
                {shelter.nombre}
              </h1>
              <span style={{ ...STATUS_BADGE[shelterStatus], padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>{STATUS_ICONS[shelterStatus]}</span>
                {STATUS_LABELS[shelterStatus]}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#71717a', fontWeight: 500 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>location_on</span>
                {shelter.alcaldia ?? shelter.ubicacion}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#71717a', fontWeight: 500 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                Desde {formatDate(shelter.fechaRegistro)}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignSelf: 'center' }}>
            {[
              { icon: 'pets',           label: 'Perros',      value: shelter.totalPerros?.toString() ?? '—' },
              { icon: 'favorite',       label: 'Adopciones',  value: shelter.adopcionesRealizadas?.toString() ?? '—' },
              { icon: 'star',           label: 'Calificación', value: shelter.calificacion !== undefined ? `${shelter.calificacion.toFixed(1)}` : '—' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '0.85rem', padding: '0.65rem 1rem', minWidth: 70 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ff6b6b', fontVariationSettings: "'FILL' 1", display: 'block', marginBottom: '0.15rem' }}>{s.icon}</span>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.68rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Detail grid ──────────────────────────────────────────────────────── */}
      <div className="ad-detail-grid">

        {/* ── Left: info cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* General info — 2 col grid */}
          <div className="sd-card">
            <div className="sd-card__header">
              <p className="sd-card__title">
                <span className="material-symbols-outlined">info</span>
                Información general
              </p>
            </div>
            <div style={{ padding: '0 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0 2rem' }}>
              <InfoRow label="Nombre"        value={shelter.nombre} />
              <InfoRow label="Correo"        value={shelter.correo} />
              <InfoRow label="Teléfono"      value={shelter.telefono || '—'} />
              <InfoRow label="Ubicación"     value={shelter.ubicacion || '—'} />
              <InfoRow label="Slug"          value={shelter.slug} mono />
              <InfoRow label="Fecha de registro" value={formatDate(shelter.fechaRegistro)} />
            </div>
            {shelter.descripcion && (
              <div style={{ padding: '0.75rem 1.25rem 1.25rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                  Descripción
                </span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', lineHeight: 1.65, fontWeight: 500 }}>
                  {shelter.descripcion}
                </p>
              </div>
            )}
          </div>

          {/* Donation config */}
          <div className="sd-card">
            <div className="sd-card__header">
              <p className="sd-card__title">
                <span className="material-symbols-outlined">volunteer_activism</span>
                Configuración de donaciones
              </p>
              <span style={{
                fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 999,
                background: shelter.donationConfig?.aceptaDonaciones ? '#dcfce7' : '#f4f4f5',
                color: shelter.donationConfig?.aceptaDonaciones ? '#166534' : '#71717a',
                border: `1.5px solid ${shelter.donationConfig?.aceptaDonaciones ? '#86efac' : '#e4e4e7'}`,
              }}>
                {shelter.donationConfig?.aceptaDonaciones ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div style={{ padding: '0 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0 2rem' }}>
              {shelter.donationConfig?.cuentaClabe && (
                <InfoRow label="CLABE" value={shelter.donationConfig.cuentaClabe} mono />
              )}
              {shelter.donationConfig?.banco && (
                <InfoRow label="Banco" value={shelter.donationConfig.banco} />
              )}
              {shelter.donationConfig?.titularCuenta && (
                <InfoRow label="Titular" value={shelter.donationConfig.titularCuenta} />
              )}
              {shelter.donationConfig?.paypalLink && (
                <InfoRow label="PayPal" value={shelter.donationConfig.paypalLink} />
              )}
              {shelter.donationConfig?.mercadoPagoLink && (
                <InfoRow label="MercadoPago" value={shelter.donationConfig.mercadoPagoLink} />
              )}
              {!shelter.donationConfig?.cuentaClabe && !shelter.donationConfig?.paypalLink && !shelter.donationConfig?.mercadoPagoLink && (
                <div style={{ padding: '1rem 0', gridColumn: '1 / -1' }}>
                  <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem', fontStyle: 'italic' }}>Sin métodos de pago configurados</p>
                </div>
              )}
            </div>
          </div>

          {/* Social networks */}
          <div className="sd-card">
            <div className="sd-card__header">
              <p className="sd-card__title">
                <span className="material-symbols-outlined">share</span>
                Redes sociales
              </p>
            </div>
            <div style={{ padding: '0.5rem 1.25rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {shelter.redesSociales && Object.values(shelter.redesSociales).some(Boolean) ? (
                <>
                  {shelter.redesSociales.facebook && (
                    <a href={shelter.redesSociales.facebook} target="_blank" rel="noopener noreferrer" className="ad-action-link" style={{ padding: '0.4rem 0.85rem', border: '1.5px solid #e4e4e7', borderRadius: '999px', fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                      Facebook
                    </a>
                  )}
                  {shelter.redesSociales.instagram && (
                    <a href={shelter.redesSociales.instagram} target="_blank" rel="noopener noreferrer" className="ad-action-link" style={{ padding: '0.4rem 0.85rem', border: '1.5px solid #e4e4e7', borderRadius: '999px', fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                      Instagram
                    </a>
                  )}
                  {shelter.redesSociales.twitter && (
                    <a href={shelter.redesSociales.twitter} target="_blank" rel="noopener noreferrer" className="ad-action-link" style={{ padding: '0.4rem 0.85rem', border: '1.5px solid #e4e4e7', borderRadius: '999px', fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                      Twitter / X
                    </a>
                  )}
                  {shelter.redesSociales.web && (
                    <a href={shelter.redesSociales.web} target="_blank" rel="noopener noreferrer" className="ad-action-link" style={{ padding: '0.4rem 0.85rem', border: '1.5px solid #e4e4e7', borderRadius: '999px', fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                      Sitio web
                    </a>
                  )}
                </>
              ) : (
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem', fontStyle: 'italic' }}>No configurado</p>
              )}
            </div>
          </div>

          {/* Documentation note */}
          <div className="sd-card">
            <div className="sd-card__header">
              <p className="sd-card__title">
                <span className="material-symbols-outlined">folder_open</span>
                Documentación
              </p>
            </div>
            <div style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.85rem', padding: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0369a1', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>info</span>
                <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.82rem', lineHeight: 1.6, fontWeight: 500 }}>
                  En producción, aquí aparecerán los documentos legales del refugio (acta constitutiva, RFC, identificación oficial del responsable, etc.) para su revisión antes de aprobar la solicitud.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right: manage + timeline ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Manage status */}
          <div className="sd-card">
            <div className="sd-card__header">
              <p className="sd-card__title">
                <span className="material-symbols-outlined">manage_accounts</span>
                Gestionar estado
              </p>
            </div>
            <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Estado actual */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#fafafa', borderRadius: '0.85rem', border: '1.5px solid #f0f0f0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717a' }}>Estado actual</span>
                <span style={{ ...STATUS_BADGE[shelterStatus], padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>{STATUS_ICONS[shelterStatus]}</span>
                  {STATUS_LABELS[shelterStatus]}
                </span>
              </div>

              <div className="ad-field">
                <label className="ad-field__label">Cambiar a</label>
                <select
                  className="ad-status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ShelterStatus)}
                  style={{ width: '100%' }}
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>

              <div className="ad-field">
                <label className="ad-field__label">Nota interna (opcional)</label>
                <textarea
                  className="ad-field__textarea"
                  rows={4}
                  placeholder="Motivo del cambio, observaciones..."
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <button
                onClick={() => updateStatus(selectedStatus, nota)}
                disabled={isSaving}
                style={{
                  width: '100%', padding: '0.7rem 1.25rem', borderRadius: '0.75rem',
                  border: 'none', background: isSaving ? '#ffa5a5' : '#ff6b6b', color: '#fff',
                  fontWeight: 800, fontSize: '0.9rem', cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background 150ms ease', fontFamily: 'inherit',
                }}
              >
                {isSaving ? (
                  <>
                    <span style={{ display: 'inline-block', width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>save</span>
                    Guardar cambios
                  </>
                )}
              </button>

              {success && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#16a34a', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p style={{ margin: 0, color: '#166534', fontSize: '0.82rem', fontWeight: 700 }}>Estado actualizado correctamente.</p>
                </div>
              )}
              {error && !isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#dc2626', fontVariationSettings: "'FILL' 1" }}>error</span>
                  <p style={{ margin: 0, color: '#991b1b', fontSize: '0.82rem', fontWeight: 700 }}>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="sd-card">
            <div className="sd-card__header">
              <p className="sd-card__title">
                <span className="material-symbols-outlined">history</span>
                Historial de cambios
              </p>
            </div>
            <div style={{ padding: '0.75rem 1.25rem 1.25rem' }}>
              <div className="ad-timeline">
                {timeline.map((event, i) => (
                  <div key={i} className="ad-timeline-item">
                    <div className={`ad-timeline-dot ad-timeline-dot--${event.status}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>
                        {STATUS_ICONS[event.status]}
                      </span>
                    </div>
                    <div style={{ flex: 1, paddingTop: '0.1rem' }}>
                      <p style={{ margin: 0, fontWeight: 800, color: '#18181b', fontSize: '0.85rem' }}>
                        {STATUS_LABELS[event.status]}
                      </p>
                      <p style={{ margin: '0.15rem 0 0', color: '#71717a', fontSize: '0.78rem', fontWeight: 500 }}>
                        {event.nota}
                      </p>
                      <p style={{ margin: '0.2rem 0 0', color: '#a1a1aa', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>calendar_today</span>
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
