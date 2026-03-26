// modules/adoption/components/steps/ExperienceStep.tsx
// Paso 3 — Experiencia previa con mascotas y motivación
'use client'

import type { AdoptionFormData } from '@/modules/shared/domain/AdoptionRequest'
import { Textarea } from '@/modules/shared/components/ui/Textarea'

interface Props {
  data:        Partial<AdoptionFormData>
  errors:      Record<string, string>
  updateField: <K extends keyof AdoptionFormData>(key: K, value: AdoptionFormData[K]) => void
}

function YesNo({
  label,
  required,
  value,
  onChange,
  error,
}: {
  label:     string
  required?: boolean
  value:     boolean | undefined
  onChange:  (v: boolean) => void
  error?:    string
}) {
  return (
    <div className="af-yn">
      <span className="af-yn__label">
        {label}
        {required && <span> *</span>}
      </span>
      <div className="af-yn__buttons">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`af-yn__btn ${value === true ? 'af-yn__btn--active-yes' : ''}`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}
          >
            check_circle
          </span>
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`af-yn__btn ${value === false ? 'af-yn__btn--active-no' : ''}`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}
          >
            cancel
          </span>
          No
        </button>
      </div>
      {error && (
        <p className="af-yn__error">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
          {error}
        </p>
      )}
    </div>
  )
}

export default function ExperienceStep({ data, errors, updateField }: Props) {
  return (
    <div>
      {/* Experiencia previa */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">pets</span>
          Experiencia con mascotas
        </p>

        <div className="af-field-grid">
          <YesNo
            label="¿Has tenido perros u otras mascotas anteriormente?"
            required
            value={data.experienciaPrevia}
            onChange={v => updateField('experienciaPrevia', v)}
            error={errors.experienciaPrevia}
          />
        </div>

        {data.experienciaPrevia && (
          <div className="mt-4">
            <Textarea
              label="Cuéntanos sobre esa experiencia"
              placeholder="Ej. Tuve un labrador durante 10 años. Era muy tranquilo. Lamentablemente falleció hace 2 años..."
              rows={4}
              maxLength={500}
              value={data.descripcionExperiencia ?? ''}
              onChange={e => updateField('descripcionExperiencia', e.target.value)}
              helperText="¿Qué mascotas tuviste? ¿Cuánto tiempo? ¿Qué les sucedió?"
            />
          </div>
        )}

        {data.experienciaPrevia === false && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <span
              className="material-symbols-outlined text-amber-500 flex-shrink-0 mt-0.5"
              style={{ fontSize: 20, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20" }}
            >
              lightbulb
            </span>
            <div>
              <p className="text-sm font-[700] text-amber-800">¡No hay problema!</p>
              <p className="text-[13px] font-[500] text-amber-700 mt-0.5 leading-relaxed">
                No tener experiencia previa no es una limitante. El refugio te
                brindará orientación y seguimiento durante todo el proceso de adopción.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Motivación */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">favorite</span>
          Tu motivación
        </p>
        <Textarea
          label="¿Por qué quieres adoptar a este perro?"
          required
          placeholder="Cuéntanos qué te llamó la atención de este perro y por qué crees que es la mascota ideal para ti y tu familia..."
          rows={5}
          maxLength={600}
          value={data.motivacion ?? ''}
          onChange={e => updateField('motivacion', e.target.value)}
          error={errors.motivacion}
          helperText="Sé honesto y específico — esto ayuda mucho al refugio a tomar una decisión"
        />
      </div>
    </div>
  )
}
