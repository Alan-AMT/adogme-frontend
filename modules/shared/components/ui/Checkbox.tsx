// modules/shared/components/ui/Checkbox.tsx
'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?:       string
  description?: string
  error?:       string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? `chk-${label?.replace(/\s+/g, '-').toLowerCase() ?? Math.random()}`

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 cursor-pointer select-none group"
        >
          {/* Hidden native input + custom visual box */}
          <div className="relative flex-shrink-0 mt-[1px]">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              className="peer sr-only"
              {...props}
            />
            {/* Visual box — peer-checked alters bg/border */}
            <div
              className={[
                'w-5 h-5 rounded-[6px] border-2 flex items-center justify-center',
                'transition-all duration-200 bg-white',
                'peer-focus-visible:shadow-[0_0_0_4px_rgba(255,107,107,0.2)]',
                error
                  ? 'border-[#fca5a5] peer-checked:bg-[#ef4444] peer-checked:border-[#ef4444]'
                  : 'border-[#d4d4d8] peer-checked:bg-[var(--brand)] peer-checked:border-[var(--brand)] group-hover:border-[#a1a1aa]',
              ].join(' ')}
            >
              {/* Checkmark always white — only visible when bg is colored */}
              <span
                className="material-symbols-outlined text-white leading-none"
                style={{
                  fontSize: 13,
                  fontVariationSettings: "'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 14",
                }}
              >
                check
              </span>
            </div>
          </div>

          {/* Label + description */}
          {(label || description) && (
            <div className="flex flex-col gap-0.5 pt-[1px]">
              {label && (
                <span className="text-[13px] font-[700] text-[#1f2937] leading-snug">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-[12px] text-[#71717a] font-[500] leading-relaxed">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {error && (
          <p className="text-xs font-[800] text-[#b91c1c] flex items-center gap-1 ml-8">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 13, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14" }}
            >
              error
            </span>
            {error}
          </p>
        )}
      </div>
    )
  },
)
Checkbox.displayName = 'Checkbox'
