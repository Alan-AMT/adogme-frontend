// modules/shared/components/ui/Textarea.tsx
'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:      string
  error?:      string
  helperText?: string
  rows?:       number
  maxLength?:  number
  required?:   boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, rows = 4, maxLength, required, value, onChange, className = '', disabled, ...props }, ref) => {
    const len = typeof value === 'string' ? value.length : 0

    return (
      <div className="flex flex-col gap-1.5">

        {label && (
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-[900] text-[#1f2937]">
              {label}
              {required && <span className="text-[var(--brand)] ml-1">*</span>}
            </label>
            {maxLength && (
              <span className={`text-xs font-[700] tabular-nums ${len > maxLength * 0.9 ? 'text-[var(--brand)]' : 'text-[#9ca3af]'}`}>
                {len}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
          className={[
            // .auth-textarea
            'w-full rounded-[14px] border bg-[#f9fafb] text-[#111827] outline-none',
            'text-sm px-3.5 py-3 resize-none',
            'transition-all duration-200',
            error
              ? 'border-[#fca5a5] focus:border-[#ef4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
              : 'border-[#e5e7eb] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.2)] focus:bg-white',
            disabled ? 'opacity-50 cursor-not-allowed bg-[#f4f4f5]' : '',
            className,
          ].filter(Boolean).join(' ')}
        />

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
Textarea.displayName = 'Textarea'
