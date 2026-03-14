// modules/adoption/components/steps/HousingStep.tsx
// Paso 1 — Información de vivienda
'use client'

import type { AdoptionFormData, HousingInfo, HousingType } from '@/modules/shared/domain/AdoptionRequest'
import { Select }     from '@/modules/shared/components/ui/Select'
import { Input }      from '@/modules/shared/components/ui/Input'
import { FileUpload } from '@/modules/shared/components/ui/FileUpload'

interface Props {
  data:        Partial<AdoptionFormData>
  errors:      Record<string, string>
  updateField: <K extends keyof AdoptionFormData>(key: K, value: AdoptionFormData[K]) => void
}

function update(
  current: Partial<HousingInfo> | undefined,
  key: keyof HousingInfo,
  value: unknown,
): HousingInfo {
  return { ...(current ?? {}), [key]: value } as HousingInfo
}

const TIPO_OPTIONS = [
  { value: 'casa',         label: 'Casa' },
  { value: 'departamento', label: 'Departamento / Apartamento' },
  { value: 'casa_campo',   label: 'Casa de campo / Rancho' },
  { value: 'otro',         label: 'Otro' },
]

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
            style={{ fontSize: 16, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 16" }}
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
            style={{ fontSize: 16, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 16" }}
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

export default function HousingStep({ data, errors, updateField }: Props) {
  const vivienda = data.vivienda

  function setHousing(key: keyof HousingInfo, value: unknown) {
    updateField('vivienda', update(vivienda, key, value))
  }

  return (
    <div>
      {/* Tipo de vivienda */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">home</span>
          Tipo de vivienda
        </p>
        <div className="af-field-grid">
          <Select
            label="¿En qué tipo de vivienda vives?"
            required
            placeholder="Selecciona una opción"
            options={TIPO_OPTIONS}
            value={(vivienda?.tipo as string) ?? ''}
            onChange={e => setHousing('tipo', e.target.value as HousingType)}
            error={errors['vivienda.tipo']}
          />
        </div>

        <div className="af-field-grid mt-4">
          <YesNo
            label="¿Eres propietario de la vivienda?"
            required
            value={vivienda?.esPropietario}
            onChange={v => setHousing('esPropietario', v)}
            error={errors['vivienda.esPropietario']}
          />

          {vivienda?.esPropietario === false && (
            <YesNo
              label="¿Tu arrendador permite tener animales?"
              required
              value={vivienda?.permiteAnimales}
              onChange={v => setHousing('permiteAnimales', v)}
              error={errors['vivienda.permiteAnimales']}
            />
          )}
        </div>
      </div>

      {/* Espacio exterior */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">yard</span>
          Espacio exterior
        </p>
        <div className="af-field-grid">
          <YesNo
            label="¿Tienes jardín, patio o área exterior?"
            value={vivienda?.tieneJardin}
            onChange={v => setHousing('tieneJardin', v)}
          />
        </div>

        {vivienda?.tieneJardin && (
          <div className="af-field-grid af-field-grid--2 mt-4">
            <Input
              label="Tamaño aproximado (m²)"
              type="number"
              min={1}
              placeholder="Ej. 30"
              value={vivienda?.tamanoJardinM2 ?? ''}
              onChange={e =>
                setHousing(
                  'tamanoJardinM2',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              leftIcon={
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  straighten
                </span>
              }
            />
            <YesNo
              label="¿El área exterior tiene barda o cerca?"
              value={vivienda?.tieneRejaOCerca}
              onChange={v => setHousing('tieneRejaOCerca', v)}
            />
          </div>
        )}
      </div>

      {/* Fotos opcionales */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">photo_library</span>
          Fotos de tu hogar
          <span className="text-[#9ca3af] font-[500] text-[12px] ml-1">(opcional)</span>
        </p>
        <p className="af-section-hint">
          Adjuntar fotos puede agilizar la revisión de tu solicitud — el refugio
          verá el espacio donde vivirá el perro.
        </p>
        <FileUpload
          label="Subir fotos (máx. 4 imágenes, 5 MB c/u)"
          accept={['image/*']}
          maxFiles={4}
          maxSizeMB={5}
          showPreview
          onFilesChange={files => {
            const urls = files.map(f => URL.createObjectURL(f))
            setHousing('fotosVivienda', urls)
          }}
        />
      </div>
    </div>
  )
}
