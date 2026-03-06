// modules/donations/components/DonationView.tsx
// Archivo 216 — Orquestador del flujo de donación.
//
// Estados del flujo:
//   'amount'    → AmountSelector + botón Continuar
//   'payment'   → PaymentForm (con el monto seleccionado)
//   'confirmed' → DonationConfirmation (pantalla de éxito)
//   'error'     → Error card con Reintentar
'use client'

import { useState } from 'react'
import type { Shelter } from '@/modules/shared/domain/Shelter'
import type { Donation } from '@/modules/shared/domain/Donation'
import type { PaymentFormData } from './PaymentForm'
import { donationService } from '@/modules/donations/infrastructure/DonationServiceFactory'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import AmountSelector from './AmountSelector'
import PaymentForm from './PaymentForm'
import DonationConfirmation from './DonationConfirmation'
import '@/modules/donations/styles/donations.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type FlowStep = 'amount' | 'payment' | 'confirmed' | 'error'

interface DonationViewProps {
  shelter: Shelter
}

// ─── Progress indicator ───────────────────────────────────────────────────────

const STEPS = [
  { id: 'amount',    label: 'Monto' },
  { id: 'payment',   label: 'Pago' },
  { id: 'confirmed', label: 'Listo' },
]

function Progress({ current }: { current: FlowStep }) {
  const idx = STEPS.findIndex(s => s.id === current)
  if (current === 'error') return null
  return (
    <div className="dn-progress">
      {STEPS.map((s, i) => {
        const isDone   = i < idx
        const isActive = i === idx
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={
              `dn-progress-step ${isDone ? 'dn-progress-step--done' : ''} ${isActive ? 'dn-progress-step--active' : ''}`
            }>
              <span className="dn-progress-dot" />
              {s.label}
            </div>
            {i < STEPS.length - 1 && <div className="dn-progress-line" />}
          </div>
        )
      })}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DonationView({ shelter }: DonationViewProps) {
  const user        = useAuthStore(s => s.user)
  const adoptanteId = user?.id ?? 0

  const [step,        setStep]        = useState<FlowStep>('amount')
  const [monto,       setMonto]       = useState<number>(
    shelter.donationConfig.montoRecomendado ?? 100
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donation,    setDonation]    = useState<Donation | null>(null)
  const [errorMsg,    setErrorMsg]    = useState('')

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleContinue = () => {
    if (monto >= 20) setStep('payment')
  }

  const handleBack = () => setStep('amount')

  const handlePayment = async (formData: PaymentFormData) => {
    setIsSubmitting(true)
    try {
      const result = await donationService.initiateDonation(
        {
          monto,
          metodoPago: formData.metodoPago,
          concepto:   formData.concepto || undefined,
          esAnonima:  formData.esAnonima,
        },
        shelter.id,
        adoptanteId,
        { nombre: shelter.nombre, logo: shelter.logo }
      )
      setDonation(result)
      setStep('confirmed')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el pago.')
      setStep('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setErrorMsg('')
    setStep('payment')
  }

  // ── External link ────────────────────────────────────────────────────────────

  const externalUrl = shelter.donationConfig.paypalEmail
    ? `https://paypal.me/${shelter.donationConfig.paypalEmail.split('@')[0]}`
    : undefined

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="dn-view">

      {/* Shelter header — hidden on confirmed */}
      {step !== 'confirmed' && (
        <div className="dn-shelter-header">
          {shelter.logo ? (
            <img
              src={shelter.logo}
              alt={shelter.nombre}
              className="dn-shelter-logo-lg"
            />
          ) : (
            <div className="dn-shelter-logo-placeholder">🐾</div>
          )}
          <div className="dn-shelter-info">
            <h2 className="dn-shelter-name">{shelter.nombre}</h2>
            <p className="dn-shelter-city">{shelter.ciudad}, {shelter.estado}</p>
          </div>
        </div>
      )}

      {/* Causa description */}
      {step === 'amount' && shelter.donationConfig.descripcionCausa && (
        <div className="dn-causa-box">
          <span className="dn-causa-label">¿A dónde va tu donación?</span>
          {shelter.donationConfig.descripcionCausa}
        </div>
      )}

      {/* Progress */}
      {step !== 'error' && <Progress current={step} />}

      {/* ── Step: Amount ── */}
      {step === 'amount' && (
        <>
          <div className="dn-section-header">
            <h3 className="dn-section-title">Elige el monto</h3>
            <p className="dn-section-subtitle">Cada peso ayuda a más peludos</p>
          </div>
          <AmountSelector
            value={monto}
            onChange={setMonto}
            recommended={shelter.donationConfig.montoRecomendado}
          />
          <button
            className="dn-continue-btn"
            onClick={handleContinue}
            disabled={monto < 20}
          >
            Continuar → Datos de pago
          </button>
        </>
      )}

      {/* ── Step: Payment ── */}
      {step === 'payment' && (
        <>
          <button className="dn-back-btn" onClick={handleBack} type="button">
            ← Cambiar monto
          </button>
          <div className="dn-section-header">
            <h3 className="dn-section-title">
              Donar ${monto.toLocaleString('es-MX')} MXN
            </h3>
            <p className="dn-section-subtitle">Pago seguro con cifrado SSL</p>
          </div>
          <PaymentForm
            monto={monto}
            onSubmit={handlePayment}
            isSubmitting={isSubmitting}
            externalPaymentUrl={externalUrl}
            shelterName={shelter.nombre}
          />
        </>
      )}

      {/* ── Step: Confirmed ── */}
      {step === 'confirmed' && donation && (
        <DonationConfirmation
          donation={donation}
          shelterSlug={shelter.slug}
        />
      )}

      {/* ── Step: Error ── */}
      {step === 'error' && (
        <div className="dn-error-card">
          <span className="dn-error-icon">❌</span>
          <h3 className="dn-error-title">Pago no procesado</h3>
          <p className="dn-error-msg">{errorMsg}</p>
          <button className="dn-retry-btn" onClick={handleRetry}>
            Intentar de nuevo
          </button>
        </div>
      )}

    </div>
  )
}
