// modules/shared/components/ui/Button.tsx
'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link'
export type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  loading?:   boolean
  leftIcon?:  ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  children:   ReactNode
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BASE =
  'inline-flex items-center justify-center gap-2 font-bold rounded-full border-0 ' +
  'transition-all duration-150 cursor-pointer select-none outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
  'active:translate-y-px'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FA5252] text-white shadow-[0_18px_30px_rgba(15,23,42,0.14)] ' +
    'hover:bg-[#E03131] focus-visible:ring-[#FA5252]',
  secondary:
    'bg-[#F5F0F0] text-[#0f172a] ' +
    'hover:bg-[#ede8e8] focus-visible:ring-[#FA5252]',
  ghost:
    'bg-white/90 text-[#0f172a] border border-[#e4e4e7] ' +
    'shadow-[0_10px_18px_rgba(15,23,42,0.06)] ' +
    'hover:bg-white focus-visible:ring-[#FA5252]',
  danger:
    'bg-[#ef4444] text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)] ' +
    'hover:bg-[#dc2626] focus-visible:ring-[#ef4444]',
  outline:
    'bg-transparent text-[#0f172a] border border-[#e4e4e7] ' +
    'hover:border-[#FA5252] hover:text-[#FA5252] hover:bg-[#fff5f5] ' +
    'focus-visible:ring-[#FA5252]',
  link:
    'bg-transparent text-[#FA5252] underline-offset-4 ' +
    'hover:underline focus-visible:ring-[#FA5252]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2 min-h-[36px]',
  md: 'text-sm px-5 py-3 min-h-[44px]',
  lg: 'text-base px-8 py-4 min-h-[52px] text-[1.05rem]',
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function ButtonSpinner() {
  return (
    <span
      className="block w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin"
      aria-hidden="true"
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  leftIcon,
  rightIcon,
  fullWidth,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
    loading   ? 'pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? <ButtonSpinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
