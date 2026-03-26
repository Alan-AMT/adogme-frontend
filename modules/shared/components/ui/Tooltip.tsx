// modules/shared/components/ui/Tooltip.tsx
'use client'

import type { ReactNode } from 'react'

interface TooltipProps {
  content:    string
  position?:  'top' | 'bottom' | 'left' | 'right'
  children:   ReactNode
  className?: string
}

const POS: Record<NonNullable<TooltipProps['position']>, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({ content, position = 'top', children, className = '' }: TooltipProps) {
  return (
    <span className={`relative group inline-flex ${className}`}>
      {children}
      <span
        className={[
          'pointer-events-none absolute z-[100] px-2.5 py-1.5 rounded-[8px]',
          'bg-[#18181b] text-white text-xs font-[700] whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          POS[position],
        ].join(' ')}
      >
        {content}
        {/* Arrow */}
        {position === 'top' && (
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18181b]" />
        )}
        {position === 'bottom' && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#18181b]" />
        )}
        {position === 'left' && (
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#18181b]" />
        )}
        {position === 'right' && (
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#18181b]" />
        )}
      </span>
    </span>
  )
}
