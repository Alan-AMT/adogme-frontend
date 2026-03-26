// modules/donations/components/DonationHistoryView.tsx
// B1 — Historial de donaciones del adoptante autenticado.
//
// Muestra: refugio, monto, fecha, método, estado, ID transacción.
// Estado vacío con CTA a /refugios.
'use client'

import Link from 'next/link'
import { useDonationHistory } from '@/modules/donations/application/hooks/useDonationHistory'
import '@/modules/donations/styles/donations.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number): string {
  return amount.toLocaleString('es-MX', {
    style:                 'currency',
    currency:              'MXN',
    minimumFractionDigits: 0,
  })
}

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

const PAYMENT_LABEL: Record<string, string> = {
  tarjeta:      'Tarjeta',
  paypal:       'PayPal',
  transferencia: 'Transferencia',
  efectivo:     'Efectivo',
}

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmada',
  pending:   'Pendiente',
  failed:    'Fallida',
  refunded:  'Reembolsada',
}

const STATUS_CLASS: Record<string, string> = {
  confirmed: 'dn-history-badge--confirmed',
  pending:   'dn-history-badge--pending',
  failed:    'dn-history-badge--failed',
  refunded:  'dn-history-badge--refunded',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DonationHistoryView() {
  const { donations, isLoading, error } = useDonationHistory()

  if (isLoading) {
    return (
      <div className="dn-history-empty">
        <p className="dn-history-empty__title">Cargando historial...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dn-history-empty">
        <p className="dn-history-empty__title" style={{ color: '#ef4444' }}>{error}</p>
      </div>
    )
  }

  if (donations.length === 0) {
    return (
      <div className="dn-history-empty">
        <span className="dn-history-empty__icon">🐾</span>
        <p className="dn-history-empty__title">Aún no has realizado donaciones</p>
        <p className="dn-history-empty__sub">
          Tu apoyo hace la diferencia. Conoce los refugios y elige a quién ayudar.
        </p>
        <Link href="/refugios" className="dn-conf-primary-btn" style={{ marginTop: '1rem' }}>
          Explorar refugios
        </Link>
      </div>
    )
  }

  return (
    <div className="dn-history">

      <div className="dn-history-summary">
        <div className="dn-history-summary__item">
          <span className="dn-history-summary__value">
            {donations.filter(d => d.status === 'confirmed').length}
          </span>
          <span className="dn-history-summary__label">Donaciones confirmadas</span>
        </div>
        <div className="dn-history-summary__item">
          <span className="dn-history-summary__value">
            {formatMXN(
              donations
                .filter(d => d.status === 'confirmed')
                .reduce((sum, d) => sum + d.monto, 0)
            )}
          </span>
          <span className="dn-history-summary__label">Total donado</span>
        </div>
        <div className="dn-history-summary__item">
          <span className="dn-history-summary__value">
            {new Set(donations.map(d => d.refugioId)).size}
          </span>
          <span className="dn-history-summary__label">Refugios apoyados</span>
        </div>
      </div>

      <div className="dn-history-list">
        {donations.map(d => (
          <div key={d.id} className="dn-history-card">

            {/* Left: refugio + fecha */}
            <div className="dn-history-card__main">
              {d.refugioLogo && (
                <img
                  src={d.refugioLogo}
                  alt={d.refugioNombre ?? 'Refugio'}
                  className="dn-history-card__logo"
                />
              )}
              <div>
                <p className="dn-history-card__shelter">
                  {d.refugioNombre ?? 'Refugio'}
                </p>
                <p className="dn-history-card__date">{formatDate(d.fecha)}</p>
                {d.concepto && (
                  <p className="dn-history-card__concepto">"{d.concepto}"</p>
                )}
              </div>
            </div>

            {/* Right: monto + método + estado */}
            <div className="dn-history-card__meta">
              <span className="dn-history-card__amount">{formatMXN(d.monto)}</span>
              <span className="dn-history-card__method">
                {PAYMENT_LABEL[d.metodoPago] ?? d.metodoPago}
              </span>
              <span className={`dn-history-badge ${STATUS_CLASS[d.status] ?? ''}`}>
                {STATUS_LABEL[d.status] ?? d.status}
              </span>
              {d.transactionId && (
                <span className="dn-history-card__txn">ID: {d.transactionId}</span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
