// modules/adoption/components/steps/ResponsibilityStep.tsx
// Paso 4 — Responsabilidad y compromiso
'use client'

import { Controller, useFormContext } from 'react-hook-form'

import type { AdoptionFormData } from '@/modules/shared/domain/AdoptionRequest'
import { Textarea, YesNoRadio } from '@/modules/shared/components/ui'

export default function ResponsibilityStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdoptionFormData>()

  return (
    <div>
      {/* Motivación */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">favorite</span>
          Tu motivación
        </p>
        <Textarea
          label="¿Por qué quieres adoptar a este perro?"
          required
          rows={5}
          maxLength={600}
          placeholder="Cuéntanos qué te llamó la atención de este perro y por qué crees que es la mascota ideal para ti y tu familia..."
          helperText="Sé honesto y específico — esto ayuda mucho al refugio a tomar una decisión"
          error={errors.motivacion?.message}
          {...register('motivacion')}
        />
      </div>

      {/* Situaciones futuras */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">help</span>
          Situaciones futuras
        </p>

        <div className="flex flex-col gap-4">
          <Textarea
            label="Si tuvieras que mudarte de casa, ciudad o país, ¿qué pasaría con el perro?"
            required
            rows={3}
            error={errors.siMudanza?.message}
            {...register('siMudanza')}
          />

          <Textarea
            label="Si el comportamiento del perro no fuera el que esperabas, ¿cómo actuarías?"
            required
            rows={3}
            error={errors.siComportamientoNoEsperado?.message}
            {...register('siComportamientoNoEsperado')}
          />

          <Textarea
            label="¿En qué situaciones considerarías devolver al perro?"
            required
            rows={3}
            error={errors.situacionesParaDevolver?.message}
            {...register('situacionesParaDevolver')}
          />
        </div>
      </div>

      {/* Capacidad de cuidado */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">medical_services</span>
          Capacidad de cuidado
        </p>

        <Controller
          control={control}
          name="capacidadEconomica"
          render={({ field, fieldState }) => (
            <YesNoRadio
              label="¿Tienes la capacidad económica para cubrir alimentación, vacunas, esterilización y atención veterinaria?"
              required
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="mt-4">
          <Textarea
            label="Describe qué cuidados médicos y preventivos planeas brindarle"
            required
            rows={3}
            placeholder="Ej. Vacunas anuales, desparasitación cada 3 meses, chequeos veterinarios..."
            error={errors.cuidadosMedicos?.message}
            {...register('cuidadosMedicos')}
          />
        </div>
      </div>
    </div>
  )
}
