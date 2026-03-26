// modules/shared/components/layout/AuthLayout.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RightAction {
  label: string
  icon: string
  href?: string
  onClick?: () => void
}

interface AuthLayoutProps {
  children: ReactNode

  // Panel derecho (rojo) — todo configurable por página
  rightKicker?: string
  rightKickerIcon?: string
  rightTitle?: string
  rightDesc?: string
  rightList?: string[]
  rightActions?: RightAction[]
}

// ─── Icono Google SVG ─────────────────────────────────────────────────────────
// Exportado también para que los forms lo usen sin duplicarlo
export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ─── AuthCard — la tarjeta blanca con accent line ────────────────────────────

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full bg-white border border-[#e5e7eb] rounded-[20px] overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(17,24,39,0.08)' }}
    >
      {/* Accent line — gradiente brand */}
      <div className="h-[6px] bg-gradient-to-r from-[#ff6b6b] via-[#fa5252] to-[#ff9999]" />
      <div className="p-7">{children}</div>
    </div>
  )
}

// ─── AuthBrand — logo + nombre ───────────────────────────────────────────────

export function AuthBrand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 mb-[18px] w-fit group">
      <div
        className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 overflow-hidden
                   transition-transform duration-200 group-hover:scale-105"
        style={{
          border: '2px solid #ff6b6b',
          background: 'transparent',
          boxShadow: '0 8px 18px rgba(255,107,107,0.18)',
        }}
        aria-hidden="true"
      >
        <Image
          src="/assets/logos/adogme-logo.png"
          alt="aDOGme logo"
          width={34}
          height={34}
          className="object-contain"
          priority
        />
      </div>

      <span className="font-[950] text-[22px] text-[#111827] tracking-[-0.02em] leading-none">
        a<strong className="text-[#ff6b6b]">DOG</strong>me
      </span>
    </Link>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function AuthLayout({
  children,
  rightKicker = 'portal de adopción',
  rightKickerIcon = 'verified',
  rightTitle = 'Bienvenido a aDOGme',
  rightDesc = 'Conectamos adoptantes con refugios verificados para facilitar adopciones responsables.',
  rightList = [],
  rightActions = [],
}: AuthLayoutProps) {
  return (
    // Nota: ya NO es min-h-screen, porque ahora vive dentro de <main> con navbar/footer.
    <div className="w-full flex bg-[#f4f6f9]">
      {/* ── Columna izquierda (form) ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white relative overflow-hidden">
        {/* Textura fondo — patrón de patas, muy sutil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/ui/back.jpg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '220px auto',
            opacity: 0.035,
          }}
          aria-hidden="true"
        />

        {/* Contenido centrado */}
        <div className="relative z-10 w-full max-w-[420px] flex flex-col gap-4">{children}</div>
      </div>

      {/* ── Columna derecha (info roja) — oculta en < 1024px ── */}
      <div
        className="hidden lg:flex flex-1 items-center px-16 relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}
      >
        {/* Círculos decorativos */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 520, height: 520, background: 'rgba(255,255,255,0.06)', top: -180, right: -180 }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 420, height: 420, background: 'rgba(0,0,0,0.08)', bottom: -180, left: -180 }}
          aria-hidden="true"
        />

        {/* Textura de patas sobre el rojo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/ui/back.jpg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px auto',
            opacity: 0.06,
          }}
          aria-hidden="true"
        />

        {/* Contenido info */}
        <div className="relative z-10 max-w-[460px]">
          {/* Kicker pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-full mb-4 bg-white/12 font-[800] text-xs tracking-[0.14em] uppercase">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {rightKickerIcon}
            </span>
            {rightKicker}
          </div>

          {/* Título */}
          <h2 className="font-[900] text-white leading-[1.05] mb-3" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
            {rightTitle}
          </h2>

          {/* Descripción */}
          {rightDesc && <p className="text-white/90 leading-[1.6] mb-[18px] text-[15px]">{rightDesc}</p>}

          {/* Lista de beneficios */}
          {rightList.length > 0 && (
            <ul className="flex flex-col gap-2.5 mb-6 p-0 list-none">
              {rightList.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/95">
                  {/* Bullet con logo (en vez de 🐶 o huella) */}
                  <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
                    <span
                      className="inline-flex items-center justify-center rounded-[10px] overflow-hidden"
                      style={{
                        width: 22,
                        height: 22,
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.18)',
                      }}
                    >
                      <Image
                        src="/assets/logos/adogme-logo.png"
                        alt=""
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Acciones */}
          {rightActions.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-[22px]">
              {rightActions.map((action, i) =>
                action.href ? (
                  <Link
                    key={i}
                    href={action.href}
                    className="inline-flex items-center gap-2.5 px-4 py-3 rounded-[14px] font-[900] text-[13px]
                               text-white border border-white/16 bg-white/12
                               hover:bg-white/16 hover:border-white/22 hover:-translate-y-0.5
                               transition-all duration-150"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {action.icon}
                    </span>
                    {action.label}
                  </Link>
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2.5 px-4 py-3 rounded-[14px] font-[900] text-[13px]
                               text-white border border-white/16 bg-white/12
                               hover:bg-white/16 hover:border-white/22 hover:-translate-y-0.5
                               transition-all duration-150"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
