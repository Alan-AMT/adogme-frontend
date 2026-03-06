// modules/shared/components/layout/SectionHeader.tsx
// Server Component — sin 'use client'
// Título + subtítulo + breadcrumb opcional + acción opcional (derecha)
// ─────────────────────────────────────────────────────────────────────────────
//
// USO:
//   // Básico
//   <SectionHeader title="Catálogo de perros" />
//
//   // Con subtítulo y kicker
//   <SectionHeader
//     kicker="Adopción"
//     title="Encuentra tu compañero ideal"
//     subtitle="Más de 300 perros esperando un hogar en la CDMX"
//   />
//
//   // Con breadcrumb y acción
//   <SectionHeader
//     title="Mis solicitudes"
//     breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Mis solicitudes' }]}
//     action={<Button>+ Nueva solicitud</Button>}
//   />
//
//   // Centrado (para secciones de landing)
//   <SectionHeader title="Cómo funciona" centered />
//
//   // Tamaño grande para hero de página
//   <SectionHeader title="Portal del Refugio" size="xl" />
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import type { ReactNode } from 'react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Breadcrumb {
  label: string
  href?: string
  icon?: string
}

type HeaderSize = 'sm' | 'md' | 'lg' | 'xl'

interface SectionHeaderProps {
  /** Texto pequeño encima del título — ej: "Catálogo · 348 resultados" */
  kicker?:      string
  /** Color del kicker. Default: brand */
  kickerColor?: 'brand' | 'muted' | 'green' | 'blue'
  /** Título principal */
  title:        string
  /** Descripción debajo del título */
  subtitle?:    string
  /** Migas de pan */
  breadcrumbs?: Breadcrumb[]
  /** Componente/botón alineado a la derecha */
  action?:      ReactNode
  /** Alineación del texto. Default: 'left' */
  centered?:    boolean
  /** Tamaño del título. Default: 'lg' */
  size?:        HeaderSize
  /** Margen inferior. Default: true */
  mb?:          boolean
  /** Clase adicional */
  className?:   string
  /** Decoración — línea de acento brand bajo el título */
  accent?:      boolean
}

// ─── Mapas ───────────────────────────────────────────────────────────────────

const TITLE_SIZE: Record<HeaderSize, string> = {
  sm: 'text-[18px] sm:text-[20px]',
  md: 'text-[22px] sm:text-[26px]',
  lg: 'text-[26px] sm:text-[32px]',
  xl: 'text-[32px] sm:text-[40px] lg:text-[48px]',
}

const KICKER_COLOR: Record<NonNullable<SectionHeaderProps['kickerColor']>, string> = {
  brand: 'text-[#ff6b6b]',
  muted: 'text-[#9ca3af]',
  green: 'text-[#16a34a]',
  blue:  'text-[#2563eb]',
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 mb-3">
      {items.map((crumb, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {/* Separador */}
            {i > 0 && (
              <span
                className="material-symbols-outlined text-[#d4d4d8]"
                style={{ fontSize: 14 }}
                aria-hidden="true"
              >
                chevron_right
              </span>
            )}

            {/* Crumb */}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="flex items-center gap-1 text-[12px] font-[700] text-[#a1a1aa]
                           hover:text-[#ff6b6b] transition-colors duration-150"
              >
                {crumb.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                    {crumb.icon}
                  </span>
                )}
                {crumb.label}
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 text-[12px] font-[800]"
                style={{ color: isLast ? '#18181b' : '#a1a1aa' }}
                aria-current={isLast ? 'page' : undefined}
              >
                {crumb.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                    {crumb.icon}
                  </span>
                )}
                {crumb.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionHeader({
  kicker,
  kickerColor  = 'brand',
  title,
  subtitle,
  breadcrumbs,
  action,
  centered     = false,
  size         = 'lg',
  mb           = true,
  className    = '',
  accent       = false,
}: SectionHeaderProps) {
  const alignClass = centered ? 'text-center items-center' : 'items-start'

  return (
    <div
      className={[
        'flex flex-col w-full',
        alignClass,
        mb ? 'mb-8 md:mb-10' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Breadcrumbs — siempre a la izquierda aunque el header esté centrado */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={centered ? 'self-start' : ''}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      {/* Row: contenido izq + action dcha */}
      <div
        className={[
          'flex gap-4 w-full',
          centered
            ? 'flex-col items-center'
            : 'flex-col sm:flex-row sm:items-start sm:justify-between',
        ].join(' ')}
      >
        {/* Bloque de texto */}
        <div className={['flex flex-col', alignClass, centered ? 'items-center' : ''].join(' ')}>

          {/* Kicker */}
          {kicker && (
            <span
              className={[
                'text-[11px] font-[950] uppercase tracking-[0.2em] mb-2 leading-none',
                KICKER_COLOR[kickerColor],
              ].join(' ')}
            >
              {kicker}
            </span>
          )}

          {/* Título — DM Sans heredado de globals.css, 950 para presencia visual */}
          <h1
            className={[
              'font-[950] text-[#18181b] leading-[1.1] tracking-tight',
              TITLE_SIZE[size],
              accent ? 'relative pb-3' : '',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-body, var(--font-sans))' }}
          >
            {title}

            {/* Línea de acento bajo el título */}
            {accent && (
              <span
                className="absolute bottom-0 left-0 h-[3px] w-12 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #ff6b6b, #fa5252)',
                  ...(centered ? { left: '50%', transform: 'translateX(-50%)' } : {}),
                }}
                aria-hidden="true"
              />
            )}
          </h1>

          {/* Subtítulo */}
          {subtitle && (
            <p
              className={[
                'mt-2.5 text-[15px] font-[500] text-[#71717a] leading-[1.6]',
                centered ? 'max-w-xl' : 'max-w-2xl',
              ].join(' ')}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Action slot — siempre a la derecha en desktop */}
        {action && (
          <div className={['flex-shrink-0', centered ? 'mt-4' : 'mt-1 sm:mt-0'].join(' ')}>
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Variantes de conveniencia ────────────────────────────────────────────────

/** Header de página estándar con breadcrumb de una sola línea */
export function PageHeader({
  title, subtitle, backHref, backLabel = 'Volver', action, className = '',
}: {
  title: string; subtitle?: string
  backHref?: string; backLabel?: string
  action?: ReactNode; className?: string
}) {
  const crumbs: Breadcrumb[] = backHref
    ? [{ label: backLabel, href: backHref, icon: 'arrow_back' }, { label: title }]
    : []

  return (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      breadcrumbs={crumbs.length ? crumbs : undefined}
      action={action}
      size="md"
      className={className}
    />
  )
}

/** Header centrado para secciones de landing */
export function LandingHeader({
  kicker, title, subtitle, action, className = '',
}: {
  kicker?: string; title: string; subtitle?: string
  action?: ReactNode; className?: string
}) {
  return (
    <SectionHeader
      kicker={kicker}
      title={title}
      subtitle={subtitle}
      action={action}
      size="xl"
      centered
      accent
      mb={false}
      className={className}
    />
  )
}

/** Header compacto para dashboards — sin margen grande */
export function DashboardHeader({
  title, subtitle, action, breadcrumbs, className = '',
}: {
  title: string; subtitle?: string
  action?: ReactNode; breadcrumbs?: Breadcrumb[]; className?: string
}) {
  return (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      action={action}
      size="sm"
      mb={false}
      className={className}
    />
  )
}
