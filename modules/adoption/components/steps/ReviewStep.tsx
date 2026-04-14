// modules/adoption/components/steps/ReviewStep.tsx
// Paso 5 — Resumen completo de todos los pasos + botón Enviar
'use client'

import Image from 'next/image'
import type { AdoptionFormData } from '@/modules/shared/domain/AdoptionRequest'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import type { Adoptante } from '@/modules/shared/domain/User'
import type { Dog } from '@/modules/shared/domain/Dog'

interface Props {
  data:         Partial<AdoptionFormData>
  dog:          Pick<Dog, 'id' | 'nombre' | 'foto' | 'raza' | 'refugioNombre'>
  isSubmitting: boolean
  errors:       Record<string, string>
  onSubmit:     () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HOUSING_LABEL: Record<string, string> = {
  casa:         'Casa',
  departamento: 'Departamento',
  casa_campo:   'Casa de campo / Rancho',
  otro:         'Otro',
}

const ACTIVITY_LABEL: Record<string, string> = {
  sedentario: 'Sedentario',
  moderado:   'Moderado',
  activo:     'Activo',
  muy_activo: 'Muy activo',
}

function yesNo(v: boolean | undefined): string {
  if (v === undefined) return '—'
  return v ? 'Sí' : 'No'
}

// ─── Section row ──────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="af-review-row">
      <span className="af-review-row__key">{label}</span>
      <span className="af-review-row__val">{value || '—'}</span>
    </div>
  )
}

// ─── Section block ────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon:     string
  title:    string
  children: React.ReactNode
}) {
  return (
    <div className="af-review-section">
      <div className="af-review-section__header">
        <span
          className="material-symbols-outlined af-review-section__icon"
          style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18" }}
        >
          {icon}
        </span>
        <span className="af-review-section__title">{title}</span>
      </div>
      <div className="af-review-section__body">{children}</div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewStep({ data, dog, isSubmitting, errors, onSubmit }: Props) {
  const user = useAuthStore(s => s.user) as Adoptante | null

  const { vivienda, horasEnCasa, actividadFisica, conviveConNinos, conviveConMascotas,
          descripcionMascotas, experienciaPrevia, descripcionExperiencia, motivacion,
          aceptaVisitaPrevia, aceptaTerminos, comentariosAdicionales } = data

  return (
    <div>
      {/* Dog recap */}
      <div className="flex items-center gap-3 p-4 bg-[#fff5f5] border border-[#ffd0d0] rounded-2xl mb-6">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#ffd0d0]">
          <Image src={dog.foto} alt={dog.nombre} fill className="object-cover" sizes="56px" />
        </div>
        <div>
          <p className="font-[900] text-[#18181b] text-base">{dog.nombre}</p>
          <p className="text-[13px] text-[#71717a] font-[600]">
            {dog.raza} · {dog.refugioNombre ?? 'Refugio'}
          </p>
        </div>
        <span
          className="material-symbols-outlined text-[#ff6b6b] ml-auto"
          style={{ fontSize: 24, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" }}
        >
          favorite
        </span>
      </div>

      {/* Sección 1: Datos personales */}
      <Section icon="person" title="Datos personales">
        <Row label="Nombre"    value={user?.name  ?? ''} />
        <Row label="Correo"    value={user?.email ?? ''} />
      </Section>

      {/* Sección 2: Vivienda */}
      <Section icon="home" title="Tu hogar">
        <Row label="Tipo de vivienda"  value={HOUSING_LABEL[vivienda?.tipo ?? ''] ?? '—'} />
        <Row label="Propietario"       value={yesNo(vivienda?.esPropietario)} />
        {vivienda?.esPropietario === false && (
          <Row label="Permite animales" value={yesNo(vivienda?.permiteAnimales)} />
        )}
        <Row label="Jardín / patio"    value={yesNo(vivienda?.tieneJardin)} />
        {vivienda?.tieneJardin && vivienda.tamanoJardinM2 && (
          <Row label="Tamaño jardín"   value={`${vivienda.tamanoJardinM2} m²`} />
        )}
        {vivienda?.tieneJardin && (
          <Row label="Barda / cerca"   value={yesNo(vivienda?.tieneRejaOCerca)} />
        )}
        {(vivienda?.fotosVivienda?.length ?? 0) > 0 && (
          <Row
            label="Fotos adjuntas"
            value={`${vivienda!.fotosVivienda!.length} imagen${vivienda!.fotosVivienda!.length !== 1 ? 'es' : ''}`}
          />
        )}
      </Section>

      {/* Sección 3: Rutina */}
      <Section icon="schedule" title="Tu estilo de vida">
        <Row label="Horas en casa / día" value={horasEnCasa ? `${horasEnCasa} hrs` : '—'} />
        <Row label="Actividad física"    value={ACTIVITY_LABEL[actividadFisica ?? ''] ?? '—'} />
        <Row label="Niños en el hogar"   value={yesNo(conviveConNinos)} />
        <Row label="Otras mascotas"      value={yesNo(conviveConMascotas)} />
        {conviveConMascotas && descripcionMascotas && (
          <Row label="Descripción mascotas" value={descripcionMascotas} />
        )}
      </Section>

      {/* Sección 4: Experiencia */}
      <Section icon="pets" title="Experiencia con mascotas">
        <Row label="Experiencia previa"  value={yesNo(experienciaPrevia)} />
        {experienciaPrevia && descripcionExperiencia && (
          <Row label="Descripción"       value={descripcionExperiencia} />
        )}
        <Row label="Motivación"          value={motivacion ?? '—'} />
      </Section>

      {/* Sección 5: Compromisos */}
      <Section icon="task_alt" title="Compromisos">
        <Row label="Acepta visita previa" value={yesNo(aceptaVisitaPrevia)} />
        <Row label="Acepta términos"      value={yesNo(aceptaTerminos)} />
        {comentariosAdicionales && (
          <Row label="Comentarios"        value={comentariosAdicionales} />
        )}
      </Section>

      {/* Error general */}
      {errors._form && (
        <div className="af-form-error">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18" }}
          >
            error
          </span>
          <p>{errors._form}</p>
        </div>
      )}

      {/* Aviso final */}
      <div className="flex items-start gap-3 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl mb-6">
        <span
          className="material-symbols-outlined text-[#16a34a] flex-shrink-0 mt-0.5"
          style={{ fontSize: 20, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20" }}
        >
          info
        </span>
        <p className="text-[13px] font-[600] text-[#15803d] leading-relaxed">
          Al enviar, el refugio recibirá tu solicitud y se pondrá en contacto contigo
          en un plazo de 1–3 días hábiles para coordinar los siguientes pasos.
        </p>
      </div>

      {/* Submit */}
      <div className="af-nav">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="af-nav__submit w-full justify-center"
          style={{ padding: '1rem 2rem', fontSize: '1rem' }}
        >
          {isSubmitting ? (
            <>
              <span
                className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              Enviando solicitud...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
              Enviar solicitud de adopción
            </>
          )}
        </button>
      </div>
    </div>
  )
}
