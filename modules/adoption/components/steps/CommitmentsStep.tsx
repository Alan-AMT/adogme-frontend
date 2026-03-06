// modules/adoption/components/steps/CommitmentsStep.tsx
// Paso 4 — Lista de compromisos + checkboxes de aceptación
'use client'

import type { AdoptionFormData } from '../../../../shared/domain/AdoptionRequest'
import { Checkbox } from '../../../../shared/components/ui/Checkbox'
import { Textarea } from '../../../../shared/components/ui/Textarea'

interface Props {
  data:        Partial<AdoptionFormData>
  errors:      Record<string, string>
  updateField: <K extends keyof AdoptionFormData>(key: K, value: AdoptionFormData[K]) => void
}

const COMMITMENTS = [
  {
    icon: 'restaurant',
    text: 'Me comprometo a proporcionar alimentación adecuada y agua fresca todos los días.',
  },
  {
    icon: 'vaccines',
    text: 'Me comprometo a brindar atención veterinaria preventiva (vacunas, desparasitaciones) y de urgencia cuando sea necesario.',
  },
  {
    icon: 'favorite',
    text: 'Me comprometo a tratar al animal con amor, respeto y nunca bajo circunstancias de abuso o maltrato.',
  },
  {
    icon: 'block',
    text: 'Me comprometo a NO abandonar al animal bajo ninguna circunstancia. En caso de ya no poder cuidarlo, lo regresaré al refugio.',
  },
  {
    icon: 'home',
    text: 'Me comprometo a mantener al perro en un espacio seguro, limpio y con temperatura adecuada.',
  },
  {
    icon: 'visibility',
    text: 'Acepto que el refugio pueda realizar visitas de seguimiento (en persona o por videollamada) para verificar el bienestar del animal.',
  },
]

export default function CommitmentsStep({ data, errors, updateField }: Props) {
  return (
    <div>
      {/* Lista de compromisos */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">task_alt</span>
          Compromisos de adopción
        </p>
        <p className="text-[13px] text-[#71717a] font-[500] mb-4 leading-relaxed">
          Al adoptar, adquieres las siguientes responsabilidades. Por favor léelas con atención.
        </p>

        <div className="af-commitment-list">
          {COMMITMENTS.map((item, i) => (
            <div key={i} className="af-commitment-item">
              <div className="af-commitment-item__icon">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 16" }}
                >
                  {item.icon}
                </span>
              </div>
              <p className="af-commitment-item__text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aceptaciones */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">check_box</span>
          Confirmaciones requeridas
        </p>

        <div className="flex flex-col gap-4">
          <Checkbox
            label="Acepto que el refugio realice una visita previa a mi hogar antes de completar la adopción"
            description="La visita puede ser presencial o por videollamada, según acuerdo con el refugio."
            checked={data.aceptaVisitaPrevia ?? false}
            onChange={e => updateField('aceptaVisitaPrevia', e.target.checked)}
            error={errors.aceptaVisitaPrevia}
          />

          <Checkbox
            label="Acepto los términos, condiciones y todos los compromisos de adopción listados arriba"
            description="Confirmo que he leído y entendido todos los puntos anteriores y me comprometo a cumplirlos."
            checked={data.aceptaTerminos ?? false}
            onChange={e => updateField('aceptaTerminos', e.target.checked)}
            error={errors.aceptaTerminos}
          />
        </div>
      </div>

      {/* Comentarios opcionales */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">chat_bubble</span>
          Comentarios adicionales
          <span className="text-[#9ca3af] font-[500] text-[12px] ml-1">(opcional)</span>
        </p>
        <Textarea
          placeholder="¿Hay algo más que quieras comunicar al refugio? Cualquier información adicional que consideres relevante..."
          rows={4}
          maxLength={400}
          value={data.comentariosAdicionales ?? ''}
          onChange={e => updateField('comentariosAdicionales', e.target.value)}
          helperText="Ej. situaciones especiales, preguntas, disponibilidad para la visita, etc."
        />
      </div>
    </div>
  )
}
