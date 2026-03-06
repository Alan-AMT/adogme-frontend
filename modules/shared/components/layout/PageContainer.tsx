// modules/shared/components/layout/PageContainer.tsx
// Server Component — sin 'use client'
// Wrapper de max-width + padding horizontal/vertical responsive
// ─────────────────────────────────────────────────────────────────────────────
//
// USO:
//   <PageContainer>                        → max-w-7xl, padding estándar
//   <PageContainer size="sm">              → max-w-3xl (auth, forms)
//   <PageContainer size="md">             → max-w-5xl (artículos, detalle)
//   <PageContainer size="lg">             → max-w-7xl (catálogos) ← default
//   <PageContainer size="full">           → sin max-width
//   <PageContainer py="none">             → sin padding vertical (para sections)
//   <PageContainer as="section">          → cambia el tag HTML
//   <PageContainer glass>                 → fondo glass con blur
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type VerticalPad   = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type HTag          = 'div' | 'main' | 'section' | 'article' | 'aside'

interface PageContainerProps {
  children:   ReactNode
  /** Ancho máximo del contenedor. Default: 'lg' */
  size?:      ContainerSize
  /** Padding vertical. Default: 'md' */
  py?:        VerticalPad
  /** Tag HTML a usar. Default: 'div' */
  as?:        HTag
  /** Clase CSS adicional */
  className?: string
  /** Fondo glass sutil */
  glass?:     boolean
  /** Id para anclas */
  id?:        string
}

// ─── Mapas de clases ──────────────────────────────────────────────────────────

const SIZE_MAP: Record<ContainerSize, string> = {
  sm:   'max-w-3xl',    // 768px  — auth, forms, artículos cortos
  md:   'max-w-5xl',    // 1024px — detalle de perro/refugio, artículos
  lg:   'max-w-7xl',    // 1280px — catálogos, dashboards ← DEFAULT
  xl:   'max-w-[1440px]', // 1440px — landing sections con mucho espacio
  full: 'max-w-none',   // sin límite
}

// Padding vertical — valores calibrados al sistema de secciones del proyecto
const PY_MAP: Record<VerticalPad, string> = {
  none: 'py-0',
  xs:   'py-4 md:py-6',
  sm:   'py-6 md:py-10',
  md:   'py-10 md:py-14',    // DEFAULT — entre secciones normales
  lg:   'py-14 md:py-20',    // secciones hero secundarias
  xl:   'py-20 md:py-28',    // hero principal
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PageContainer({
  children,
  size      = 'lg',
  py        = 'md',
  as: Tag   = 'div',
  className = '',
  glass     = false,
  id,
}: PageContainerProps) {
  const maxW   = SIZE_MAP[size]
  const pyVal  = PY_MAP[py]

  const glassStyle = glass
    ? 'bg-white/70 backdrop-blur-md border border-white/50 rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
    : ''

  return (
    <Tag
      id={id}
      className={[
        // Padding horizontal — 16px mobile / 24px tablet / 32px desktop
        'w-full px-4 sm:px-6 lg:px-8',
        // Centrado + max-width
        'mx-auto',
        maxW,
        // Padding vertical
        pyVal,
        // Glass opcional
        glassStyle,
        // Extra clases del usuario
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  )
}

// ─── Variantes de conveniencia ────────────────────────────────────────────────
// Para no repetir props en los casos más comunes

/** Contenedor para páginas de auth y formularios (max-w-3xl) */
export function AuthContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageContainer size="sm" py="lg" className={className}>
      {children}
    </PageContainer>
  )
}

/** Contenedor para páginas de detalle (perro, refugio) — max-w-5xl */
export function DetailContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageContainer size="md" py="md" className={className}>
      {children}
    </PageContainer>
  )
}

/** Contenedor para catálogos y listados — max-w-7xl */
export function CatalogContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageContainer size="lg" py="md" className={className}>
      {children}
    </PageContainer>
  )
}

/** Sección de landing — max-w-xl, padding grande */
export function SectionContainer({
  children, id, className = '',
}: {
  children: ReactNode; id?: string; className?: string
}) {
  return (
    <PageContainer as="section" size="xl" py="lg" id={id} className={className}>
      {children}
    </PageContainer>
  )
}
