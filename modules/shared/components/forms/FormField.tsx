// modules/shared/components/forms/FormField.tsx
// Wrapper universal para cualquier campo de formulario.
// Props: label, error?, helperText?, required?, children
// Extiende el patrón visual de Input.tsx (label 13px 900, error rojo, helper gris)

import type { ReactNode } from 'react'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  label:        string
  error?:       string
  helperText?:  string
  required?:    boolean
  children:     ReactNode
  /** id para conectar label con el control via htmlFor */
  htmlFor?:     string
  className?:   string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FormField({
  label,
  error,
  helperText,
  required,
  children,
  htmlFor,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>

      {/* Label — idéntico al de Input.tsx */}
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-[900] text-[#1f2937]"
      >
        {label}
        {required && (
          <span className="text-[var(--brand)] ml-1" aria-hidden="true">*</span>
        )}
        {required && (
          <span className="sr-only">(requerido)</span>
        )}
      </label>

      {/* Contenido — Input, Select, Textarea, picker custom, etc. */}
      {children}

      {/* Error — mutuamente excluyente con helperText */}
      {error && (
        <p
          className="text-xs font-[800] text-[#b91c1c] flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 14,
              fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14",
            }}
            aria-hidden="true"
          >
            error
          </span>
          {error}
        </p>
      )}

      {/* Helper text — solo si no hay error */}
      {!error && helperText && (
        <p className="text-xs text-[#9ca3af] font-[600]">
          {helperText}
        </p>
      )}
    </div>
  )
}
