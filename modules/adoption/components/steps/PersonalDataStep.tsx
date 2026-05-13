// modules/adoption/components/steps/PersonalDataStep.tsx
// Paso 0 — Datos personales del solicitante
'use client'

import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import type { AdoptionFormData } from '@/modules/shared/domain/AdoptionRequest'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { Input, Textarea } from '@/modules/shared/components/ui'

export default function PersonalDataStep() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<AdoptionFormData>()

  const user = useAuthStore(s => s.user)

  // Prefill nombre/correo desde la sesión solo si los campos están vacíos.
  useEffect(() => {
    if (!user) return
    if (!getValues('nombreCompleto') && user.name) {
      setValue('nombreCompleto', user.name, { shouldDirty: false })
    }
    if (!getValues('correo') && user.email) {
      setValue('correo', user.email, { shouldDirty: false })
    }
  }, [user, setValue, getValues])

  return (
    <div>
      {/* Banner informativo */}
      <div className="af-info-banner">
        <span className="material-symbols-outlined af-info-banner__icon">info</span>
        <div>
          <p className="af-info-banner__title">Cuéntanos quién eres</p>
          <p className="af-info-banner__text">
            Estos datos son únicamente para que el refugio pueda contactarte
            durante el proceso de adopción.
          </p>
        </div>
      </div>

      {/* Información personal */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">person</span>
          Información personal
        </p>

        <div className="af-field-grid">
          <Input
            label="Nombre completo"
            required
            placeholder="Ej. Ana López Pérez"
            error={errors.nombreCompleto?.message}
            {...register('nombreCompleto')}
          />
        </div>

        <div className="af-field-grid af-field-grid--2 mt-4">
          <Input
            label="Edad"
            type="number"
            min={18}
            required
            placeholder="Ej. 28"
            error={errors.edad?.message}
            {...register('edad', { valueAsNumber: true })}
          />
          <Input
            label="Teléfono"
            type="tel"
            required
            placeholder="Ej. 55 1234 5678"
            error={errors.telefono?.message}
            {...register('telefono')}
          />
        </div>

        <div className="af-field-grid af-field-grid--2 mt-4">
          <Input
            label="Correo electrónico"
            type="email"
            required
            placeholder="tu@correo.com"
            error={errors.correo?.message}
            {...register('correo')}
          />
          <Input
            label="Ocupación"
            required
            placeholder="Ej. Diseñadora gráfica"
            error={errors.ocupacion?.message}
            {...register('ocupacion')}
          />
        </div>

        <div className="af-field-grid mt-4">
          <Textarea
            label="Dirección"
            required
            rows={2}
            placeholder="Calle, número, colonia, ciudad"
            error={errors.direccion?.message}
            {...register('direccion')}
          />
        </div>

        <div className="af-field-grid mt-4">
          <Input
            label="Redes sociales (opcional)"
            placeholder="@usuario o link de tu perfil"
            error={errors.redesSociales?.message}
            helperText="Si quieres compartir un perfil público, ayuda al refugio a conocerte"
            {...register('redesSociales')}
          />
        </div>
      </div>
    </div>
  )
}
