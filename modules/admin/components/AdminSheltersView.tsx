// modules/admin/components/AdminSheltersView.tsx
// Archivo 202 — Lista de refugios por estado. Pendientes: aprobar / rechazar con modal. Activos: tabla con búsqueda + suspender.

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminShelters } from '../application/hooks/useAdminShelters';
import '../styles/admin.css';

type TabKey = 'pending' | 'approved' | 'suspended';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'ad-badge ad-badge--pending' },
  approved: { label: 'Aprobado', className: 'ad-badge ad-badge--approved' },
  rejected: { label: 'Rechazado', className: 'ad-badge ad-badge--rejected' },
  suspended: { label: 'Suspendido', className: 'ad-badge ad-badge--suspended' },
};

export default function AdminSheltersView() {
  const { shelters, isLoading, isUpdating, approve, reject, suspend } = useAdminShelters();

  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectNota, setRejectNota] = useState('');
  const [search, setSearch] = useState('');

  const pendingShelters = shelters.filter((s) => s.status === 'pending');
  const approvedShelters = shelters
    .filter((s) => s.status === 'approved')
    .filter(
      (s) =>
        search.trim() === '' ||
        s.nombre.toLowerCase().includes(search.toLowerCase()) ||
        s.ciudad.toLowerCase().includes(search.toLowerCase())
    );
  const inactiveShelters = shelters.filter(
    (s) => s.status === 'suspended' || s.status === 'rejected'
  );

  const TABS: Array<{ key: TabKey; label: string; count?: number }> = [
    { key: 'pending', label: 'Pendientes', count: pendingShelters.length },
    { key: 'approved', label: 'Activos' },
    { key: 'suspended', label: 'Suspendidos / Rechazados' },
  ];

  async function handleApprove(id: number) {
    await approve(id);
  }

  async function handleConfirmReject() {
    if (rejectTarget === null) return;
    await reject(rejectTarget, rejectNota);
    setRejectTarget(null);
    setRejectNota('');
  }

  async function handleSuspend(id: number) {
    await suspend(id);
  }

  if (isLoading) {
    return (
      <div className="ad-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ad-skel-row" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Reject modal */}
      {rejectTarget !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '1.75rem',
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 0.25rem', color: '#18181b', fontSize: '1.1rem', fontWeight: 700 }}>
              ¿Rechazar refugio?
            </h3>
            <p style={{ margin: '0 0 1rem', color: '#71717a', fontSize: '0.875rem' }}>
              {shelters.find((s) => s.id === rejectTarget)?.nombre ?? ''}
            </p>
            <textarea
              className="ad-field__textarea"
              rows={4}
              placeholder="Motivo del rechazo..."
              value={rejectNota}
              onChange={(e) => setRejectNota(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setRejectTarget(null); setRejectNota(''); }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: '1.5px solid #e4e4e7',
                  background: '#fff',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isUpdating}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: '1.5px solid #fca5a5',
                  background: '#fee2e2',
                  color: '#991b1b',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  opacity: isUpdating ? 0.7 : 1,
                }}
              >
                {isUpdating ? 'Procesando...' : 'Confirmar rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="ad-tabs" style={{ marginBottom: '1.25rem' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2.5px solid #ff6b6b' : '2.5px solid transparent',
                color: isActive ? '#ff6b6b' : '#71717a',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                transition: 'color 0.15s, border-color 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    background: '#ff6b6b',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.05rem 0.45rem',
                    lineHeight: 1.6,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Pendientes */}
      {activeTab === 'pending' && (
        <div className="ad-card">
          <div className="ad-card__header">
            <span className="ad-card__title">Refugios pendientes de aprobación</span>
          </div>
          {pendingShelters.length === 0 ? (
            <div className="ad-empty">
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#a1a1aa', display: 'block', marginBottom: '0.5rem' }}>check_circle</span>
              <p style={{ color: '#71717a', margin: 0 }}>No hay solicitudes pendientes.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {pendingShelters.map((s) => (
                <div key={s.id} className="ad-pending-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1 }}>
                    {s.logo ? (
                      <Image
                        src={s.logo}
                        alt={s.nombre}
                        width={48}
                        height={48}
                        style={{ borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '0.75rem',
                          background: '#f4f4f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#a1a1aa' }}>home_work</span>
                      </div>
                    )}
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: '#18181b', fontSize: '0.975rem' }}>{s.nombre}</p>
                      <p style={{ margin: '0.125rem 0 0', color: '#71717a', fontSize: '0.8rem' }}>
                        {s.ciudad} &middot; Registro: {formatDate(s.fechaRegistro)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0, alignItems: 'center' }}>
                    <Link
                      href={`/admin/refugios/${s.id}`}
                      className="ad-action-link"
                      style={{ marginRight: '0.25rem' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                      Ver detalle
                    </Link>
                    <button
                      onClick={() => handleApprove(s.id)}
                      disabled={isUpdating}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid #86efac',
                        background: '#dcfce7',
                        color: '#166534',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        opacity: isUpdating ? 0.7 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>
                      Aprobar
                    </button>
                    <button
                      onClick={() => { setRejectTarget(s.id); setRejectNota(''); }}
                      disabled={isUpdating}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid #fca5a5',
                        background: '#fee2e2',
                        color: '#991b1b',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        opacity: isUpdating ? 0.7 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>cancel</span>
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Activos */}
      {activeTab === 'approved' && (
        <div className="ad-card">
          <div className="ad-card__header">
            <span className="ad-card__title">Refugios activos</span>
          </div>
          <div className="ad-toolbar" style={{ marginBottom: '1rem' }}>
            <div className="ad-search">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#a1a1aa', position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)' }}>
                search
              </span>
              <input
                className="ad-search__input"
                type="text"
                placeholder="Buscar por nombre o ciudad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {approvedShelters.length === 0 ? (
            <div className="ad-empty">
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#a1a1aa', display: 'block', marginBottom: '0.5rem' }}>search_off</span>
              <p style={{ color: '#71717a', margin: 0 }}>No se encontraron refugios activos.</p>
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Refugio</th>
                  <th>Ciudad</th>
                  <th>Calificación</th>
                  <th>Perros disp.</th>
                  <th>Adopciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {approvedShelters.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="ad-shelter-cell">
                        {s.logo ? (
                          <img
                            src={s.logo}
                            alt={s.nombre}
                            className="ad-shelter-cell__img"
                            width={36}
                            height={36}
                            style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="ad-shelter-cell__img"
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '0.5rem',
                              background: '#f4f4f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a1a1aa' }}>home_work</span>
                          </div>
                        )}
                        <span className="ad-shelter-cell__name">{s.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ad-shelter-cell__city">{s.ciudad}</span>
                    </td>
                    <td>
                      {s.calificacion !== undefined ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>star</span>
                          {s.calificacion.toFixed(1)}
                        </span>
                      ) : (
                        <span style={{ color: '#a1a1aa' }}>—</span>
                      )}
                    </td>
                    <td>{s.perrosDisponibles ?? '—'}</td>
                    <td>{s.adopcionesRealizadas ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link href={`/admin/refugios/${s.id}`} className="ad-action-link">
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                          Ver
                        </Link>
                        <button
                          onClick={() => handleSuspend(s.id)}
                          disabled={isUpdating}
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: '0.4rem',
                            border: '1.5px solid #fde68a',
                            background: '#fef9c3',
                            color: '#92400e',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            opacity: isUpdating ? 0.7 : 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>block</span>
                          Suspender
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Suspendidos/Rechazados */}
      {activeTab === 'suspended' && (
        <div className="ad-card">
          <div className="ad-card__header">
            <span className="ad-card__title">Refugios suspendidos y rechazados</span>
          </div>
          {inactiveShelters.length === 0 ? (
            <div className="ad-empty">
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#a1a1aa', display: 'block', marginBottom: '0.5rem' }}>check_circle</span>
              <p style={{ color: '#71717a', margin: 0 }}>No hay refugios suspendidos ni rechazados.</p>
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Refugio</th>
                  <th>Ciudad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inactiveShelters.map((s) => {
                  const badgeInfo = STATUS_BADGE[s.status] ?? STATUS_BADGE['pending'];
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="ad-shelter-cell">
                          {s.logo ? (
                            <img
                              src={s.logo}
                              alt={s.nombre}
                              className="ad-shelter-cell__img"
                              width={36}
                              height={36}
                              style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="ad-shelter-cell__img"
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: '0.5rem',
                                background: '#f4f4f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a1a1aa' }}>home_work</span>
                            </div>
                          )}
                          <span className="ad-shelter-cell__name">{s.nombre}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ad-shelter-cell__city">{s.ciudad}</span>
                      </td>
                      <td>
                        <span className={badgeInfo.className}>{badgeInfo.label}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link href={`/admin/refugios/${s.id}`} className="ad-action-link">
                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                            Ver
                          </Link>
                          <button
                            onClick={() => handleApprove(s.id)}
                            disabled={isUpdating}
                            style={{
                              padding: '0.3rem 0.75rem',
                              borderRadius: '0.4rem',
                              border: '1.5px solid #86efac',
                              background: '#dcfce7',
                              color: '#166534',
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              opacity: isUpdating ? 0.7 : 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                            Aprobar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
