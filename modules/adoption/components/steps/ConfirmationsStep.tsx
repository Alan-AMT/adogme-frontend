// modules/adoption/components/steps/ConfirmationsStep.tsx
// Paso 5 — Confirmaciones requeridas
'use client'

import { useFormContext } from 'react-hook-form'

import type { AdoptionFormData } from '@/modules/shared/domain/AdoptionRequest'
import { Checkbox } from '@/modules/shared/components/ui'

const CONFIRMATIONS: {
  name: keyof Pick<
    AdoptionFormData,
    | 'aceptaAlimentacionVeterinaria'
    | 'aceptaNoAbandono'
    | 'aceptaContactarRefugio'
    | 'aceptaSeguimiento'
    | 'aceptaInfoVeridica'
  >
  label: string
}[] = [
  {
    name: 'aceptaAlimentacionVeterinaria',
    label: 'Me comprometo a brindar alimentación, agua y atención veterinaria adecuada',
  },
  {
    name: 'aceptaNoAbandono',
    label: 'Me comprometo a no abandonar al animal bajo ninguna circunstancia',
  },
  {
    name: 'aceptaContactarRefugio',
    label: 'En caso de no poder cuidarlo, contactaré primero al refugio',
  },
  {
    name: 'aceptaSeguimiento',
    label: 'Acepto que el refugio realice seguimiento del bienestar del animal',
  },
  {
    name: 'aceptaInfoVeridica',
    label: 'Confirmo que la información proporcionada es verídica',
  },
]

export default function ConfirmationsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdoptionFormData>()

  return (
    <div>
      {/* Banner */}
      <div className="af-info-banner">
        <span className="material-symbols-outlined af-info-banner__icon">gavel</span>
        <div>
          <p className="af-info-banner__title">Lee con atención</p>
          <p className="af-info-banner__text">
            Estas confirmaciones son legalmente vinculantes una vez enviada la solicitud.
          </p>
        </div>
      </div>

      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">check_box</span>
          Confirmaciones requeridas
        </p>

        <div className="flex flex-col gap-4">
          {CONFIRMATIONS.map(({ name, label }) => (
            <Checkbox
              key={name}
              label={label}
              error={errors[name]?.message}
              {...register(name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
