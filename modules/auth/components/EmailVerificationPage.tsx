// modules/auth/components/EmailVerificationPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Página de verificación de correo post-registro.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { AuthBrand, AuthCard, AuthLayout } from '@/modules/shared/components/layout/AuthLayout'
import { Alert } from '@/modules/shared/components/ui/Alert'
import Link from 'next/link'
import { useState } from 'react'

export default function EmailVerificationPage() {
  const [loading, setLoading] = useState(false)
  const [resent,  setResent]  = useState(false)

  async function handleResend() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000)) // mock
    setLoading(false)
    setResent(true)
  }

  return (
    <AuthLayout
      rightKicker="verificación de cuenta"
      rightKickerIcon="verified"
      rightTitle="¡Ya casi eres parte de la familia aDOGme!"
      rightDesc="La verificación de correo nos ayuda a mantener una comunidad segura y confiable para adoptantes y refugios."
      rightList={[
        'Proceso de verificación rápido, solo un clic',
        'Tu cuenta ya está creada y lista',
        'Conecta con refugios verificados de la GAM',
      ]}
      rightActions={[
        { label: 'Ver perros',   icon: 'pets',      href: '/perros' },
        { label: 'Ver refugios', icon: 'home_work', href: '/refugios' },
      ]}
    >
      <AuthCard>
        <AuthBrand />

        {/* Ícono ilustrativo */}
        <div className="flex flex-col items-center text-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: '#fff1f2', border: '3px solid #ffd0d0' }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 40,
                color: '#ff6b6b',
                fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 40",
              }}
            >
              mark_email_unread
            </span>
          </div>

          <h1 className="text-[26px] font-[950] text-[#111827] tracking-tight mb-2">
            Verifica tu correo
          </h1>
          <p className="text-[14px] text-[#6b7280] leading-relaxed max-w-[320px]">
            Te enviamos un enlace de activación. Revisa tu bandeja de entrada
            y la carpeta de spam.
          </p>
        </div>

        {/* Info */}
        <div
          className="flex items-start gap-2.5 px-3.5 py-3.5 rounded-[14px] mb-4"
          style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}
        >
          <span
            className="material-symbols-outlined flex-shrink-0 mt-0.5"
            style={{
              fontSize: 18,
              color: '#16a34a',
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18",
            }}
          >
            check_circle
          </span>
          <p className="text-[13px] font-[700] text-[#15803d]">
            Tu cuenta ha sido creada. Actívala con el correo que te enviamos
            para empezar a adoptar.
          </p>
        </div>

        {/* Reenviar */}
        {resent ? (
          <div className="mb-4">
            <Alert type="success" message="Correo reenviado. Revisa tu bandeja de entrada." />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-3.5 py-3 rounded-full
                       border border-[#e5e7eb] bg-white text-[#374151] font-[900] text-[13px]
                       hover:bg-[#fafafa] hover:-translate-y-0.5
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-150 mb-4"
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
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  forward_to_inbox
                </span>
                Reenviar correo de verificación
              </>
            )}
          </button>
        )}

        {/* Volver al login */}
        <div className="text-center text-[12px] text-[#9ca3af] bg-white border border-[#f3f4f6] rounded-[14px] px-3.5 py-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-[900] text-[#ff6b6b] hover:underline"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
            Ya verifiqué, ir a iniciar sesión
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
