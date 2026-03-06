// Archivo 187 — modules/shelter/components/ShelterDonationsView.tsx
// Vista de resumen de donaciones del refugio (solo lectura — mock data).
// Incluye sección de configuración de donaciones (PayPal, Stripe, causa, toggle).
'use client'

import { useEffect, useState } from 'react'
import { donationService } from '@/modules/donations/infrastructure/DonationServiceFactory'
import { shelterService } from '@/modules/shelter/infrastructure/ShelterServiceFactory'
import type { Donation } from '@/modules/shared/domain/Donation'
import type { DonationConfig } from '@/modules/shared/domain/Donation'
import '../styles/shelterDashboard.css'
import '../styles/shelterViews.css'

const CURRENT_SHELTER_ID = 1

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number): string {
  return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

const PAYMENT_LABELS: Record<string, string> = {
  tarjeta:      'Tarjeta',
  paypal:       'PayPal',
  transferencia: 'Transferencia',
  efectivo:     'Efectivo',
}

const PAYMENT_ICONS: Record<string, string> = {
  tarjeta:      'credit_card',
  paypal:       'account_balance_wallet',
  transferencia: 'account_balance',
  efectivo:     'payments',
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmada',
  pending:   'Pendiente',
  failed:    'Fallida',
  refunded:  'Reembolsada',
}

// ─── Sección configuración ─────────────────────────────────────────────────

const DEFAULT_CONFIG: DonationConfig = {
  aceptaDonaciones: true,
  metaMensual:      5000,
  paypalEmail:      '',
  stripeAccountId:  '',
  descripcionCausa: '',
}

function DonationConfigSection() {
  const [config,    setConfig]    = useState<DonationConfig>(DEFAULT_CONFIG)
  const [isEditing, setIsEditing] = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [isSaving,  setIsSaving]  = useState(false)

  // C5 — Llamar al servicio real en lugar de solo cambiar estado local
  async function handleSave() {
    setIsSaving(true)
    try {
      await shelterService.updateShelterProfile(CURRENT_SHELTER_ID, { donationConfig: config })
      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      // En producción mostrar error; en mock nunca falla
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sd-card" style={{ marginTop: '1.5rem' }}>
      <div className="sd-card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="sd-card__title">
          <span className="material-symbols-outlined">settings</span>
          Configuración de donaciones
        </p>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.4rem 0.9rem', borderRadius: 999,
              border: '1.5px solid #e4e4e7', background: '#fff',
              fontSize: '0.78rem', fontWeight: 800, color: '#374151',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
            Editar
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: 999,
                border: '1.5px solid #e4e4e7', background: '#fff',
                fontSize: '0.78rem', fontWeight: 800, color: '#71717a',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: 999,
                border: 'none', background: '#ff6b6b',
                fontSize: '0.78rem', fontWeight: 800, color: '#fff',
                cursor: isSaving ? 'default' : 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                {isSaving ? 'progress_activity' : 'save'}
              </span>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {saved && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1rem', borderRadius: '0.75rem',
            background: '#dcfce7', border: '1.5px solid #bbf7d0',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#16a34a', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>Configuración guardada correctamente</p>
          </div>
        )}

        {/* Toggle aceptaDonaciones */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#fafafa', borderRadius: '0.85rem', border: '1.5px solid #f0f0f0' }}>
          <div>
            <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', marginBottom: '0.1rem' }}>Aceptar donaciones</p>
            <p style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>Activa o desactiva el botón de donar en tu perfil público</p>
          </div>
          <button
            type="button"
            onClick={() => isEditing && setConfig(c => ({ ...c, aceptaDonaciones: !c.aceptaDonaciones }))}
            style={{
              width: 44, height: 24, borderRadius: 999, border: 'none',
              background: config.aceptaDonaciones ? '#ff6b6b' : '#e4e4e7',
              cursor: isEditing ? 'pointer' : 'default',
              position: 'relative', transition: 'background 200ms ease', flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute', top: 3, left: config.aceptaDonaciones ? 23 : 3,
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              transition: 'left 200ms ease', display: 'block',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* PayPal email */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
            Correo PayPal / URL de pago externo
          </label>
          {isEditing ? (
            <input
              type="text"
              value={config.paypalEmail ?? ''}
              onChange={e => setConfig(c => ({ ...c, paypalEmail: e.target.value }))}
              placeholder="Ej: pagos@refugiohuellitas.org o https://paypal.me/refugio"
              style={{
                width: '100%', padding: '0.55rem 0.9rem',
                border: '1.5px solid #e4e4e7', borderRadius: '0.6rem',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <p style={{ fontSize: '0.85rem', color: config.paypalEmail ? '#18181b' : '#a1a1aa', fontWeight: config.paypalEmail ? 600 : 400 }}>
              {config.paypalEmail || 'No configurado'}
            </p>
          )}
          <p style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
            Los adoptantes serán dirigidos a esta URL al hacer clic en "Donar"
          </p>
        </div>

        {/* Stripe account ID */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
            Cuenta Stripe (ID)
          </label>
          {isEditing ? (
            <input
              type="text"
              value={config.stripeAccountId ?? ''}
              onChange={e => setConfig(c => ({ ...c, stripeAccountId: e.target.value }))}
              placeholder="Ej: acct_1234XXXXXX"
              style={{
                width: '100%', padding: '0.55rem 0.9rem',
                border: '1.5px solid #e4e4e7', borderRadius: '0.6rem',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <p style={{ fontSize: '0.85rem', color: config.stripeAccountId ? '#18181b' : '#a1a1aa', fontWeight: config.stripeAccountId ? 600 : 400 }}>
              {config.stripeAccountId || 'No configurado'}
            </p>
          )}
        </div>

        {/* Descripción de la causa */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
            Descripción de la causa
          </label>
          {isEditing ? (
            <textarea
              value={config.descripcionCausa ?? ''}
              onChange={e => setConfig(c => ({ ...c, descripcionCausa: e.target.value }))}
              placeholder="Explica a los donantes por qué necesitas su apoyo..."
              rows={3}
              maxLength={400}
              style={{
                width: '100%', padding: '0.55rem 0.9rem',
                border: '1.5px solid #e4e4e7', borderRadius: '0.6rem',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          ) : (
            <p style={{ fontSize: '0.85rem', color: config.descripcionCausa ? '#374151' : '#a1a1aa', lineHeight: 1.5 }}>
              {config.descripcionCausa || 'No configurado'}
            </p>
          )}
        </div>

        {/* Info nota */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem', background: '#f0f9ff', borderRadius: '0.75rem', border: '1.5px solid #bae6fd' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#0369a1', flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }}>info</span>
          <p style={{ fontSize: '0.75rem', color: '#0c4a6e', fontWeight: 500, lineHeight: 1.5 }}>
            Para integraciones avanzadas (Stripe Connect, SPEI automático, emisión de recibos fiscales) contacta al equipo de aDOGme en soporte@adogme.mx
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ShelterDonationsView() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  // A4 — Cargar donaciones desde el servicio (incluye las nuevas de initiateDonation)
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    donationService.getDonationsByRefugio(CURRENT_SHELTER_ID)
      .then(data => { if (!cancelled) setDonations(data) })
      .catch(() => { if (!cancelled) setError('No se pudieron cargar las donaciones') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const confirmed = donations.filter(d => d.status === 'confirmed')

  // Stats
  const now       = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const thisMes   = confirmed.filter(d => d.fecha.startsWith(thisMonth))

  const totalHistorico = confirmed.reduce((acc, d) => acc + d.monto, 0)
  const totalMes       = thisMes.reduce((acc, d) => acc + d.monto, 0)
  const totalDonantes  = new Set(confirmed.filter(d => !d.esAnonima).map(d => d.adoptanteId)).size

  const META_MENSUAL = 5000  // MXN — mock objetivo mensual
  const progreso = Math.min(100, Math.round((totalMes / META_MENSUAL) * 100))

  if (isLoading) return (
    <div className="sv-empty">
      <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
      <p className="sv-empty__title">Cargando donaciones...</p>
    </div>
  )

  if (error) return (
    <div className="sv-empty">
      <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>error</span>
      <p className="sv-empty__title">{error}</p>
    </div>
  )

  return (
    <>
      {/* ── Stats ── */}
      <div className="sv-donations-stats">

        <div className="sv-donation-stat">
          <p className="sv-donation-stat__label">Este mes</p>
          <p className="sv-donation-stat__value">{formatMXN(totalMes)}</p>
          <div className="sv-progress-bar">
            <div className="sv-progress-bar__fill" style={{ width: `${progreso}%` }} />
          </div>
          <p className="sv-donation-stat__sub">Meta: {formatMXN(META_MENSUAL)} ({progreso}%)</p>
        </div>

        <div className="sv-donation-stat">
          <p className="sv-donation-stat__label">Total histórico</p>
          <p className="sv-donation-stat__value">{formatMXN(totalHistorico)}</p>
          <p className="sv-donation-stat__sub">{confirmed.length} donaciones confirmadas</p>
        </div>

        <div className="sv-donation-stat">
          <p className="sv-donation-stat__label">Donantes únicos</p>
          <p className="sv-donation-stat__value">{totalDonantes}</p>
          <p className="sv-donation-stat__sub">Excluyendo anónimos</p>
        </div>

        <div className="sv-donation-stat">
          <p className="sv-donation-stat__label">Promedio</p>
          <p className="sv-donation-stat__value">
            {confirmed.length > 0 ? formatMXN(Math.round(totalHistorico / confirmed.length)) : '—'}
          </p>
          <p className="sv-donation-stat__sub">Por donación</p>
        </div>

      </div>

      {/* ── Tabla de donaciones ── */}
      <div className="sd-card">
        <div className="sd-card__header">
          <p className="sd-card__title">
            <span className="material-symbols-outlined">volunteer_activism</span>
            Historial de donaciones
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="sv-empty">
            <span className="material-symbols-outlined">volunteer_activism</span>
            <p className="sv-empty__title">Sin donaciones aún</p>
            <p className="sv-empty__sub">Las donaciones recibidas aparecerán aquí</p>
          </div>
        ) : (
          <div className="sv-table-wrap">
            <table className="sv-table">
              <thead>
                <tr>
                  <th>Donante</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 16, color: d.esAnonima ? '#a1a1aa' : '#ff6b6b', fontVariationSettings: "'FILL' 1" }}
                        >
                          {d.esAnonima ? 'person_off' : 'person'}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                          {d.esAnonima ? 'Anónimo' : (d.adoptanteNombre ?? '—')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 900, color: '#16a34a', fontSize: '0.88rem' }}>
                        {formatMXN(d.monto)}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#71717a' }}>
                          {PAYMENT_ICONS[d.metodoPago] ?? 'payments'}
                        </span>
                        {PAYMENT_LABELS[d.metodoPago] ?? d.metodoPago}
                      </span>
                    </td>
                    <td>
                      <span className="sd-date">{formatDate(d.fecha)}</span>
                    </td>
                    <td>
                      <span className={`sv-badge sv-badge--${
                        d.status === 'confirmed' ? 'approved' :
                        d.status === 'pending'   ? 'pending' :
                        d.status === 'failed'    ? 'rejected' : 'cancelled'
                      }`}>
                        {STATUS_LABELS[d.status] ?? d.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#71717a', fontStyle: d.concepto ? 'normal' : 'italic' }}>
                        {d.concepto ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Configuración */}
      <DonationConfigSection />
    </>
  )
}
