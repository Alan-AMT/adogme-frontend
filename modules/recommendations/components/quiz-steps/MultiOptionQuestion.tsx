// modules/recommendations/components/quiz-steps/MultiOptionQuestion.tsx
// Pregunta multi-select — renderiza checkboxes como cards.
'use client'

interface MultiOption {
  id:     string
  label:  string
  weight: number
}

interface MultiOptionQuestionProps {
  text:     string
  hint?:    string
  options:  MultiOption[]
  value:    string[]
  onChange: (next: string[]) => void
}

export function MultiOptionQuestion({
  text,
  hint,
  options,
  value,
  onChange,
}: MultiOptionQuestionProps) {

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <div className="qz-option-question">
      <p className="qz-option-question__text">{text}</p>
      {hint && <p className="qz-option-question__hint">{hint}</p>}

      <div className="qz-option-question__options">
        {options.map(opt => {
          const selected = value.includes(opt.id)
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={selected}
              className={`qz-option qz-option--multi${selected ? ' qz-option--selected' : ''}`}
              onClick={() => toggle(opt.id)}
            >
              <span className="qz-option__check" aria-hidden="true">
                {selected && (
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    check
                  </span>
                )}
              </span>
              <span className="qz-option__label">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
