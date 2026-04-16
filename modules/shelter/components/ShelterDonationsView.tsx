// modules/shelter/components/ShelterDonationsView.tsx
// Vista de donaciones del refugio — muestra la información de cuentas de pago
// configuradas por el refugio para que los visitantes puedan donar directamente.
'use client'

import { useState } from 'react'
import { getShelterById } from '@/modules/shared/mockData/shelters.mock'
import '../styles/shelterDashboard.css'
import '../styles/shelterViews.css'

const CURRENT_SHELTER_ID = "1"

// ─── Sección de información de cuenta ─────────────────────────────────────────

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 900, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
        {label}
      </p>
      <p style={{
        fontSize: '0.9rem', fontWeight: 700, color: '#18181b', margin: 0,
        fontFamily: mono ? "'Courier New', monospace" : 'inherit',
        letterSpacing: mono ? '0.06em' : 'normal',
        wordBreak: 'break-all',
      }}>
        {value}
      </p>
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ShelterDonationsView() {
  const shelter = getShelterById(CURRENT_SHELTER_ID)
  const cfg = shelter?.donationConfig
  const [clabeCopied, setClabeCopied] = useState(false)

  function copiarClabe() {
    if (!cfg?.cuentaClabe) return
    navigator.clipboard.writeText(cfg.cuentaClabe).then(() => {
      setClabeCopied(true)
      setTimeout(() => setClabeCopied(false), 2000)
    })
  }

  if (!shelter || !cfg) return (
    <div className="sv-empty">
      <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>error</span>
      <p className="sv-empty__title">No se encontró la información del refugio</p>
    </div>
  )

  const tieneMetodos = cfg.cuentaClabe || cfg.paypalLink || cfg.mercadoPagoLink

  return (
    <>
      {/* ── Aviso informativo ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        padding: '1rem 1.1rem', background: '#f0f9ff', borderRadius: '1rem',
        border: '1.5px solid #bae6fd', marginBottom: '0.5rem',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0369a1', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>info</span>
        <p style={{ fontSize: '0.82rem', color: '#0c4a6e', fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
          aDOGme no procesa ni retiene pagos. Las donaciones son directamente entre el donante y tu refugio.
          Comparte estos datos con tus donantes para que puedan apoyarte.
        </p>
      </div>

      {/* ── Causa ── */}
      <div className="sd-card">
        <div className="sd-card__header">
          <p className="sd-card__title">
            <span className="material-symbols-outlined">favorite</span>
            Descripción de la causa
          </p>
        </div>
        <div style={{ padding: '1rem 1.25rem' }}>
          {cfg.descripcionCausa ? (
            <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
              {cfg.descripcionCausa}
            </p>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontStyle: 'italic', margin: 0 }}>
              No hay descripción configurada.
            </p>
          )}
        </div>
      </div>

      {/* ── Métodos de pago ── */}
      <div className="sd-card" style={{ marginTop: '1rem' }}>
        <div className="sd-card__header">
          <p className="sd-card__title">
            <span className="material-symbols-outlined">volunteer_activism</span>
            Métodos de donación configurados
          </p>
        </div>

        <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {!tieneMetodos && (
            <div className="sv-empty">
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <p className="sv-empty__title">Sin métodos configurados</p>
              <p className="sv-empty__sub">Contacta a soporte para añadir tu CLABE, PayPal o MercadoPago</p>
            </div>
          )}

          {/* CLABE */}
          {cfg.cuentaClabe && (
            <div style={{
              background: '#eff6ff', borderRadius: '0.9rem',
              border: '1.5px solid #bfdbfe', padding: '1rem 1.1rem',
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#1d4ed8', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Transferencia bancaria (CLABE)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <InfoRow label="CLABE" value={cfg.cuentaClabe} mono />
                  {cfg.banco && <InfoRow label="Banco" value={cfg.banco} />}
                  {cfg.titularCuenta && <InfoRow label="Titular" value={cfg.titularCuenta} />}
                </div>
              </div>
              <button
                type="button"
                onClick={copiarClabe}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.45rem 0.9rem', borderRadius: 999,
                  border: '1.5px solid', fontFamily: 'inherit',
                  fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  flexShrink: 0, transition: 'all 150ms ease',
                  borderColor: clabeCopied ? '#16a34a' : '#1d4ed8',
                  background: clabeCopied ? '#dcfce7' : '#fff',
                  color: clabeCopied ? '#166534' : '#1d4ed8',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>
                  {clabeCopied ? 'check' : 'content_copy'}
                </span>
                {clabeCopied ? 'Copiada' : 'Copiar'}
              </button>
            </div>
          )}

          {/* PayPal */}
          {cfg.paypalLink && (
            <div style={{
              background: '#f0f9ff', borderRadius: '0.9rem',
              border: '1.5px solid #bae6fd', padding: '1rem 1.1rem',
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#003087', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 900, color: '#003087', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.3rem' }}>
                  PayPal
                </p>
                <a
                  href={cfg.paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: '#1d4ed8', fontWeight: 600, wordBreak: 'break-all' }}
                >
                  {cfg.paypalLink}
                </a>
              </div>
            </div>
          )}

          {/* MercadoPago */}
          {cfg.mercadoPagoLink && (
            <div style={{
              background: '#f0fdf4', borderRadius: '0.9rem',
              border: '1.5px solid #bbf7d0', padding: '1rem 1.1rem',
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#00a650', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>payments</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 900, color: '#00a650', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.3rem' }}>
                  MercadoPago
                </p>
                <a
                  href={cfg.mercadoPagoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: '#1d4ed8', fontWeight: 600, wordBreak: 'break-all' }}
                >
                  {cfg.mercadoPagoLink}
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Nota de soporte ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        padding: '0.85rem 1rem', background: '#fafafa',
        border: '1.5px solid #e4e4e7', borderRadius: '0.85rem',
        marginTop: '1rem',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#71717a', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        <p style={{ fontSize: '0.78rem', color: '#52525b', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
          Para actualizar tu CLABE, link de PayPal o MercadoPago contacta al equipo de aDOGme en{' '}
          <strong>soporte@adogme.mx</strong>
        </p>
      </div>
    </>
  )
}
