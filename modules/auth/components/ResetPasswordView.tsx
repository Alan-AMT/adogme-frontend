// modules/auth/components/ResetPasswordView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archivo 91 — ResetPasswordView
// Lee el token de los query params (?token=...).
// Formulario nueva contraseña + confirmar + indicador de fortaleza.
// Envuelto en Suspense (requerido por useSearchParams en Next.js 15).
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { AuthBrand, AuthCard, AuthLayout } from '@/modules/shared/components/layout/AuthLayout'
import { Alert } from '@/modules/shared/components/ui/Alert'
import { Button } from '@/modules/shared/components/ui/Button'
import { Input } from '@/modules/shared/components/ui/Input'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { authService } from '../infrastructure/AuthServiceFactory'

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(p: string): { pct: number; label: string; color: string } {
  if (!p) return { pct: 0, label: '', color: '#e4e4e7' }
  let s = 0
  if (p.length >= 8)          s++
  if (/[A-Z]/.test(p))        s++
  if (/[0-9]/.test(p))        s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return [
    { pct: 20,  label: 'Muy débil', color: '#ef4444' },
    { pct: 40,  label: 'Débil',     color: '#f97316' },
    { pct: 65,  label: 'Regular',   color: '#eab308' },
    { pct: 85,  label: 'Buena',     color: '#22c55e' },
    { pct: 100, label: 'Excelente', color: '#16a34a' },
  ][s] ?? { pct: 20, label: 'Muy débil', color: '#ef4444' }
}

// ── Icono inline ──────────────────────────────────────────────────────────────
function MIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined text-[#a1a1aa]" style={{ fontSize: 18 }}>
      {name}
    </span>
  )
}

// ── Formulario interno (usa useSearchParams → necesita Suspense) ──────────────
function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)

  const strength = getStrength(password)

  // ── Token inválido ─────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <Alert type="error" message="El enlace de recuperación no es válido o ha expirado." />
        <Link
          href="/forgot-password"
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full
                     bg-[#ff6b6b] text-white font-[950] text-[13px]
                     hover:bg-[#fa5252] transition-colors"
          style={{ boxShadow: '0 12px 22px rgba(255,107,107,0.28)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
            send
          </span>
          Solicitar nuevo enlace
        </Link>
      </div>
    )
  }

  // ── Éxito ──────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col gap-4">
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
              lock_open
            </span>
          </div>
          <p className="text-[14px] font-[700] text-[#374151] leading-relaxed">
            ¡Contraseña actualizada!<br />
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
        </div>

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full
                     bg-[#ff6b6b] text-white font-[950] text-[13px]
                     hover:bg-[#fa5252] hover:-translate-y-0.5 transition-all duration-150"
          style={{ boxShadow: '0 12px 22px rgba(255,107,107,0.28)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
            login
          </span>
          Iniciar sesión
        </Link>
      </div>
    )
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!password)            { setError('Ingresa una nueva contraseña.'); return }
    if (password.length < 8)  { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (password !== confirm)  { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-3.5">
          <Alert type="error" message={error} />
        </div>
      )}

      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
        <Input
          id="reset-pass"
          type={showPass ? 'text' : 'password'}
          label="Nueva contraseña"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          leftIcon={<MIcon name="lock" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="p-1.5 rounded-[10px] text-[#a1a1aa] hover:bg-black/5 hover:text-[#52525b] transition-colors"
              aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {showPass ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
          required
        />

        {/* Barra de fortaleza */}
        {password && (
          <div className="flex flex-col gap-1.5 -mt-1">
            <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${strength.pct}%`, background: strength.color }}
              />
            </div>
            <span className="text-[12px] font-[900]" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
        )}

        <Input
          id="reset-confirm"
          type={showConfirm ? 'text' : 'password'}
          label="Confirmar contraseña"
          placeholder="Repite la contraseña"
          autoComplete="new-password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          leftIcon={<MIcon name="lock_reset" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="p-1.5 rounded-[10px] text-[#a1a1aa] hover:bg-black/5 hover:text-[#52525b] transition-colors"
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {showConfirm ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
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
                lock_reset
              </span>
            ) : undefined
          }
          className="mt-1.5 !font-[950] !text-[13px] !rounded-full"
          style={{ boxShadow: '0 12px 22px rgba(255,107,107,0.28)', background: '#ff6b6b' } as React.CSSProperties}
        >
          {loading ? 'Actualizando…' : 'Restablecer contraseña'}
        </Button>
      </form>
    </>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ResetPasswordView() {
  return (
    <AuthLayout
      rightKicker="seguridad adogme"
      rightKickerIcon="security"
      rightTitle="Crea una contraseña segura para tu cuenta"
      rightDesc="Elige una contraseña única con letras, números y símbolos. Nunca la compartiremos con nadie."
      rightList={[
        'Contraseña cifrada extremo a extremo',
        'Proceso de recuperación rápido y seguro',
        'Acceso inmediato tras restablecer',
      ]}
      rightActions={[
        { label: 'Ver perros',   icon: 'pets',      href: '/perros' },
        { label: 'Ver refugios', icon: 'home_work', href: '/refugios' },
      ]}
    >
      <AuthCard>
        <AuthBrand />

        <h1 className="text-[26px] font-[950] text-[#111827] mt-1 mb-0.5 tracking-tight">
          Nueva contraseña
        </h1>
        <p className="text-[13px] text-[#6b7280] mb-[18px]">
          Elige una contraseña segura para proteger tu cuenta de aDOGme.
        </p>

        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[#ff6b6b]"
                style={{ fontSize: 28, animation: 'spin 1s linear infinite' }}
              >
                progress_activity
              </span>
            </div>
          }
        >
          <ResetForm />
        </Suspense>

        <div className="mt-4 text-center text-[12px] text-[#9ca3af] bg-white border border-[#f3f4f6] rounded-[14px] px-3.5 py-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-[900] text-[#ff6b6b] hover:underline"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
