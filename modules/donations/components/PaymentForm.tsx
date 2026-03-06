// modules/donations/components/PaymentForm.tsx
// Archivo 214 — Formulario de tarjeta con máscaras visuales.
//
// Card number: formatted as groups of 4 (XXXX XXXX XXXX XXXX)
// Expiry: MM/AA format
// CVV: shown as bullets on the card preview, actual digits in field
// Brand detection: Visa (4), Mastercard (5), Amex (3) by first digit
// External payment: shown if externalPaymentUrl is provided
'use client'

import { useState, useCallback } from 'react'
import type { PaymentMethod } from '@/modules/shared/domain/Donation'
import '@/modules/donations/styles/donations.css'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentFormData {
  metodoPago: PaymentMethod
  cardNumber: string    // raw digits only
  cardName: string
  expiry: string        // MM/YY raw
  cvv: string
  concepto: string
  esAnonima: boolean
}

interface PaymentFormProps {
  monto: number
  onSubmit: (data: PaymentFormData) => void
  isSubmitting?: boolean
  externalPaymentUrl?: string
  shelterName?: string
}

// ─── Brand detection ─────────────────────────────────────────────────────────

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown'

function detectBrand(number: string): CardBrand {
  if (!number) return 'unknown'
  const first = number[0]
  const firstTwo = number.slice(0, 2)
  if (first === '4') return 'visa'
  if (['51','52','53','54','55'].includes(firstTwo)) return 'mastercard'
  if (['34','37'].includes(firstTwo)) return 'amex'
  return 'unknown'
}

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  amex: 'AMEX',
  unknown: 'TARJETA',
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatCardDisplay(raw: string): string {
  // Groups of 4, max 16 digits
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim() || '•••• •••• •••• ••••'
}

function maskCardDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  if (!digits) return '•••• •••• •••• ••••'
  // Show last 4, mask the rest
  const padded = digits.padEnd(16, '•')
  const masked = '•••• •••• •••• ' + padded.slice(12, 16)
  return masked
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

// ─── Validation ───────────────────────────────────────────────────────────────

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, '')
  if (digits.length < 13) return false
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

function validateExpiry(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 4) return false
  const month = parseInt(digits.slice(0, 2), 10)
  const year = parseInt('20' + digits.slice(2, 4), 10)
  if (month < 1 || month > 12) return false
  const now = new Date()
  const exp = new Date(year, month - 1, 1)
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentForm({
  monto,
  onSubmit,
  isSubmitting = false,
  externalPaymentUrl,
  shelterName,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName]     = useState('')
  const [expiry, setExpiry]         = useState('')
  const [cvv, setCvv]               = useState('')
  const [concepto, setConcepto]     = useState('')
  const [esAnonima, setEsAnonima]   = useState(false)
  const [touched, setTouched]       = useState<Record<string, boolean>>({})

  const brand = detectBrand(cardNumber)
  const cardDigits = cardNumber.replace(/\D/g, '')

  // ── Field change handlers ──────────────────────────────────────────────────

  const handleCardNumber = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    setCardNumber(raw)
  }, [])

  const handleExpiry = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    setExpiry(raw)
  }, [])

  const handleCvv = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, brand === 'amex' ? 4 : 3)
    setCvv(raw)
  }, [brand])

  const handleBlur = (field: string) =>
    setTouched(prev => ({ ...prev, [field]: true }))

  // ── Validation ─────────────────────────────────────────────────────────────

  const errors = {
    cardNumber: cardDigits.length < 16 || !luhnCheck(cardDigits)
      ? 'Número de tarjeta inválido'
      : '',
    cardName: !cardName.trim() ? 'Ingresa el nombre en la tarjeta' : '',
    expiry: !validateExpiry(expiry) ? 'Fecha de vencimiento inválida' : '',
    cvv: cvv.length < (brand === 'amex' ? 4 : 3) ? 'CVV inválido' : '',
  }

  const isValid = !Object.values(errors).some(Boolean)

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ cardNumber: true, cardName: true, expiry: true, cvv: true })
    if (!isValid) return
    onSubmit({
      metodoPago: 'tarjeta',
      cardNumber,
      cardName,
      expiry,
      cvv,
      concepto,
      esAnonima,
    })
  }

  // ── Card preview values ────────────────────────────────────────────────────

  const displayNumber = cardDigits.length > 0
    ? maskCardDisplay(cardDigits)
    : '•••• •••• •••• ••••'
  const displayExpiry = expiry.length >= 2
    ? expiry.slice(0, 2) + '/' + (expiry.slice(2) || 'AA')
    : 'MM/AA'
  const displayCvv = cvv ? '•'.repeat(cvv.length) : '•••'
  const displayName = cardName.trim() || 'NOMBRE APELLIDO'

  return (
    <div className="dn-payment-form">

      {/* ── Card preview ── */}
      <div className="dn-card-preview">
        <div className="dn-card-top">
          <div className="dn-chip-icon" />
          <span className="dn-card-brand-text">
            {BRAND_LABEL[brand]}
          </span>
        </div>
        <div className="dn-card-number-display">{displayNumber}</div>
        <div className="dn-card-bottom">
          <div>
            <div className="dn-card-field-label">Titular</div>
            <div className="dn-card-field-value">{displayName.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="dn-card-field-label">Vence</div>
            <div className="dn-card-field-value">{displayExpiry}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="dn-card-field-label">CVV</div>
            <div className="dn-card-field-value">{displayCvv}</div>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate>

        {/* Card number */}
        <div className="dn-field">
          <label className="dn-field-label">Número de tarjeta</label>
          <div className="dn-input-wrap">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={formatCardDisplay(cardNumber)}
              onChange={handleCardNumber}
              onBlur={() => handleBlur('cardNumber')}
              className={`dn-input dn-input--number${touched.cardNumber && errors.cardNumber ? ' dn-input--error' : ''}`}
              maxLength={19}
            />
            {brand !== 'unknown' && (
              <div className="dn-brand-indicator">
                <span className="dn-brand-text">{BRAND_LABEL[brand]}</span>
              </div>
            )}
          </div>
          {touched.cardNumber && errors.cardNumber && (
            <p className="dn-field-error">{errors.cardNumber}</p>
          )}
        </div>

        {/* Cardholder name */}
        <div className="dn-field">
          <label className="dn-field-label">Nombre del titular</label>
          <input
            type="text"
            autoComplete="cc-name"
            placeholder="Como aparece en la tarjeta"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            onBlur={() => handleBlur('cardName')}
            className={`dn-input${touched.cardName && errors.cardName ? ' dn-input--error' : ''}`}
          />
          {touched.cardName && errors.cardName && (
            <p className="dn-field-error">{errors.cardName}</p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="dn-field-row">
          <div>
            <label className="dn-field-label">Vencimiento</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={formatExpiry(expiry)}
              onChange={handleExpiry}
              onBlur={() => handleBlur('expiry')}
              className={`dn-input${touched.expiry && errors.expiry ? ' dn-input--error' : ''}`}
              maxLength={5}
            />
            {touched.expiry && errors.expiry && (
              <p className="dn-field-error">{errors.expiry}</p>
            )}
          </div>
          <div>
            <label className="dn-field-label">CVV</label>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={brand === 'amex' ? '••••' : '•••'}
              value={cvv}
              onChange={handleCvv}
              onBlur={() => handleBlur('cvv')}
              className={`dn-input${touched.cvv && errors.cvv ? ' dn-input--error' : ''}`}
              maxLength={brand === 'amex' ? 4 : 3}
            />
            {touched.cvv && errors.cvv && (
              <p className="dn-field-error">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Concepto (optional) */}
        <div className="dn-field">
          <label className="dn-field-label">Mensaje al refugio (opcional)</label>
          <textarea
            rows={2}
            maxLength={150}
            placeholder="¿Por qué donas? Puedes dejarnos un mensaje..."
            value={concepto}
            onChange={e => setConcepto(e.target.value)}
            className="dn-textarea"
          />
          <p className="dn-char-count">{concepto.length}/150</p>
        </div>

        {/* Anonymous toggle */}
        <label className="dn-anon-row">
          <input
            type="checkbox"
            checked={esAnonima}
            onChange={e => setEsAnonima(e.target.checked)}
            className="dn-anon-checkbox"
          />
          <span className="dn-anon-label">Realizar donación de forma anónima</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="dn-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="dn-submit-spinner" />
              Procesando...
            </>
          ) : (
            <>
              🔒 Donar ${monto.toLocaleString('es-MX')} MXN
            </>
          )}
        </button>

        <p className="dn-security-note">
          🔐 Tus datos están protegidos con cifrado SSL
        </p>
      </form>

      {/* ── External payment alternative ── */}
      {externalPaymentUrl && (
        <>
          <div className="dn-divider">o también puedes</div>
          <a
            href={externalPaymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dn-external-btn"
          >
            🔗 Pagar con enlace externo{shelterName ? ` de ${shelterName}` : ''}
          </a>
        </>
      )}
    </div>
  )
}
