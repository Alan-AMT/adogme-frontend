// modules/donations/components/DonationView.tsx
// Vista informativa de donación — muestra métodos de pago del refugio (CLABE, PayPal, MercadoPago).
// No procesa pagos ni recibe datos de tarjeta.
'use client'

import { useState } from 'react'
import type { Shelter } from '@/modules/shared/domain/Shelter'
import '@/modules/donations/styles/donations.css'

interface DonationViewProps {
  shelter: Shelter
}

export default function DonationView({ shelter }: DonationViewProps) {
  const { donationConfig: cfg, nombre, logo, ciudad, estado } = shelter
  const [claveCopied, setClaveCopied] = useState(false)

  function copiarClabe() {
    if (!cfg.cuentaClabe) return
    navigator.clipboard.writeText(cfg.cuentaClabe).then(() => {
      setClaveCopied(true)
      setTimeout(() => setClaveCopied(false), 2000)
    })
  }

  return (
    <div className="dn-view">

      {/* Shelter header */}
      <div className="dn-shelter-card">
        <div className="dn-shelter-card__logo-wrap">
          {logo ? (
            <img src={logo} alt={nombre} className="dn-shelter-card__logo" />
          ) : (
            <div className="dn-shelter-card__logo-placeholder">
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#fff', fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 28" }}>pets</span>
            </div>
          )}
        </div>
        <div className="dn-shelter-card__info">
          <p className="dn-shelter-card__kicker">Apoyando a</p>
          <h2 className="dn-shelter-card__name">{nombre}</h2>
          <p className="dn-shelter-card__city">
            <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 13" }}>location_on</span>
            {ciudad}, {estado}
          </p>
        </div>
      </div>

      {/* Causa */}
      {cfg.descripcionCausa && (
        <div className="dn-causa-box">
          <div className="dn-causa-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18" }}>favorite</span>
          </div>
          <div>
            <span className="dn-causa-label">¿A dónde va tu donación?</span>
            <p className="dn-causa-text">{cfg.descripcionCausa}</p>
          </div>
        </div>
      )}

      {/* Título sección */}
      <div className="dn-section-header">
        <h3 className="dn-section-title">Elige cómo donar</h3>
        <p className="dn-section-subtitle">Transfiere directamente al refugio por el medio que prefieras</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

        {/* CLABE bancaria */}
        {cfg.cuentaClabe && (
          <div className="dn-method-card">
            <div className="dn-method-card__icon" style={{ background: '#eff6ff' }}>
              <span className="material-symbols-outlined" style={{ color: '#1d4ed8', fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <div className="dn-method-card__body">
              <p className="dn-method-card__title">Transferencia bancaria (CLABE)</p>
              {cfg.banco && <p className="dn-method-card__meta">{cfg.banco} · {cfg.titularCuenta}</p>}
              <p className="dn-method-card__clabe">{cfg.cuentaClabe}</p>
            </div>
            <button
              type="button"
              className={`dn-copy-btn${claveCopied ? ' dn-copy-btn--done' : ''}`}
              onClick={copiarClabe}
              title="Copiar CLABE"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>
                {claveCopied ? 'check' : 'content_copy'}
              </span>
              {claveCopied ? 'Copiada' : 'Copiar'}
            </button>
          </div>
        )}

        {/* PayPal */}
        {cfg.paypalLink && (
          <a
            href={cfg.paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="dn-method-card dn-method-card--link"
          >
            <div className="dn-method-card__icon" style={{ background: '#eff6ff' }}>
              <span className="material-symbols-outlined" style={{ color: '#003087', fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <div className="dn-method-card__body">
              <p className="dn-method-card__title">PayPal</p>
              <p className="dn-method-card__meta">Serás redirigido a la página de PayPal del refugio</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#a1a1aa', marginLeft: 'auto', flexShrink: 0 }}>open_in_new</span>
          </a>
        )}

        {/* MercadoPago */}
        {cfg.mercadoPagoLink && (
          <a
            href={cfg.mercadoPagoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="dn-method-card dn-method-card--link"
          >
            <div className="dn-method-card__icon" style={{ background: '#f0fdf4' }}>
              <span className="material-symbols-outlined" style={{ color: '#00a650', fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <div className="dn-method-card__body">
              <p className="dn-method-card__title">MercadoPago</p>
              <p className="dn-method-card__meta">Serás redirigido al link de cobro del refugio</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#a1a1aa', marginLeft: 'auto', flexShrink: 0 }}>open_in_new</span>
          </a>
        )}

      </div>

      {/* Nota informativa */}
      <div className="dn-info-note">
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#0369a1', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>info</span>
        <p>
          Las donaciones son directamente entre tú y el refugio. aDOGme no procesa ni verifica los pagos.
          Si tienes dudas, contacta al refugio en <strong>{shelter.correo}</strong>.
        </p>
      </div>

    </div>
  )
}
