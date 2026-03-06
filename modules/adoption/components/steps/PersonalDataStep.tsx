// modules/adoption/components/steps/PersonalDataStep.tsx
// Paso 0 — Datos personales del solicitante (solo lectura del perfil)
'use client'

import { useAuthStore } from '../../../../shared/infrastructure/store/authStore'
import type { Adoptante } from '../../../../shared/domain/User'

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
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-6">
        <span
          className="material-symbols-outlined text-blue-500 flex-shrink-0 mt-0.5"
          style={{ fontSize: 20, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20" }}
        >
          info
        </span>
        <div>
          <p className="text-sm font-[700] text-blue-800">Datos de tu perfil</p>
          <p className="text-[13px] font-[500] text-blue-600 mt-0.5 leading-relaxed">
            Estos datos se obtienen de tu cuenta registrada. Si necesitas
            actualizarlos, ve a{' '}
            <a href="/mi-perfil" className="underline font-[700]">
              Mi perfil
            </a>
            .
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
          <ReadonlyField label="Nombre completo" value={user?.nombre ?? ''} icon="badge" />
          <ReadonlyField label="Correo electrónico" value={user?.correo ?? ''} icon="mail" />
          <ReadonlyField label="Teléfono" value={user?.telefono ?? ''} icon="phone" />
          <ReadonlyField
            label="Dirección"
            value={user?.role === 'applicant' ? (user as Adoptante).direccion : ''}
            icon="home"
          />
        </div>
      </div>

      {/* Confirmación */}
      <div className="flex items-center gap-2.5 p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl">
        <span
          className="material-symbols-outlined text-[#16a34a] flex-shrink-0"
          style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18" }}
        >
          check_circle
        </span>
        <p className="text-[13px] font-[700] text-[#15803d]">
          Datos verificados — puedes continuar al siguiente paso
        </p>
      </div>
    </div>
  )
}
