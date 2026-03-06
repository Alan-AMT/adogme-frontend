// modules/shared/components/ui/Spinner.tsx
'use client'

interface SpinnerProps {
  size?:  'sm' | 'md' | 'lg'
  color?: string
  label?: string
}

const SIZE_CLS = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-9 h-9 border-[3px]' }

// Basado en .auth-spinner: border rgba/transparente + border-top sólido
export function Spinner({ size = 'md', color = 'var(--brand)', label = 'Cargando…' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block rounded-full animate-spin flex-shrink-0 ${SIZE_CLS[size]}`}
      style={{
        borderColor: `${color}30`,
        borderTopColor: color,
      }}
    />
  )
}
