// modules/shared/components/ui/Badge.tsx
'use client'

import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'available'   // verde   — disponible
  | 'in_process'  // amarillo — en proceso
  | 'adopted'     // gris    — adoptado
  | 'pending'     // ámbar   — pendiente aprobación
  | 'approved'    // verde oscuro — aprobado
  | 'rejected'    // rojo    — rechazado
  | 'draft'       // azul gris — borrador
  | 'neutral'     // gris neutro
  | 'brand'       // rojo marca — para pills destacados

export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?:  BadgeVariant
  size?:     BadgeSize
  dot?:      boolean
  children:  ReactNode
  className?: string
}

// Paleta basada en dp-badge--, hs-pill, cat-dog-badge del CSS original
const VARIANT_CLS: Record<BadgeVariant, string> = {
  available:  'bg-[#d1fae5] text-[#065f46] ring-1 ring-[#a7f3d0]',
  in_process: 'bg-[#fef3c7] text-[#92400e] ring-1 ring-[#fde68a]',
  adopted:    'bg-[#f4f4f5] text-[#71717a] ring-1 ring-[#e4e4e7]',
  pending:    'bg-[#fff7ed] text-[#c2410c] ring-1 ring-[#fed7aa]',
  approved:   'bg-[#dcfce7] text-[#166534] ring-1 ring-[#bbf7d0]',
  rejected:   'bg-[#fef2f2] text-[#b91c1c] ring-1 ring-[#fecaca]',
  draft:      'bg-[#eff6ff] text-[#1d4ed8] ring-1 ring-[#bfdbfe]',
  neutral:    'bg-[#fafafa] text-[#52525b] ring-1 ring-[#e4e4e7]',
  brand:      'bg-[#fff1f2] text-[#ff6b6b] ring-1 ring-[#ffd0d0]',
}

const DOT_COLOR: Record<BadgeVariant, string> = {
  available:  'bg-[#10b981]',
  in_process: 'bg-[#f59e0b]',
  adopted:    'bg-[#a1a1aa]',
  pending:    'bg-[#f97316]',
  approved:   'bg-[#16a34a]',
  rejected:   'bg-[#ef4444]',
  draft:      'bg-[#3b82f6]',
  neutral:    'bg-[#a1a1aa]',
  brand:      'bg-[#ff6b6b]',
}

const SIZE_CLS: Record<BadgeSize, string> = {
  sm: 'text-[0.67rem] px-2 py-0.5',
  md: 'text-[0.72rem] px-3 py-1',
}

export function Badge({ variant = 'neutral', size = 'sm', dot, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-[800] uppercase tracking-[0.08em]',
        VARIANT_CLS[variant],
        SIZE_CLS[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {dot && (
        <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLOR[variant]}`} />
      )}
      {children}
    </span>
  )
}

// ─── Helper: mapea DogStatus → BadgeVariant ───────────────────────────────────
import type { RequestStatus } from '../../domain/AdoptionRequest'
import type { DogStatus } from '../../domain/Dog'
import type { ShelterStatus } from '../../domain/Shelter'

export function dogStatusBadgeVariant(status: DogStatus): BadgeVariant {
  const map: Record<DogStatus, BadgeVariant> = {
    disponible:    'available',
    en_proceso:    'in_process',
    adoptado:      'adopted',
    no_disponible: 'neutral',
  }
  return map[status]
}

export function requestStatusBadgeVariant(status: RequestStatus): BadgeVariant {
  const map: Record<RequestStatus, BadgeVariant> = {
    pending:   'pending',
    in_review: 'in_process',
    approved:  'approved',
    rejected:  'rejected',
    cancelled: 'neutral',
  }
  return map[status]
}

export function shelterStatusBadgeVariant(status: ShelterStatus): BadgeVariant {
  const map: Record<ShelterStatus, BadgeVariant> = {
    pending:   'pending',
    approved:  'approved',
    rejected:  'rejected',
    suspended: 'neutral',
  }
  return map[status]
}
