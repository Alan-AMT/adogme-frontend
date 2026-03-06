// modules/admin/components/AdminShelterDetailView.tsx
// Archivo 203 — Detalle completo del refugio. Documentación, panel de decisión, historial de cambios.

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminShelterDetail } from '../application/hooks/useAdminShelterDetail';
import '../styles/admin.css';

type ShelterStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

const STATUS_LABELS: Record<ShelterStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
};

const STATUS_BADGE_STYLES: Record<ShelterStatus, React.CSSProperties> = {
  pending: { background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a' },
  approved: { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
  rejected: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
  suspended: { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function deriveDate(iso: string, offsetDays: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

interface AdminShelterDetailViewProps {
  id: number;
}

export default function AdminShelterDetailView({ id }: AdminShelterDetailViewProps) {
  const { shelter, isLoading, isSaving, error, success, updateStatus } =
    useAdminShelterDetail(id);

  const [selectedStatus, setSelectedStatus] = useState<ShelterStatus>('pending');
  const [nota, setNota] = useState('');

  useEffect(() => {
    if (shelter) {
      setSelectedStatus(shelter.status as ShelterStatus);
    }
  }, [shelter]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 200,
              borderRadius: '1.2rem',
              background: '#f4f4f5',
              animation: 'pulse 1.5s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  if (error || !shelter) {
    return (
      <p style={{ color: '#dc2626', padding: '1rem' }}>
        {error ?? 'No se pudo cargar el refugio.'}
      </p>
    );
  }

  const shelterStatus = shelter.status as ShelterStatus;

  // Build mock timeline
  type TimelineEvent = { status: ShelterStatus; date: string; nota: string };
  const timeline: TimelineEvent[] = [
    { status: 'pending', date: shelter.fechaRegistro, nota: 'Solicitud recibida' },
  ];
  if (shelterStatus === 'approved') {
    timeline.push({
      status: 'approved',
      date: deriveDate(shelter.fechaRegistro, 5),
      nota: 'Documentación verificada correctamente',
    });
  } else if (shelterStatus === 'rejected') {
    timeline.push({
      status: 'rejected',
      date: deriveDate(shelter.fechaRegistro, 3),
      nota: 'Documentos insuficientes',
    });
  } else if (shelterStatus === 'suspended') {
    timeline.push({
      status: 'approved',
      date: deriveDate(shelter.fechaRegistro, 5),
      nota: 'Documentación verificada correctamente',
    });
    timeline.push({
      status: 'suspended',
      date: deriveDate(shelter.fechaRegistro, 30),
      nota: 'Reportes de incumplimiento',
    });
  }

  async function handleSave() {
    await updateStatus(selectedStatus, nota);
  }

  const badgeStyle = STATUS_BADGE_STYLES[shelterStatus];

  return (
    <>
      {/* Back link */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href="/admin/refugios"
          className="ad-action-link"
          style={{ fontSize: '0.875rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Volver a refugios
        </Link>
      </div>

      {/* Header card */}
      <div className="ad-card" style={{ marginBottom: '1.25rem', padding: 0, overflow: 'hidden' }}>
        {/* Portada / cover */}
        <div style={{ position: 'relative', height: 140, background: '#f4f4f5' }}>
          {shelter.imagenPortada ? (
            <Image
              src={shelter.imagenPortada}
              alt={`Portada de ${shelter.nombre}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #ff6b6b22 0%, #3b82f622 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#d4d4d8' }}>home_work</span>
            </div>
          )}
        </div>

        {/* Logo + info */}
        <div style={{ padding: '0 1.5rem 1.25rem', display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: -28 }}>
          <div style={{ flexShrink: 0 }}>
            {shelter.logo ? (
              <Image
                src={shelter.logo}
                alt={shelter.nombre}
                width={56}
                height={56}
                style={{
                  borderRadius: '1rem',
                  border: '2.5px solid #fff',
                  objectFit: 'cover',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '1rem',
                  border: '2.5px solid #fff',
                  background: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#a1a1aa' }}>home_work</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1, paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#18181b' }}>
                {shelter.nombre}
              </h1>
              <span
                style={{
                  ...badgeStyle,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {STATUS_LABELS[shelterStatus]}
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0', color: '#71717a', fontSize: '0.875rem' }}>
              {shelter.ciudad}, {shelter.estado}
            </p>
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div className="ad-detail-grid">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* General info */}
          <div className="ad-card">
            <div className="ad-card__header">
              <span className="ad-card__title">Información general</span>
            </div>
            <div>
              {[
                { label: 'Nombre', value: shelter.nombre },
                { label: 'Descripción', value: shelter.descripcion || '—' },
                { label: 'Correo', value: shelter.correo },
                { label: 'Teléfono', value: shelter.telefono || '—' },
                { label: 'Ubicación', value: shelter.ubicacion || '—' },
                { label: 'Slug', value: shelter.slug },
                { label: 'Fecha de registro', value: formatDate(shelter.fechaRegistro) },
                { label: 'Total de perros', value: shelter.totalPerros?.toString() ?? '—' },
                { label: 'Perros disponibles', value: shelter.perrosDisponibles?.toString() ?? '—' },
                { label: 'Adopciones realizadas', value: shelter.adopcionesRealizadas?.toString() ?? '—' },
                { label: 'Calificación', value: shelter.calificacion !== undefined ? `${shelter.calificacion.toFixed(1)} / 5` : '—' },
                {
                  label: 'Acepta donaciones',
                  value: shelter.donationConfig?.aceptaDonaciones ? 'Sí' : 'No',
                },
              ].map(({ label, value }) => (
                <div key={label} className="ad-info-row">
                  <span className="ad-info-row__label">{label}</span>
                  <span className="ad-info-row__value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social networks */}
          <div className="ad-card">
            <div className="ad-card__header">
              <span className="ad-card__title">Redes sociales</span>
            </div>
            {shelter.redesSociales &&
            Object.values(shelter.redesSociales).some(Boolean) ? (
              <div>
                {shelter.redesSociales.facebook && (
                  <div className="ad-info-row">
                    <span className="ad-info-row__label">Facebook</span>
                    <a
                      href={shelter.redesSociales.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ad-action-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      {shelter.redesSociales.facebook}
                    </a>
                  </div>
                )}
                {shelter.redesSociales.instagram && (
                  <div className="ad-info-row">
                    <span className="ad-info-row__label">Instagram</span>
                    <a
                      href={shelter.redesSociales.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ad-action-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      {shelter.redesSociales.instagram}
                    </a>
                  </div>
                )}
                {shelter.redesSociales.twitter && (
                  <div className="ad-info-row">
                    <span className="ad-info-row__label">Twitter / X</span>
                    <a
                      href={shelter.redesSociales.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ad-action-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      {shelter.redesSociales.twitter}
                    </a>
                  </div>
                )}
                {shelter.redesSociales.web && (
                  <div className="ad-info-row">
                    <span className="ad-info-row__label">Sitio web</span>
                    <a
                      href={shelter.redesSociales.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ad-action-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      {shelter.redesSociales.web}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.875rem' }}>No configurado</p>
            )}
          </div>

          {/* Documentation */}
          <div className="ad-card">
            <div className="ad-card__header">
              <span className="ad-card__title">Documentación</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#0369a1', flexShrink: 0, marginTop: 1 }}>info</span>
              <p style={{ margin: 0, color: '#0369a1', fontSize: '0.875rem', lineHeight: 1.6 }}>
                En producción, aquí aparecerán los documentos legales del refugio (acta constitutiva, RFC, identificación oficial del responsable, etc.) para su revisión antes de aprobar la solicitud.
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Manage status */}
          <div className="ad-card">
            <div className="ad-card__header">
              <span className="ad-card__title">Gestionar estado</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className="ad-field">
                <label className="ad-field__label">Estado del refugio</label>
                <select
                  className="ad-status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ShelterStatus)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>
              <div className="ad-field">
                <label className="ad-field__label">Nota interna</label>
                <textarea
                  className="ad-field__textarea"
                  rows={4}
                  placeholder="Nota interna..."
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '0.6rem',
                  border: 'none',
                  background: isSaving ? '#ffa5a5' : '#ff6b6b',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.15s',
                  width: '100%',
                }}
              >
                {isSaving ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 16,
                        height: 16,
                        border: '2px solid #fff6',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>save</span>
                    Guardar cambios
                  </>
                )}
              </button>
              {success && (
                <p
                  style={{
                    margin: 0,
                    color: '#16a34a',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                  Estado actualizado correctamente.
                </p>
              )}
              {error && !isLoading && (
                <p
                  style={{
                    margin: 0,
                    color: '#dc2626',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Change history timeline */}
          <div className="ad-card">
            <div className="ad-card__header">
              <span className="ad-card__title">Historial de cambios</span>
            </div>
            <div className="ad-timeline">
              {timeline.map((event, i) => (
                <div key={i} className="ad-timeline-item">
                  <div className={`ad-timeline-dot ad-timeline-dot--${event.status}`} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#18181b', fontSize: '0.875rem' }}>
                      {STATUS_LABELS[event.status]}
                    </p>
                    <p style={{ margin: '0.125rem 0 0', color: '#71717a', fontSize: '0.8rem' }}>
                      {event.nota}
                    </p>
                    <p style={{ margin: '0.2rem 0 0', color: '#a1a1aa', fontSize: '0.75rem' }}>
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
