// modules/auth/components/LoginView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REFACTOR de LoginPage.tsx — ahora usa:
//   · useLogin hook (lógica separada de UI)
//   · Alert, Input, Button del sistema de diseño compartido
//   · UI especial para shelter pendiente (card informativa)
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { AuthBrand, AuthCard, AuthLayout, GoogleIcon } from '@/modules/shared/components/layout/AuthLayout'
import { Alert } from '@/modules/shared/components/ui/Alert'
import { Button } from '@/modules/shared/components/ui/Button'
import { Input } from '@/modules/shared/components/ui/Input'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { useLogin } from '../application/hooks/useLogin'

// ── Icono inline para Input.leftIcon / rightIcon (Material Symbols) ───────────
function MIcon({ name, fill = false }: { name: string; fill?: boolean }) {
  return (
    <span
      className="material-symbols-outlined text-[#a1a1aa]"
      style={{
        fontSize: 18,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 18`,
      }}
    >
      {name}
    </span>
  )
}

// ── Card informativa para refugio pendiente ───────────────────────────────────
function ShelterPendingCard({ message }: { message: string }) {
  return (
    <div className="rounded-[16px] border border-[#fef3c7] bg-[#fffbeb] p-4 flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: '#fef08a' }}
        >
          <span
            className="material-symbols-outlined text-[#b45309]"
            style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18" }}
          >
            pending
          </span>
        </div>
        <p className="font-[950] text-[#b45309] text-[13px]">Solicitud en revisión</p>
      </div>

      <p className="text-[12px] font-[700] text-[#92400e] leading-relaxed">
        {message || 'Tu solicitud de refugio está siendo revisada por nuestro equipo.'}
      </p>

      <div className="flex flex-col gap-1.5 pt-1.5 border-t border-[#fde68a]">
        <p className="text-[11px] font-[800] text-[#b45309]/70 uppercase tracking-[0.1em]">
          Próximos pasos
        </p>
        {[
          'Recibirás un correo cuando sea aprobado.',
          'El proceso toma 1–3 días hábiles.',
          'Puedes contactarnos si tienes dudas.',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[12px] font-[700] text-[#92400e]">
            <span
              className="material-symbols-outlined flex-shrink-0 mt-px"
              style={{ fontSize: 13, color: '#b45309' }}
            >
              chevron_right
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Formulario — componente interno (Suspense boundary por useSearchParams) ────
function LoginForm() {
  const {
    correo,
    setCorreo,
    password,
    setPassword,
    showPass,
    toggleShowPass,
    recordar,
    setRecordar,
    loading,
    error,
    isPendingShelter,
    handleSubmit,
  } = useLogin()

  return (
    <AuthLayout
      rightKicker="portal de adopción"
      rightKickerIcon="verified"
      rightTitle="Inicia sesión y encuentra a tu próximo mejor amigo"
      rightDesc="aDOGme conecta adoptantes con refugios verificados. Filtra por tamaño, energía y compatibilidad."
      rightList={[
        'Perfiles verificados y procesos responsables',
        'Búsqueda rápida por alcaldía y preferencias',
        'Comunicación segura con refugios',
      ]}
      rightActions={[
        { label: 'Ver perros', icon: 'pets', href: '/perros' },
        { label: 'Ver refugios', icon: 'home_work', href: '/refugios' },
      ]}
    >
      <AuthCard>
        {/* Logo + header */}
        <div className="auth-header">
          <AuthBrand />
          <h1 className="auth-title">Inicia sesión</h1>
          <p className="auth-subtitle">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="auth-link">
              Regístrate gratis
            </Link>
          </p>
        </div>

        {/* Google */}
        <button type="button" className="auth-btn-google">
          <GoogleIcon />
          Continuar con Google
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider__line" />
          <span className="auth-divider__text">o continúa con correo</span>
          <div className="auth-divider__line" />
        </div>

        {/* ── Alertas ── */}
        {isPendingShelter ? (
          <div className="mb-3.5">
            <ShelterPendingCard message={error} />
          </div>
        ) : error ? (
          <div className="mb-3.5">
            <Alert type="error" message={error} />
          </div>
        ) : null}

        {/* ── Formulario ── */}
        <form className="flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
          {/* Correo */}
          <Input
            id="login-correo"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            label="Correo electrónico"
            autoComplete="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            leftIcon={<MIcon name="mail" />}
            required
          />

          {/* Contraseña */}
          <Input
            id="login-pass"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            label="Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<MIcon name="lock" />}
            rightIcon={
              <button
                type="button"
                onClick={toggleShowPass}
                className="p-1.5 rounded-[10px] text-[#a1a1aa] hover:bg-black/5 hover:text-[#52525b]
                           transition-colors"
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

          {/* Recordar + ¿Olvidaste? */}
          <div className="flex items-center justify-between gap-3 -mt-1">
            <label
              className="inline-flex items-center gap-2.5 cursor-pointer text-[13px] font-[800]
                              text-[#374151]"
            >
              <input
                type="checkbox"
                checked={recordar}
                onChange={e => setRecordar(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: '#ff6b6b' }}
              />
              Recordarme
            </label>

            {/* ✅ ahora subrayado como "Regístrate gratis" */}
            <Link href="/forgot-password" className="auth-link text-[13px] font-[900] text-[#ff6b6b]">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            leftIcon={
              !loading ? (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18" }}
                >
                  login
                </span>
              ) : undefined
            }
            className="mt-1.5 !font-[950] !text-[13px] !rounded-full"
            style={
              { boxShadow: '0 12px 22px rgba(255,107,107,0.28)', background: '#ff6b6b' } as React.CSSProperties
            }
          >
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
        </form>
      </AuthCard>

      {/* Hint de credenciales demo */}
      <div className="auth-footer">
        <strong className="text-[#6b7280]">Demo:</strong> usa{' '}
        <code className="text-[#ff6b6b] font-[900] font-mono">ana@test.com</code> · contraseña{' '}
        <code className="text-[#ff6b6b] font-[900] font-mono">test1234</code>
      </div>
    </AuthLayout>
  )
}

// ── Export principal — envuelve en Suspense (requerido por useSearchParams) ────
export default function LoginView() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <span
            className="material-symbols-outlined text-[#ff6b6b]"
            style={{ fontSize: 36, animation: 'spin 1s linear infinite' }}
          >
            progress_activity
          </span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
