// modules/shared/components/ui/Skeleton.tsx
// Animación shimmer idéntica a los skeleton de homeDogs.css y homeShelters.css
'use client'

import type { CSSProperties } from 'react'

type SkeletonVariant = 'text' | 'rect' | 'circle'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?:   string | number
  height?:  string | number
  lines?:   number       // solo para variant="text"
  className?: string
}

// shimmer via Tailwind animate-pulse — mismo efecto que hsPulse del CSS original
const BASE = 'bg-[#f4f4f5] animate-pulse'

export function Skeleton({ variant = 'rect', width, height, lines = 3, className = '' }: SkeletonProps) {
  const style: CSSProperties = {
    width:  typeof width  === 'number' ? `${width}px`  : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  if (variant === 'circle') {
    return (
      <span
        className={`${BASE} rounded-full inline-block flex-shrink-0 ${className}`}
        style={{ width: style.width ?? 40, height: style.height ?? 40, ...style }}
      />
    )
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={`${BASE} rounded-[4px] block`}
            style={{ width: i === lines - 1 ? '60%' : '100%', height: 12 }}
          />
        ))}
      </div>
    )
  }

  // rect (default) — .home-dog-skel__media, .stamp-skeleton
  return (
    <span
      className={`${BASE} rounded-[1.25rem] block ${className}`}
      style={style}
    />
  )
}

// ── Skeleton compuesto: DogCard ────────────────────────────────────────────────
export function DogCardSkeleton() {
  return (
    <div className="rounded-[1.5rem] p-3 bg-[#f4f4f5] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
      <div className="bg-white rounded-[1rem] overflow-hidden flex flex-col">
        {/* .home-dog-skel__media */}
        <div className="h-[200px] bg-[#f4f4f5] animate-pulse" />
        {/* .home-dog-skel__body */}
        <div className="p-5 flex flex-col gap-2">
          <div className="h-5 w-[60%] bg-[#f4f4f5] animate-pulse rounded-[4px]" />
          <div className="h-3 w-[80%] bg-[#f4f4f5] animate-pulse rounded-[4px]" />
          <div className="h-3 w-[70%] bg-[#f4f4f5] animate-pulse rounded-[4px]" />
          <div className="h-9 w-full bg-[#f4f4f5] animate-pulse rounded-full mt-2" />
        </div>
      </div>
    </div>
  )
}

// ── Skeleton compuesto: ShelterCard ───────────────────────────────────────────
// Basado en .hs-skelFrame y .hs-skelPanel
export function ShelterCardSkeleton() {
  return (
    <div
      className="rounded-[1.25rem] p-3 shadow-[0_14px_34px_rgba(24,24,27,0.10)]"
      style={{ backgroundImage: "url('/assets/hero/back.png')", backgroundSize: '260px auto' }}
    >
      <div className="rounded-[1.05rem] overflow-hidden bg-white border border-[#e4e4e7] grid grid-cols-1 lg:grid-cols-[280px_1fr] animate-pulse">
        <div className="bg-[#f4f4f5] min-h-[160px] lg:min-h-[380px]" />
        <div className="bg-[#ffb3b3] min-h-[160px]" />
      </div>
    </div>
  )
}
