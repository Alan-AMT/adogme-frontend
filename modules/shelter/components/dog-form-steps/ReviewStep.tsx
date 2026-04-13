// modules/shelter/components/dog-form-steps/ReviewStep.tsx
// Archivo 182 — Paso 5: Revisión y publicación.
// Preview pública del perro + botones Guardar borrador / Publicar.
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { DogFormData } from '../../application/hooks/useDogForm'
import '../../styles/shelterViews.css'

interface Props {
  formData:     DogFormData
  isSubmitting: boolean
  submitError:  string | null
  isDraft:      boolean
  submit:       () => Promise<void>
  saveDraft:    () => void
}

const SIZE_LABELS: Record<string, string> = {
  pequeño: 'Pequeño', mediano: 'Mediano', grande: 'Grande', gigante: 'Gigante',
}
const ENERGY_LABELS: Record<string, string> = {
  baja: 'Baja', moderada: 'Moderada', alta: 'Alta', muy_alta: 'Muy alta',
}
const ENERGY_ICONS: Record<string, string> = {
  baja: 'self_care', moderada: 'directions_walk', alta: 'directions_run', muy_alta: 'bolt',
}

function formatAge(m: number): string {
  if (m < 12) return `${m} mes${m !== 1 ? 'es' : ''}`
  const y = Math.floor(m / 12)
  return `${y} año${y !== 1 ? 's' : ''}`
}

export function ReviewStep({ formData, isSubmitting, submitError, isDraft, submit, saveDraft }: Props) {
  const router = useRouter()

  async function handlePublish() {
    try {
      await submit()
      router.push('/refugio/perros')
    } catch {
      // submitError is set internally by the hook
    }
  }

  function handleDraft() {
    saveDraft()
    router.push('/refugio/perros')
  }

  const hasPhoto = Boolean(formData.foto)

  return (
    <>
      {/* ── Banner de revisión ── */}
      <div style={{
        background:   'linear-gradient(135deg, rgba(255,107,107,0.08) 0%, rgba(255,107,107,0.04) 100%)',
        border:       '1.5px solid rgba(255,107,107,0.2)',
        borderRadius: '1.2rem',
        padding:      '1.25rem',
        display:      'flex',
        alignItems:   'center',
        gap:          '0.85rem',
        marginBottom: '0.25rem',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#ff6b6b', fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>preview</span>
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 900, color: '#18181b', marginBottom: '0.15rem' }}>Vista previa del perfil</p>
          <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500 }}>Así verán los adoptantes el perfil de {formData.nombre || 'este perro'}</p>
        </div>
        {isDraft && (
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 900, color: '#854d0e', background: '#fef9c3', padding: '0.25rem 0.7rem', borderRadius: 999, flexShrink: 0 }}>
            Borrador guardado
          </span>
        )}
      </div>

      {/* ── Preview card ── */}
      <div className="sv-form-section">
        {/* Foto principal */}
        <div style={{ position: 'relative', height: 240, background: '#f4f4f5', borderRadius: '1.2rem 1.2rem 0 0', overflow: 'hidden' }}>
          {hasPhoto ? (
            <Image src={formData.foto} alt={formData.nombre} fill style={{ objectFit: 'cover' }} sizes="720px" />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#d4d4d8' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, fontVariationSettings: "'FILL' 0,'wght' 200" }}>pets</span>
              <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Sin foto principal</p>
            </div>
          )}
          {/* Gallery count badge */}
          {formData.fotos.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 999, padding: '0.25rem 0.7rem', fontSize: '0.75rem', fontWeight: 800 }}>
              +{formData.fotos.length - 1} fotos
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Header info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#18181b', marginBottom: '0.25rem' }}>
                {formData.nombre || <span style={{ color: '#a1a1aa' }}>Sin nombre</span>}
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#52525b', fontWeight: 500 }}>
                {formData.raza || 'Raza no especificada'} · {formData.edad > 0 ? formatAge(formData.edad) : '—'} · {formData.sexo === 'macho' ? 'Macho' : formData.sexo === 'hembra' ? 'Hembra' : '—'}
              </p>
            </div>
            {formData.tamano && (
              <span style={{ background: '#f4f4f5', color: '#52525b', borderRadius: 999, padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                {SIZE_LABELS[formData.tamano] ?? formData.tamano}
              </span>
            )}
          </div>

          {/* Energía */}
          {formData.nivelEnergia && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ff6b6b' }}>{ENERGY_ICONS[formData.nivelEnergia]}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Energía {ENERGY_LABELS[formData.nivelEnergia] ?? formData.nivelEnergia}</span>
            </div>
          )}

          {/* Descripción */}
          {formData.descripcion && (
            <p style={{ fontSize: '0.88rem', color: '#374151', fontWeight: 500, lineHeight: 1.6, marginBottom: '1rem' }}>
              {formData.descripcion}
            </p>
          )}

          {/* Personalidad tags */}
          {formData.personalidad.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {formData.personalidad.map(tag => (
                <span key={tag.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.75rem', borderRadius: 999, background: '#f4f4f5', color: '#52525b', fontSize: '0.78rem', fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>{tag.icon}</span>
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {/* Compatibilidad */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {formData.aptoNinos  && <Chip icon="child_care"   label="Apto con niños"  />}
            {formData.aptoPerros && <Chip icon="pets"         label="Apto con perros" />}
            {formData.aptoGatos  && <Chip icon="cruelty_free" label="Apto con gatos"  />}
          </div>

          {/* Datos de salud y cuidados */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {formData.vacunado      && <InfoChip icon="vaccines"         label="Vacunado"       />}
            {formData.desparasitado && <InfoChip icon="medication"       label="Desparasitado"  />}
            {formData.castrado      && <InfoChip icon="medical_services" label="Esterilizado"   />}
            {formData.microchip     && <InfoChip icon="memory"           label="Microchip"      />}
            {formData.necesitaJardin && <InfoChip icon="yard"            label="Necesita jardín" />}
            {formData.pesoKg        && <InfoChip icon="monitor_weight"   label={`${formData.pesoKg} kg`} />}
            {formData.vacunas.length > 0 && <InfoChip icon="vaccines" label={`${formData.vacunas.length} vacuna${formData.vacunas.length !== 1 ? 's' : ''}`} />}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.5, padding: '0.75rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #f0f0f0' }}>
            <strong style={{ color: '#374151' }}>Estado de salud: </strong>
            {{ 1: 'Sano', 2: 'Lesión leve', 3: 'Lesión grave' }[formData.nivelSalud]}
            {' · '}
            <strong style={{ color: '#374151' }}>Pelaje: </strong>
            {{ 1: 'Corto', 2: 'Mediano', 3: 'Largo' }[formData.pelaje]}
            {formData.cuotaAdopcion > 0 && ` · Cuota: $${formData.cuotaAdopcion} MXN`}
          </p>
        </div>
      </div>

      {/* ── Error global ── */}
      {submitError && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '0.9rem', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#dc2626', flexShrink: 0 }}>error</span>
          <p style={{ fontSize: '0.83rem', color: '#991b1b', fontWeight: 600 }}>{submitError}</p>
        </div>
      )}

      {/* ── Barra de acciones ── */}
      <div className="sv-submit-bar">
        <button
          type="button"
          className="sv-submit-bar__btn sv-submit-bar__btn--ghost"
          onClick={handleDraft}
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
          Guardar borrador
        </button>
        <button
          type="button"
          className="sv-submit-bar__btn sv-submit-bar__btn--primary"
          onClick={handlePublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 16, animation: 'spin 1s linear infinite' }}>progress_activity</span>
              Publicando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>publish</span>
              Publicar perro
            </>
          )}
        </button>
      </div>
    </>
  )
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: 999, background: 'rgba(255,107,107,0.08)', color: '#ff6b6b', fontSize: '0.78rem', fontWeight: 700 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      {label}
    </span>
  )
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: 999, background: '#f4f4f5', color: '#52525b', fontSize: '0.78rem', fontWeight: 700 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      {label}
    </span>
  )
}
