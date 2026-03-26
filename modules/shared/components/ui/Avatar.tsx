// modules/shared/components/ui/Avatar.tsx
'use client'

import Image from 'next/image'

export type AvatarSize  = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'square'

interface AvatarProps {
  src?:       string
  name:       string
  size?:      AvatarSize
  shape?:     AvatarShape
  className?: string
}

const SIZE_PX: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 }
const SIZE_TW: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

// Color derivado del nombre — consistente para el mismo nombre
function nameToColor(name: string): string {
  const COLORS = [
    '#FF6B6B','#E03131','#FF922B','#F59F00',
    '#51CF66','#12B886','#339AF0','#7950F2',
    '#F06595','#CC5DE8',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name, size = 'md', shape = 'circle', className = '' }: AvatarProps) {
  const px       = SIZE_PX[size]
  const sizeCls  = SIZE_TW[size]
  const shapeCls = shape === 'circle' ? 'rounded-full' : 'rounded-[10px]'

  if (src) {
    return (
      <div className={`relative overflow-hidden flex-shrink-0 ${sizeCls} ${shapeCls} ${className}`}>
        <Image src={src} alt={name} fill className="object-cover object-center" sizes={`${px}px`} />
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center font-[900] text-white flex-shrink-0 select-none ${sizeCls} ${shapeCls} ${className}`}
      style={{ background: nameToColor(name) }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
