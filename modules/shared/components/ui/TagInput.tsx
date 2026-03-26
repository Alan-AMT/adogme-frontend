// modules/shared/components/ui/TagInput.tsx
// Enter / coma agrega tag. X elimina. Sugerencias como dropdown.
'use client'

import { useState } from 'react'

interface TagInputProps {
  value:        string[]
  onChange:     (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?:     number
  label?:       string
  helperText?:  string
  error?:       string
}

export function TagInput({
  value, onChange, suggestions = [],
  placeholder = 'Escribe y presiona Enter',
  maxTags, label, helperText, error,
}: TagInputProps) {
  const [input,     setInput]     = useState('')
  const [showSugg,  setShowSugg]  = useState(false)

  const canAdd = !maxTags || value.length < maxTags

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase()
    if (!tag || value.includes(tag) || !canAdd) return
    onChange([...value, tag])
    setInput('')
    setShowSugg(false)
  }

  const remove = (tag: string) => onChange(value.filter(t => t !== tag))

  const filtered = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      {label && (
        <p className="text-[13px] font-[900] text-[#1f2937]">{label}</p>
      )}

      {/* Tags existentes — estilo .cat-chip--active */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded-full
                         border-[1.5px] border-[#ff6b6b] bg-[#ff6b6b] text-white text-xs font-[700]"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
                aria-label={`Eliminar ${tag}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 11 }}>close</span>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + dropdown — cuando aún se pueden añadir */}
      {canAdd && (
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setShowSugg(true) }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                add(input)
              }
              if (e.key === 'Backspace' && !input && value.length > 0) {
                remove(value[value.length - 1])
              }
            }}
            onFocus={() => setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder={canAdd ? placeholder : `Máximo ${maxTags} etiquetas`}
            className={[
              'w-full rounded-[14px] border text-[#111827] text-sm px-3.5 py-2.5 outline-none',
              'bg-[#f9fafb] transition-all duration-200',
              error
                ? 'border-[#fca5a5] focus:border-[#ef4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
                : 'border-[#e5e7eb] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.2)] focus:bg-white',
            ].join(' ')}
          />

          {/* Dropdown de sugerencias — .cat-suggestions */}
          {showSugg && filtered.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#e4e4e7] rounded-[1rem] shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden p-1.5">
              {filtered.slice(0, 8).map(s => (
                <li key={s}>
                  <button
                    type="button"
                    onMouseDown={() => add(s)}
                    className="w-full text-left px-3.5 py-2 rounded-[0.65rem] text-sm font-[700] text-[#18181b]
                               hover:bg-[#fff5f5] hover:text-[#ff6b6b] transition-colors"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Error / helper */}
      {error && (
        <p className="text-xs font-[800] text-[#b91c1c] flex items-center gap-1">
          <span className="material-symbols-outlined"
            style={{ fontSize: 13, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 13" }}>
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
