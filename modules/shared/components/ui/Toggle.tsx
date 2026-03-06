// modules/shared/components/ui/Toggle.tsx
// Toggle switch — con label y descripción opcionales.
// Estado controlado externamente (checked + onChange).
'use client'

import type { InputHTMLAttributes } from 'react'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?:       string
  description?: string
  checked:      boolean
  onChange:     (checked: boolean) => void
}

export function Toggle({ label, description, checked, onChange, disabled, id, className = '', ...props }: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={[
        'flex items-start gap-3',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Track + knob */}
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
          {...props}
        />
        {/* Track */}
        <div
          className={[
            'w-10 h-6 rounded-full transition-colors duration-200',
            checked ? 'bg-[#ff6b6b]' : 'bg-[#e4e4e7]',
          ].join(' ')}
        />
        {/* Knob */}
        <div
          className={[
            'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-1',
          ].join(' ')}
        />
      </div>

      {/* Text */}
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-[0.875rem] font-[700] text-[#18181b] leading-snug">{label}</span>
          )}
          {description && (
            <span className="text-[0.78rem] text-[#71717a] font-[500] leading-snug">{description}</span>
          )}
        </div>
      )}
    </label>
  )
}
