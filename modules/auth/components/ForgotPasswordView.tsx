// modules/auth/components/ForgotPasswordView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archivo 90 — ForgotPasswordView
// Formulario email → "Revisa tu correo" con instrucciones.
// Botón de reenviar con cooldown de 60 s.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { AuthBrand, AuthCard, AuthLayout } from '@/modules/shared/components/layout/AuthLayout'
import { Alert } from '@/modules/shared/components/ui/Alert'
import { Button } from '@/modules/shared/components/ui/Button'
import { Input } from '@/modules/shared/components/ui/Input'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { authService } from '../infrastructure/AuthServiceFactory'

// ── Icono inline ──────────────────────────────────────────────────────────────
function MIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined text-[#a1a1aa]" style={{ fontSize: 18 }}>
      {name}
    </span>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ForgotPasswordView() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [cooldown,  setCooldown]  = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Limpiar timer al desmontar
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  // ── Cooldown 60 s ─────────────────────────────────────────────────────────
  function startCooldown() {
    setCooldown(60)
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0 }
        return c - 1
      })
    }, 1000)
  }

  // ── Submit inicial ────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    setLoading(true)
    try {
      await authService.forgotPassword(email.trim())
      setSubmitted(true)
      startCooldown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el correo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // ── Reenviar ──────────────────────────────────────────────────────────────
  async function handleResend() {
    if (cooldown > 0 || loading) return
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email.trim())
      startCooldown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reenviar el correo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      rightKicker="seguridad adogme"
      rightKickerIcon="security"
      rightTitle="Protegemos tu cuenta y a nuestros peludos"
      rightDesc="Si olvidaste tu acceso, el proceso de recuperación es rápido y cifrado. Queremos asegurarnos de que siempre puedas estar conectado con tu comunidad."
      rightList={[
        'Verificación de identidad segura',
        'Soporte técnico para adoptantes',
        'Acceso rápido tras restablecer',
      ]}
      rightActions={[
        { label: 'Ver perros',   icon: 'pets',      href: '/perros' },
        { label: 'Ver refugios', icon: 'home_work', href: '/refugios' },
      ]}
    >
      <AuthCard>
        {/* Logo + header */}
        <div className="auth-header">
          <AuthBrand />
          <h1 className="auth-title">Recuperar acceso</h1>
          <p className="auth-desc">
            Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3.5">
            <Alert type="error" message={error} />
          </div>
        )}

        {/* ── Estado: formulario ── */}
        {!submitted ? (
          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
            <Input
              id="forgot-email"
              type="email"
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<MIcon name="mail" />}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              leftIcon={
                !loading ? (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 16" }}
                  >
                    send
                  </span>
                ) : undefined
              }
              className="mt-1.5 !font-[950] !text-[13px] !rounded-full"
              style={{ boxShadow: '0 12px 22px rgba(255,107,107,0.28)', background: '#ff6b6b' } as React.CSSProperties}
            >
              {loading ? 'Enviando…' : 'Enviar enlace de recuperación'}
            </Button>
          </form>

        ) : (
          /* ── Estado: correo enviado ── */
          <div className="flex flex-col gap-4">

            {/* Icono de éxito */}
            <div className="flex flex-col items-center text-center py-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#f0fdf4', border: '2px solid #dcfce7' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 34,
                    color: '#16a34a',
                    fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 34",
                  }}
                >
                  mark_email_read
                </span>
              </div>

              <p className="text-[14px] font-[700] text-[#374151] leading-relaxed">
                Si el correo{' '}
                <strong className="text-[#111827]">{email}</strong>{' '}
                está registrado, recibirás un enlace en unos minutos.
              </p>
              <p className="text-[12px] text-[#9ca3af] mt-1.5">
                Revisa también tu carpeta de spam.
              </p>
            </div>

            {/* Instrucciones */}
            <div
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-[14px]"
              style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}
            >
              <span
                className="material-symbols-outlined flex-shrink-0 mt-0.5"
                style={{
                  fontSize: 16,
                  color: '#1d4ed8',
                  fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 16",
                }}
              >
                info
              </span>
              <p className="text-[12px] font-[700] text-[#1d4ed8]">
                El enlace expira en 30 minutos. Si no lo recibes, verifica que el correo
                sea correcto o usa el botón para reenviar.
              </p>
            </div>

            {/* Reenviar con cooldown */}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className="auth-btn-ghost"
            >
              {loading ? (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, animation: 'spin 0.8s linear infinite' }}
                  >
                    progress_activity
                  </span>
                  Reenviando…
                </>
              ) : cooldown > 0 ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a1a1aa' }}>
                    timer
                  </span>
                  Reenviar en {cooldown}s
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    forward_to_inbox
                  </span>
                  Reenviar correo
                </>
              )}
            </button>
          </div>
        )}

        {/* Volver al login */}
        <div className="auth-footer">
          <Link href="/login" className="auth-footer-link">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
