// modules/donations/components/DonationConfirmation.tsx
// Archivo 215 — Pantalla de éxito post-donación.
//
// Animación: CSS-only check (circle pop + SVG stroke draw + confetti dots)
// Receipt: transactionId, monto, refugio, fecha, método de pago
// CTAs: "Ver más perros de este refugio" + "Volver al inicio"
'use client'

import Link from 'next/link'
import type { Donation } from '@/modules/shared/domain/Donation'
import '@/modules/donations/styles/donations.css'

// ─── Confetti dots ────────────────────────────────────────────────────────────

const CONFETTI = [
  { color: '#e53e3e', tx: 'translate(-36px,-40px)' },
  { color: '#f59e0b', tx: 'translate(36px,-40px)' },
  { color: '#38a169', tx: 'translate(-48px,-10px)' },
  { color: '#3b82f6', tx: 'translate(48px,-10px)' },
  { color: '#8b5cf6', tx: 'translate(-20px,-52px)' },
  { color: '#ec4899', tx: 'translate(20px,-52px)' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  tarjeta:      'Tarjeta',
  paypal:       'PayPal',
  transferencia:'Transferencia SPEI',
  efectivo:     'Efectivo',
}

function formatMXN(amount: number): string {
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function formatDate(isoDate: string): string {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DonationConfirmationProps {
  donation: Donation
  shelterSlug?: string   // for the "Ver más perros" CTA link
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DonationConfirmation({
  donation,
  shelterSlug,
}: DonationConfirmationProps) {
  const shelterLink = shelterSlug
    ? `/refugios/${shelterSlug}`
    : '/refugios'

  return (
    <div className="dn-confirmation">

      {/* ── Animated check ── */}
      <div className="dn-check-wrap">
        <div className="dn-check-circle">
          <svg viewBox="0 0 48 48" className="dn-check-svg" aria-hidden="true">
            <path
              className="dn-check-path"
              d="M10 24 L20 34 L38 16"
            />
          </svg>
        </div>

        {/* Confetti dots */}
        <div className="dn-confetti" aria-hidden="true">
          {CONFETTI.map((dot, i) => (
            <span
              key={i}
              className="dn-confetti-dot"
              style={{
                background: dot.color,
                top: '50%',
                left: '50%',
                marginTop: '-3px',
                marginLeft: '-3px',
                '--tx': dot.tx,
                animationDelay: `${0.15 + i * 0.05}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* ── Title ── */}
      <h2 className="dn-conf-title">¡Gracias por tu donación!</h2>
      <p className="dn-conf-subtitle">
        Tu aporte ayuda a{' '}
        {donation.refugioNombre
          ? <strong>{donation.refugioNombre}</strong>
          : 'este refugio'}
        {' '}a seguir cuidando a sus perros.
      </p>

      {/* ── Receipt ── */}
      <div className="dn-receipt">

        <div className="dn-receipt-row">
          <span className="dn-receipt-label">Monto donado</span>
          <span className="dn-receipt-value dn-receipt-value--amount">
            {formatMXN(donation.monto)}
          </span>
        </div>

        {donation.refugioNombre && (
          <div className="dn-receipt-row">
            <span className="dn-receipt-label">Refugio</span>
            <div className="dn-shelter-logo-wrap">
              {donation.refugioLogo && (
                <img
                  src={donation.refugioLogo}
                  alt={donation.refugioNombre}
                  className="dn-shelter-logo"
                />
              )}
              <span className="dn-receipt-value">{donation.refugioNombre}</span>
            </div>
          </div>
        )}

        <div className="dn-receipt-row">
          <span className="dn-receipt-label">Fecha</span>
          <span className="dn-receipt-value">{formatDate(donation.fecha)}</span>
        </div>

        <div className="dn-receipt-row">
          <span className="dn-receipt-label">Método</span>
          <span className="dn-receipt-value">
            {PAYMENT_METHOD_LABEL[donation.metodoPago] ?? donation.metodoPago}
          </span>
        </div>

        <div className="dn-receipt-row">
          <span className="dn-receipt-label">Donante</span>
          <span className="dn-receipt-value">
            {donation.esAnonima ? 'Anónimo' : (donation.adoptanteNombre ?? 'Tú')}
          </span>
        </div>

        {donation.transactionId && (
          <div className="dn-receipt-row">
            <span className="dn-receipt-label">ID de transacción</span>
            <span className="dn-receipt-value dn-receipt-txn">
              {donation.transactionId}
            </span>
          </div>
        )}

        {donation.concepto && (
          <div className="dn-receipt-row">
            <span className="dn-receipt-label">Concepto</span>
            <span className="dn-receipt-value">{donation.concepto}</span>
          </div>
        )}

      </div>

      {/* ── CTAs ── */}
      <div className="dn-conf-actions">
        <Link href={shelterLink} className="dn-conf-primary-btn">
          Ver más perros de este refugio
        </Link>
        <Link href="/" className="dn-conf-secondary-btn">
          Volver al inicio
        </Link>
      </div>

    </div>
  )
}
