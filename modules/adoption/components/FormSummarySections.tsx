// modules/adoption/components/FormSummarySections.tsx
// Componente compartido — renderiza las 6 secciones del formulario de adopción
// como tarjetas de solo lectura. Usado por AdoptionDetailView (applicant) y
// ShelterRequestDetailView (shelter).
'use client'

import type { ReactNode } from 'react'
import type { AdoptionFormData } from '../../shared/domain/AdoptionRequest'
import {
  HOUSING_TYPE_LABELS,
  TENANCIA_LABELS,
  LUGAR_DORMIR_LABELS,
  ACTIVIDAD_FISICA_LABELS,
  ACTIVIDAD_CON_PERRO_LABELS,
} from '../domain/labels'
import '../styles/adoptionForm.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isEmpty(value: ReactNode): boolean {
  return value === undefined || value === null || value === ''
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  if (isEmpty(value)) return null
  return (
    <div className="ad-data-row">
      <span className="ad-data-row__key">{label}</span>
      <span className="ad-data-row__val">{value}</span>
    </div>
  )
}

function YesNoBadge({ value }: { value: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.15rem 0.6rem',
        borderRadius: 999,
        background: value ? '#dcfce7' : '#fee2e2',
        color: value ? '#166534' : '#991b1b',
        fontSize: '0.74rem',
        fontWeight: 800,
        letterSpacing: '0.02em',
      }}
    >
      {value ? 'Sí' : 'No'}
    </span>
  )
}

function SectionTitle({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <h2 className="ad-card__title">
      <span className="material-symbols-outlined">{icon}</span>
      {children}
    </h2>
  )
}

function ActivityChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.7rem',
        borderRadius: 999,
        background: '#fff5f5',
        color: '#ff6b6b',
        fontSize: '0.74rem',
        fontWeight: 700,
        border: '1px solid #fecdd3',
      }}
    >
      {label}
    </span>
  )
}

function ConfirmationRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className="ad-data-row"
      style={{ alignItems: 'center', gap: '0.65rem' }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 20,
          color: value ? '#16a34a' : '#ef4444',
          flexShrink: 0,
          fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20",
        }}
      >
        {value ? 'check_circle' : 'cancel'}
      </span>
      <span className="ad-data-row__val" style={{ fontWeight: 600, color: '#3f3f46' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  formulario: AdoptionFormData
  className?: string
  /** Fotos de la vivienda. En el detalle, pasar `application.images`. */
  housingPhotos?: string[]
}

export default function FormSummarySections({ formulario, className, housingPhotos }: Props) {
  const f = formulario
  const fotos = housingPhotos ?? []

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* ── 1. Información personal ── */}
      <section className="ad-card">
        <SectionTitle icon="person">Información personal</SectionTitle>
        <Field label="Nombre completo" value={f.nombreCompleto} />
        <Field label="Edad" value={`${f.edad} años`} />
        <Field label="Teléfono" value={f.telefono} />
        <Field label="Correo" value={f.correo} />
        <Field label="Ocupación" value={f.ocupacion} />
        <Field label="Dirección" value={f.direccion} />
        {f.redesSociales && <Field label="Redes sociales" value={f.redesSociales} />}
      </section>

      {/* ── 2. Vivienda y entorno ── */}
      <section className="ad-card">
        <SectionTitle icon="home">Vivienda y entorno</SectionTitle>
        <Field label="Tipo" value={HOUSING_TYPE_LABELS[f.vivienda.tipo]} />
        <Field label="Tenencia" value={TENANCIA_LABELS[f.vivienda.tenencia]} />
        {f.vivienda.tenencia === 'rentada' && f.vivienda.permiteAnimales !== undefined && (
          <Field label="Permite animales" value={<YesNoBadge value={f.vivienda.permiteAnimales} />} />
        )}
        <Field label="Tiene jardín" value={<YesNoBadge value={f.vivienda.tieneJardin} />} />
        {f.vivienda.tieneJardin && f.vivienda.tamanoJardinM2 !== undefined && (
          <Field label="Tamaño jardín" value={`${f.vivienda.tamanoJardinM2} m²`} />
        )}
        {f.vivienda.tieneJardin && f.vivienda.tieneRejaOCerca !== undefined && (
          <Field label="Reja o cerca" value={<YesNoBadge value={f.vivienda.tieneRejaOCerca} />} />
        )}
        <Field label="Quiénes viven" value={f.entorno.quienesViven} />
        <Field label="Todos de acuerdo" value={<YesNoBadge value={f.entorno.todosDeAcuerdo} />} />
        <Field label="Hay niños" value={<YesNoBadge value={f.entorno.hayNinos} />} />
        <Field label="Hay alérgicos" value={<YesNoBadge value={f.entorno.hayAlergicos} />} />

        {fotos.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: '#a1a1aa',
                marginBottom: '0.6rem',
              }}
            >
              Fotos de vivienda
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {fotos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Foto de vivienda ${i + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: '0.75rem',
                    border: '1.5px solid #e4e4e7',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 3. Rutina y estilo de vida ── */}
      <section className="ad-card">
        <SectionTitle icon="schedule">Rutina y estilo de vida</SectionTitle>
        <Field label="Horas solo" value={`${f.rutina.horasSolo} h al día`} />
        <Field label="Dónde permanece solo" value={f.rutina.dondePermaneceSolo} />
        <Field label="Dónde dormiría" value={LUGAR_DORMIR_LABELS[f.rutina.dondeDormiria]} />
        <Field label="Actividad física" value={ACTIVIDAD_FISICA_LABELS[f.rutina.actividadFisica]} />

        <div className="ad-data-row" style={{ alignItems: 'flex-start' }}>
          <span className="ad-data-row__key">Actividades planeadas</span>
          <span className="ad-data-row__val">
            {f.rutina.actividadesPlaneadas.length > 0 ? (
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {f.rutina.actividadesPlaneadas.map(a => (
                  <ActivityChip key={a} label={ACTIVIDAD_CON_PERRO_LABELS[a]} />
                ))}
              </span>
            ) : (
              <span style={{ color: '#9ca3af', fontWeight: 500 }}>Ninguna especificada</span>
            )}
          </span>
        </div>
      </section>

      {/* ── 4. Mascotas y experiencia ── */}
      <section className="ad-card">
        <SectionTitle icon="pets">Mascotas y experiencia</SectionTitle>
        <Field label="Tiene mascotas" value={<YesNoBadge value={f.mascotasActuales.tiene} />} />
        {f.mascotasActuales.tiene && (
          <>
            {f.mascotasActuales.cuantasYCuales && (
              <Field label="Cuántas y cuáles" value={f.mascotasActuales.cuantasYCuales} />
            )}
            {f.mascotasActuales.edades && (
              <Field label="Edades" value={f.mascotasActuales.edades} />
            )}
            {f.mascotasActuales.estanEsterilizadas !== undefined && (
              <Field
                label="Esterilizadas"
                value={<YesNoBadge value={f.mascotasActuales.estanEsterilizadas} />}
              />
            )}
            {f.mascotasActuales.descripcionConvivencia && (
              <Field label="Convivencia" value={f.mascotasActuales.descripcionConvivencia} />
            )}
          </>
        )}
        <Field label="Experiencia previa" value={<YesNoBadge value={f.experienciaPrevia.tuvo} />} />
        {f.experienciaPrevia.tuvo && f.experienciaPrevia.quePaso && (
          <Field label="Qué pasó" value={f.experienciaPrevia.quePaso} />
        )}
      </section>

      {/* ── 5. Responsabilidad ── */}
      <section className="ad-card">
        <SectionTitle icon="volunteer_activism">Responsabilidad</SectionTitle>
        <Field label="Motivación" value={f.motivacion} />
        <Field label="Si te mudas" value={f.siMudanza} />
        <Field
          label="Comportamiento no esperado"
          value={f.siComportamientoNoEsperado}
        />
        <Field
          label="Razones para devolver"
          value={f.situacionesParaDevolver}
        />
        <Field
          label="Capacidad económica"
          value={<YesNoBadge value={f.capacidadEconomica} />}
        />
        <Field label="Cuidados médicos" value={f.cuidadosMedicos} />
      </section>

      {/* ── 6. Confirmaciones ── */}
      <section className="ad-card">
        <SectionTitle icon="check_circle">Confirmaciones</SectionTitle>
        <ConfirmationRow
          label="Acepta brindar alimentación adecuada y atención veterinaria"
          value={f.aceptaAlimentacionVeterinaria}
        />
        <ConfirmationRow
          label="Acepta no abandonar al animal bajo ninguna circunstancia"
          value={f.aceptaNoAbandono}
        />
        <ConfirmationRow
          label="Acepta contactar al refugio ante dudas o dificultades"
          value={f.aceptaContactarRefugio}
        />
        <ConfirmationRow
          label="Acepta seguimiento posterior por parte del refugio"
          value={f.aceptaSeguimiento}
        />
        <ConfirmationRow
          label="Confirma que la información proporcionada es verídica"
          value={f.aceptaInfoVeridica}
        />
      </section>
    </div>
  )
}
