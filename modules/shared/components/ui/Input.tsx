// modules/shared/components/ui/Input.tsx
'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?:      string
  error?:      string
  helperText?: string
  leftIcon?:   ReactNode
  rightIcon?:  ReactNode
  size?:       InputSize
  required?:   boolean
}

// Basado en .auth-input: border, fondo #f9fafb, focus brand, radius 14px
const SIZE_CLS: Record<InputSize, string> = {
  sm: 'text-xs  py-2   px-3',
  md: 'text-sm  py-3   px-3',
  lg: 'text-base py-3.5 px-4',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, size = 'md', required, className = '', disabled, ...props }, ref) => {
    const withLeft  = !!leftIcon
    const withRight = !!rightIcon

    return (
      <div className="flex flex-col gap-1.5">

        {/* Label */}
        {label && (
          <label className="text-[13px] font-[900] text-[#1f2937]">
            {label}
            {required && <span className="text-[var(--brand)] ml-1">*</span>}
          </label>
        )}

        {/* Control wrapper */}
        <div className="relative flex items-center">

          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 pointer-events-none text-[#a1a1aa] flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            disabled={disabled}
            {...props}
            className={[
              // Base — .auth-input
              'w-full rounded-[14px] border bg-[#f9fafb] text-[#111827] outline-none',
              'transition-all duration-200',
              // Padding izquierdo si hay icono
              withLeft  ? 'pl-10' : 'pl-3',
              withRight ? 'pr-10' : 'pr-3',
              SIZE_CLS[size],
              // Estado normal
              error
                ? 'border-[#fca5a5] focus:border-[#ef4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
                : 'border-[#e5e7eb] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.2)] focus:bg-white',
              // Disabled — .auth-input con opacidad
              disabled ? 'opacity-50 cursor-not-allowed bg-[#f4f4f5]' : '',
              className,
            ].filter(Boolean).join(' ')}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error / helper */}
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
Input.displayName = 'Input'
