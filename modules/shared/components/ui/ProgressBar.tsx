// modules/shared/components/ui/ProgressBar.tsx
'use client'

interface ProgressBarProps {
  value:     number   // 0–100
  size?:     'sm' | 'md' | 'lg'
  color?:    string
  label?:    string
  animated?: boolean
}

const SIZE_H = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

export function ProgressBar({ value, size = 'md', color = 'var(--brand)', label, animated }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-[800] text-[#3f3f46]">{label}</span>
          <span className="text-xs font-[900] tabular-nums" style={{ color }}>{clamped}%</span>
        </div>
      )}
      {/* .auth-strength__bar */}
      <div className={`w-full ${SIZE_H[size]} bg-[#f4f4f5] rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
    </div>
  )
}
