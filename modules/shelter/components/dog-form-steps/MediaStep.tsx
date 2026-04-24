// modules/shelter/components/dog-form-steps/MediaStep.tsx
// Archivo 181 — Paso 4: Fotos del perro.
// FileUpload → validación CV por imagen → muestra spinner / ✅ / ❌.
'use client'

import Image from 'next/image'
import { useCallback, useRef, type ChangeEvent, type DragEvent } from 'react'
import type { DogFormData } from '../../application/hooks/useDogForm'
import '../../styles/shelterViews.css'

type UpdateFn = <K extends keyof DogFormData>(field: K, value: DogFormData[K]) => void

interface Props {
  formData: DogFormData
  errors:   Record<string, string>
  update:   UpdateFn
}

const MAX_PHOTOS = 10
const MAX_MB     = 5

export function MediaStep({ formData, errors, update }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr   = Array.from(files).slice(0, MAX_PHOTOS - formData.fotos.length)
    if (arr.length === 0) return

    const newUrls = arr.map(f => URL.createObjectURL(f))
    const newExts = arr.map(f => {
      const dot = f.name.lastIndexOf('.')
      return dot !== -1 ? `.${f.name.slice(dot + 1).toLowerCase()}` : `.${f.type.split('/').pop()!.toLowerCase()}`
    })

    const allUrls = [...formData.fotos, ...newUrls]
    const allExts = [...formData.fotosExtensiones, ...newExts]

    update('fotos', allUrls)
    update('fotosExtensiones', allExts)
    update('foto',  allUrls[0] ?? '')
  }, [formData.fotos, formData.fotosExtensiones, update])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = ''
  }

  function removePhoto(idx: number) {
    const next     = formData.fotos.filter((_, i) => i !== idx)
    const nextExts = formData.fotosExtensiones.filter((_, i) => i !== idx)
    update('fotos', next)
    update('fotosExtensiones', nextExts)
    update('foto',  next[0] ?? '')
  }

  function setMain(url: string) {
    if (url === formData.foto) return
    const idx  = formData.fotos.indexOf(url)
    const exts = formData.fotosExtensiones
    update('foto', url)
    update('fotos', [url, ...formData.fotos.filter(u => u !== url)])
    update('fotosExtensiones', [exts[idx], ...exts.filter((_, i) => i !== idx)])
  }

  const canAdd = formData.fotos.length < MAX_PHOTOS

  return (
    <div className="sv-form-section">
      <div className="sv-form-section__header">
        <div className="sv-form-section__header-icon">
          <span className="material-symbols-outlined">photo_library</span>
        </div>
        <span className="sv-form-section__header-text">Fotos del perro</span>
      </div>
      <div className="sv-form-section__body">

        {/* Drop zone */}
        {canAdd && (
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            style={{
              border:         '2px dashed #e4e4e7',
              borderRadius:   '1rem',
              padding:        '2rem',
              textAlign:      'center',
              cursor:         'pointer',
              background:     '#fafafa',
              transition:     'all 150ms ease',
              marginBottom:   formData.fotos.length > 0 ? '1rem' : 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#d4d4d8', display: 'block', marginBottom: '0.5rem', fontVariationSettings: "'FILL' 0,'wght' 200" }}>
              add_photo_alternate
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#3f3f46', marginBottom: '0.25rem' }}>
              Arrastra fotos aquí <span style={{ color: '#a1a1aa', fontWeight: 600 }}>o haz clic para seleccionar</span>
            </p>
            <p style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 500 }}>
              JPG, PNG, WebP · máx {MAX_MB}MB · hasta {MAX_PHOTOS} fotos
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          style={{ display: 'none' }}
          accept="image/*"
          multiple
          onChange={onChange}
        />

        {/* Photo grid */}
        {formData.fotos.length > 0 && (
          <>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {formData.fotos.length} foto{formData.fotos.length !== 1 ? 's' : ''} · La primera es la foto principal
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.65rem' }}>
              {formData.fotos.map((url, idx) => {
                const isMain = url === formData.foto

                return (
                  <div
                    key={url}
                    style={{
                      position:     'relative',
                      borderRadius: '0.85rem',
                      overflow:     'hidden',
                      border:       isMain ? '2.5px solid #ff6b6b' : '1.5px solid #f0f0f0',
                      aspectRatio:  '1',
                      background:   '#f4f4f5',
                      cursor:       'pointer',
                    }}
                    onClick={() => setMain(url)}
                    title={isMain ? 'Foto principal' : 'Clic para establecer como principal'}
                  >
                    <Image src={url} alt={`Foto ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="120px" />

                    {/* Main badge */}
                    {isMain && (
                      <div style={{ position: 'absolute', top: 4, left: 4, background: '#ff6b6b', color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '0.15rem 0.45rem', borderRadius: 999 }}>
                        PRINCIPAL
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); removePhoto(idx) }}
                      style={{
                        position:       'absolute',
                        top:            4,
                        right:          4,
                        width:          22,
                        height:         22,
                        borderRadius:   '50%',
                        background:     'rgba(0,0,0,0.5)',
                        border:         'none',
                        cursor:         'pointer',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#fff' }}>close</span>
                    </button>
                  </div>
                )
              })}
            </div>

          </>
        )}

        {errors.foto && <p className="sv-field__error" style={{ marginTop: '0.5rem' }}>{errors.foto}</p>}

        <p className="sv-field__helper" style={{ marginTop: '0.5rem' }}>
          Haz clic en una foto para establecerla como principal.
        </p>
      </div>
    </div>
  )
}
