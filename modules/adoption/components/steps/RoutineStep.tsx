// modules/adoption/components/steps/RoutineStep.tsx
// Paso 2 — Rutina diaria y estilo de vida
'use client'

import type { AdoptionFormData } from '../../../../shared/domain/AdoptionRequest'
import { Textarea } from '../../../../shared/components/ui/Textarea'

interface Props {
  data:        Partial<AdoptionFormData>
  errors:      Record<string, string>
  updateField: <K extends keyof AdoptionFormData>(key: K, value: AdoptionFormData[K]) => void
}

const ACTIVITY_OPTIONS = [
  { value: 'sedentario', label: 'Sedentario', icon: 'weekend',      desc: 'Poca actividad, descanso' },
  { value: 'moderado',   label: 'Moderado',   icon: 'directions_walk', desc: 'Caminatas ocasionales' },
  { value: 'activo',     label: 'Activo',     icon: 'directions_run',  desc: 'Ejercicio regular' },
  { value: 'muy_activo', label: 'Muy activo', icon: 'fitness_center',  desc: 'Deporte frecuente' },
] as const

type ActivityValue = typeof ACTIVITY_OPTIONS[number]['value']

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

export default function RoutineStep({ data, errors, updateField }: Props) {
  const horas = data.horasEnCasa ?? 8

  return (
    <div>
      {/* Horas en casa */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">schedule</span>
          Tiempo en casa
        </p>

        <div className="af-hours-display">
          <span className="af-hours-value">{horas}</span>
          <div>
            <p className="af-hours-label">
              {horas === 1 ? 'hora' : 'horas'} al día en casa
            </p>
            <p className="text-[12px] text-[#9ca3af] font-[500]">
              En promedio, incluyendo trabajo desde casa y fines de semana
            </p>
          </div>
        </div>

        <input
          type="range"
          className="af-range"
          min={1}
          max={24}
          step={1}
          value={horas}
          onChange={e => updateField('horasEnCasa', Number(e.target.value))}
        />
        <div className="flex justify-between text-[11px] text-[#a1a1aa] font-[600] mt-1">
          <span>1 hora</span>
          <span>12 horas</span>
          <span>24 horas</span>
        </div>

        {errors.horasEnCasa && (
          <p className="af-yn__error mt-2">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
            {errors.horasEnCasa}
          </p>
        )}
      </div>

      {/* Actividad física */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">directions_run</span>
          Nivel de actividad física *
        </p>
        <div className="af-activity-grid">
          {ACTIVITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField('actividadFisica', opt.value as ActivityValue)}
              className={`af-activity-btn ${data.actividadFisica === opt.value ? 'af-activity-btn--active' : ''}`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" }}
              >
                {opt.icon}
              </span>
              <span>{opt.label}</span>
              <span className="text-[10px] font-[500] opacity-70">{opt.desc}</span>
            </button>
          ))}
        </div>
        {errors.actividadFisica && (
          <p className="af-yn__error mt-2">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
            {errors.actividadFisica}
          </p>
        )}
      </div>

      {/* Convivencia */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">groups</span>
          Convivencia en el hogar
        </p>
        <div className="af-field-grid">
          <YesNo
            label="¿Hay niños en tu hogar?"
            required
            value={data.conviveConNinos}
            onChange={v => updateField('conviveConNinos', v)}
            error={errors.conviveConNinos}
          />

          <YesNo
            label="¿Convives con otras mascotas?"
            required
            value={data.conviveConMascotas}
            onChange={v => updateField('conviveConMascotas', v)}
            error={errors.conviveConMascotas}
          />
        </div>

        {data.conviveConMascotas && (
          <div className="mt-4">
            <Textarea
              label="Describe las mascotas con las que convives"
              placeholder="Ej. Tengo una gata de 3 años, muy tranquila y ya convive con perros..."
              rows={3}
              value={data.descripcionMascotas ?? ''}
              onChange={e => updateField('descripcionMascotas', e.target.value)}
              helperText="Indica especie, edad y carácter"
            />
          </div>
        )}
      </div>
    </div>
  )
}
