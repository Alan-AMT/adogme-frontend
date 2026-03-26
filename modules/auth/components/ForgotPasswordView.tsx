// modules/auth/components/ForgotPasswordView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archivo 90 — ForgotPasswordView
// Formulario email → "Revisa tu correo" con instrucciones.
// Botón de reenviar con cooldown de 60 s.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import '../styles/auth.css'
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
          <div className="flex flex-col gap-5">

            {/* Icono + mensaje principal */}
            <div className="flex flex-col items-center text-center gap-3 pt-1">
              {/* Icono con anillo decorativo */}
              <div className="relative flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full"
                  style={{ background: 'radial-gradient(circle, #dcfce7 0%, #f0fdf4 70%)', border: '2px solid #bbf7d0' }}
                />
                <div
                  className="absolute w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: '#16a34a' }}
                >
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontSize: 26, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 26" }}
                  >
                    mark_email_read
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[15px] font-[800] text-[#111827]">¡Revisa tu correo!</p>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">
                  Enviamos el enlace a
                </p>
                {/* Email pill */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full self-center mt-0.5"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 13, color: '#16a34a', fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 13" }}
                  >
                    mail
                  </span>
                  <span className="text-[12.5px] font-[800] text-[#15803d]">{email}</span>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="flex flex-col gap-2 px-4 py-3.5 rounded-[16px]"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              {[
                { icon: 'timer', text: 'El enlace expira en 30 minutos.' },
                { icon: 'folder', text: 'Revisa también tu carpeta de spam.' },
                { icon: 'edit', text: 'Verifica que el correo sea correcto.' },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined flex-shrink-0"
                    style={{ fontSize: 15, color: '#94a3b8', fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 15" }}
                  >
                    {icon}
                  </span>
                  <p className="text-[12.5px] font-[700] text-[#64748b]">{text}</p>
                </div>
              ))}
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
                  <span className="material-symbols-outlined" style={{ fontSize: 16, animation: 'spin 0.8s linear infinite' }}>
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
