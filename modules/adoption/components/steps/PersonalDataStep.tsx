// modules/adoption/components/steps/PersonalDataStep.tsx
// Paso 0 — Datos personales del solicitante (solo lectura del perfil)
'use client'

import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import type { Adoptante } from '@/modules/shared/domain/User'

interface Props {
  errors: Record<string, string>
}

function ReadonlyField({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: string
}) {
  return (
    <div className="af-readonly-field">
      <span className="af-readonly-field__label">{label}</span>
      <div className="af-readonly-field__value">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 17, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 17" }}
        >
          {icon}
        </span>
        {value || <span className="text-[#a1a1aa]">Sin información</span>}
      </div>
    </div>
  )
}

export default function PersonalDataStep({ errors: _ }: Props) {
  const user = useAuthStore(s => s.user) as Adoptante | null

  return (
    <div>
      {/* Info banner */}
      <div className="af-info-banner">
        <span className="material-symbols-outlined af-info-banner__icon">info</span>
        <div>
          <p className="af-info-banner__title">Datos de tu perfil</p>
          <p className="af-info-banner__text">
            Estos datos se obtienen de tu cuenta registrada. Si necesitas
            actualizarlos, ve a{' '}
            <a href="/mi-perfil">Mi perfil</a>.
          </p>
        </div>
      </div>

      {/* Datos */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">person</span>
          Información personal
        </p>
        <div className="af-field-grid af-field-grid--2">
          <ReadonlyField label="Nombre completo" value={user?.name ?? ''} icon="badge" />
          <ReadonlyField label="Correo electrónico" value={user?.email ?? ''} icon="mail" />
        </div>
      </div>

      {/* Confirmación */}
      <div className="af-verified">
        <div className="af-verified__check">
          <span className="material-symbols-outlined">check</span>
        </div>
        <p className="af-verified__text">Datos verificados — puedes continuar al siguiente paso</p>
      </div>
    </div>
  )
}
