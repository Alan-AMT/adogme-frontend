// modules/auth/components/ShelterPendingView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archivo 92 — ShelterPendingView (NUEVO)
// Página completa para refugios con cuenta pendiente de aprobación.
// Ilustración + mensaje + timeline del proceso + datos de soporte.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'

// ── Timeline items ────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    icon: 'check_circle',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#dcfce7',
    label: 'Solicitud recibida',
    note: 'Tu información fue enviada y recibida correctamente.',
    done: true,
  },
  {
    icon: 'manage_search',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    label: 'Revisión del equipo',
    note: 'El equipo de aDOGme verificará la información de tu refugio.',
    done: false,
    active: true,
  },
  {
    icon: 'verified',
    color: '#a1a1aa',
    bg: '#f9fafb',
    border: '#e5e7eb',
    label: 'Aprobación y activación',
    note: 'Recibirás un correo de confirmación al aprobarse.',
    done: false,
  },
]

// ── Contacto de soporte ───────────────────────────────────────────────────────
const SUPPORT = [
  { icon: 'mail',  label: 'soporte@adogme.mx' },
  { icon: 'phone', label: '55 1234 5678' },
]

// ── Componente principal ──────────────────────────────────────────────────────
export default function ShelterPendingView() {
  const user   = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  const shelterName = user
    ? (user as { nombreRefugio?: string }).nombreRefugio ?? (user as { nombre: string }).nombre
    : 'tu refugio'

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col">

      {/* ── Mini-header ── */}
      <header className="px-6 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 w-fit group" aria-label="Volver al inicio">
          <div
            className="w-9 h-9 rounded-[12px] flex items-center justify-center overflow-hidden
                       group-hover:scale-105 transition-transform duration-200"
            style={{ border: '2px solid #ff6b6b', background: 'transparent' }}
          >
            <Image
              src="/assets/logos/adogme-logo.png"
              alt="aDOGme logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <span className="font-[950] text-[20px] text-[#111827] tracking-[-0.02em]">
            a<span className="text-[#ff6b6b]">DOG</span>me
          </span>
        </Link>
      </header>

      {/* ── Contenido principal ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* ── Card principal ── */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 flex flex-col gap-6"
            style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}>

            {/* Icono de estado */}
            <div className="flex flex-col items-center text-center gap-3">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: '#fef3c7', border: '3px solid #fde68a' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 48,
                    color: '#b45309',
                    fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48",
                  }}
                >
                  pending
                </span>
              </div>

              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-[900] uppercase tracking-[0.12em] mb-3"
                  style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-pulse" />
                  En revisión
                </span>

                <h1 className="text-[26px] font-[950] text-[#111827] tracking-tight mt-2 mb-2">
                  Solicitud pendiente
                </h1>
                <p className="text-[14px] text-[#6b7280] leading-relaxed">
                  La solicitud de{' '}
                  <strong className="text-[#111827]">{shelterName}</strong>{' '}
                  está siendo revisada por nuestro equipo.
                </p>
              </div>
            </div>

            {/* Tiempo estimado */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-[14px]"
              style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}
            >
              <span
                className="material-symbols-outlined flex-shrink-0"
                style={{ fontSize: 20, color: '#1d4ed8', fontVariationSettings: "'FILL' 1" }}
              >
                schedule
              </span>
              <div>
                <p className="text-[13px] font-[900] text-[#1d4ed8]">Tiempo estimado: 1–3 días hábiles</p>
                <p className="text-[11px] font-[600] text-[#3b82f6]">
                  Te notificaremos por correo al aprobar tu refugio.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-[950] uppercase tracking-[0.18em] text-[#a1a1aa]">
                Estado del proceso
              </p>
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3.5 py-3 rounded-[12px]"
                  style={{ background: item.bg, border: `1px solid ${item.border}` }}
                >
                  <span
                    className="material-symbols-outlined flex-shrink-0 mt-0.5"
                    style={{
                      fontSize: 18,
                      color: item.color,
                      fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1 leading-tight">
                    <p className="text-[13px] font-[900]" style={{ color: item.done ? '#15803d' : item.color }}>
                      {item.label}
                      {item.active && (
                        <span className="ml-2 text-[10px] font-[900] px-1.5 py-0.5 rounded-full bg-[#b45309]/10 text-[#b45309]">
                          Ahora
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] font-[600] text-[#9ca3af] mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Qué hacer mientras */}
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-[950] uppercase tracking-[0.18em] text-[#a1a1aa]">
                Mientras tanto puedes
              </p>
              {[
                { icon: 'pets',      label: 'Explorar el catálogo de perros', href: '/perros' },
                { icon: 'home_work', label: 'Ver otros refugios verificados', href: '/refugios' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-[12px] text-[13px] font-[800]
                             text-[#374151] border border-[#e5e7eb] bg-white
                             hover:bg-[#fff5f5] hover:border-[#ffd0d0] hover:text-[#ff6b6b]
                             transition-all duration-150"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, color: '#a1a1aa' }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  <span className="material-symbols-outlined ml-auto text-[#d4d4d8]" style={{ fontSize: 16 }}>
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Card de soporte ── */}
          <div className="bg-white rounded-[20px] p-5 flex flex-col gap-3"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p className="text-[11px] font-[950] uppercase tracking-[0.18em] text-[#a1a1aa]">
              ¿Tienes preguntas?
            </p>
            <p className="text-[13px] font-[700] text-[#6b7280]">
              Contáctanos directamente y te ayudamos con el proceso de verificación.
            </p>
            <div className="flex flex-col gap-2">
              {SUPPORT.map(item => (
                <div key={item.label} className="flex items-center gap-2.5 text-[13px] font-[800] text-[#374151]">
                  <span className="material-symbols-outlined text-[#ff6b6b]" style={{ fontSize: 18 }}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Cerrar sesión ── */}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-full
                       border border-[#fecaca] bg-white text-[#ef4444] text-[14px] font-[800]
                       hover:bg-[#fef2f2] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Cerrar sesión
          </button>

        </div>
      </main>
    </div>
  )
}
