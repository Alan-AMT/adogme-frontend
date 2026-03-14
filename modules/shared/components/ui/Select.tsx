// modules/shared/components/ui/Select.tsx
'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?:       string
  error?:       string
  helperText?:  string
  options:      SelectOption[]
  placeholder?: string
  size?:        'sm' | 'md' | 'lg'
  required?:    boolean
}

// Basado en .cat-select + .auth-select
// Flecha SVG custom idéntica a cat-select
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`

const SIZE_CLS = {
  sm: 'text-xs  py-2   px-3',
  md: 'text-sm  py-3   px-3',
  lg: 'text-base py-3.5 px-4',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, size = 'md', required, className = '', disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">

        {label && (
          <label className="text-[11px] font-[700] text-[#a1a1aa] uppercase tracking-[0.07em]">
            {label}
            {required && <span className="text-[var(--brand)] ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          disabled={disabled}
          {...props}
          style={{
            backgroundImage: CHEVRON_SVG,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            appearance: 'none',
          }}
          className={[
            // Base — .cat-select / .auth-select
            'w-full rounded-[14px] border bg-[#f9fafb] text-[#3f3f46] outline-none',
            'font-[600] cursor-pointer pr-8',
            'transition-all duration-200',
            SIZE_CLS[size],
            error
              ? 'border-[#fca5a5] focus:border-[#ef4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
              : 'border-[#e5e7eb] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.2)] focus:bg-white',
            disabled ? 'opacity-50 cursor-not-allowed bg-[#f4f4f5]' : '',
            className,
          ].filter(Boolean).join(' ')}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-xs font-[800] text-[#b91c1c] flex items-center gap-1">
            <span className="material-symbols-outlined"
              style={{ fontSize: 14, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14" }}>
              error
            </span>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[#9ca3af] font-[600]">{helperText}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
