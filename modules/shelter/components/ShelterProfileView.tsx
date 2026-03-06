// modules/shelter/components/ShelterProfileView.tsx
// Archivo 188 — Formulario de edición del perfil del refugio.
// FileUpload para logo/banner con preview en tiempo real. Redes sociales como array dinámico.
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from 'react'
import { useShelterProfile } from '../application/hooks/useShelterProfile'
import type { Shelter } from '@/modules/shared/domain/Shelter'
import '../styles/shelterDashboard.css'
import '../styles/shelterViews.css'

// ─── Estado del form ───────────────────────────────────────────────────────────

interface SocialLink { platform: 'facebook' | 'instagram' | 'twitter' | 'web'; url: string }

interface FormState {
  nombre:      string
  descripcion: string
  correo:      string
  telefono:    string
  ubicacion:   string
  ciudad:      string
  estado:      string
  logo:        string   // blob URL or existing URL
  imagenPortada: string
  socialLinks: SocialLink[]
}

function shelterToForm(s: Shelter): FormState {
  const links: SocialLink[] = []
  if (s.redesSociales?.facebook)  links.push({ platform: 'facebook',  url: s.redesSociales.facebook })
  if (s.redesSociales?.instagram) links.push({ platform: 'instagram', url: s.redesSociales.instagram })
  if (s.redesSociales?.twitter)   links.push({ platform: 'twitter',   url: s.redesSociales.twitter })
  if (s.redesSociales?.web)       links.push({ platform: 'web',       url: s.redesSociales.web })
  return {
    nombre: s.nombre, descripcion: s.descripcion, correo: s.correo, telefono: s.telefono,
    ubicacion: s.ubicacion, ciudad: s.ciudad, estado: s.estado,
    logo: s.logo, imagenPortada: s.imagenPortada,
    socialLinks: links,
  }
}

const EMPTY_FORM: FormState = {
  nombre: '', descripcion: '', correo: '', telefono: '',
  ubicacion: '', ciudad: '', estado: '', logo: '', imagenPortada: '',
  socialLinks: [],
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="sv-profile-grid">
      {[240, 300, 200].map((h, i) => (
        <div key={i} className="sv-form-section">
          <div className="sv-skel-row" style={{ height: h, margin: '1rem', borderRadius: '0.9rem' }} />
        </div>
      ))}
    </div>
  )
}

// ─── Vista de perfil (modo previsualización) ───────────────────────────────────

function ProfilePreview({ form }: { form: FormState }) {
  return (
    <div className="sd-card" style={{ overflow: 'hidden', marginBottom: '1.25rem' }}>
      {/* Portada */}
      <div
        style={{
          position: 'relative',
          height: 120,
          background: '#f4f4f5',
          overflow: 'hidden',
        }}
      >
        {form.imagenPortada && (
          <Image
            src={form.imagenPortada}
            alt="Portada"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        )}
        {/* Logo superpuesto */}
        <div
          style={{
            position: 'absolute',
            bottom: -24,
            left: '1.25rem',
            width: 56,
            height: 56,
            borderRadius: '1rem',
            border: '2.5px solid #fff',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {form.logo && (
            <Image src={form.logo} alt="Logo" fill sizes="56px" style={{ objectFit: 'contain', padding: 4 }} />
          )}
        </div>
      </div>

      <div style={{ padding: '2rem 1.25rem 1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#18181b', margin: '0 0 0.2rem' }}>
          {form.nombre}
        </h2>
        <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>location_on</span>
          {form.ciudad}, {form.estado}
        </p>
      </div>
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ShelterProfileView() {
  const { shelter, isLoading, isSaving, error, success, saveProfile } = useShelterProfile()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const logoInputRef   = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar cuando llega el shelter
  useEffect(() => {
    if (shelter) setForm(shelterToForm(shelter))
  }, [shelter])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const redesSociales: Shelter['redesSociales'] = {}
    for (const link of form.socialLinks) {
      if (link.url.trim()) redesSociales[link.platform] = link.url.trim()
    }
    const payload: Partial<Shelter> = {
      nombre:        form.nombre.trim(),
      descripcion:   form.descripcion.trim(),
      correo:        form.correo.trim(),
      telefono:      form.telefono.trim(),
      ubicacion:     form.ubicacion.trim(),
      ciudad:        form.ciudad.trim(),
      estado:        form.estado.trim(),
      logo:          form.logo.trim(),
      imagenPortada: form.imagenPortada.trim(),
      redesSociales,
    }
    try {
      await saveProfile(payload)
    } catch {
      // error ya manejado en el hook
    }
  }

  if (isLoading) return <Skeleton />

  if (error && !shelter) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>error</span>
        {error}
      </div>
    )
  }

  return (
    <>
      {/* Vista previa */}
      <ProfilePreview form={form} />

      <form onSubmit={handleSubmit} className="sv-form">

        {/* ── Información general ── */}
        <div className="sv-form-section">
          <div className="sv-form-section__header">
            <span className="material-symbols-outlined">business</span>
            Información general
          </div>
          <div className="sv-form-section__body">

            <div className="sv-field">
              <label className="sv-field__label">Nombre del refugio</label>
              <input
                type="text"
                className="sv-field__input"
                value={form.nombre}
                onChange={e => update('nombre', e.target.value)}
                maxLength={120}
              />
            </div>

            <div className="sv-field">
              <label className="sv-field__label">Descripción</label>
              <textarea
                className="sv-field__textarea"
                value={form.descripcion}
                onChange={e => update('descripcion', e.target.value)}
                rows={4}
                maxLength={800}
              />
              <p className="sv-field__helper">{form.descripcion.length}/800 caracteres</p>
            </div>

            <div className="sv-form-row">
              <div className="sv-field">
                <label className="sv-field__label">Ciudad</label>
                <input
                  type="text"
                  className="sv-field__input"
                  value={form.ciudad}
                  onChange={e => update('ciudad', e.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="sv-field">
                <label className="sv-field__label">Estado / Provincia</label>
                <input
                  type="text"
                  className="sv-field__input"
                  value={form.estado}
                  onChange={e => update('estado', e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            <div className="sv-field">
              <label className="sv-field__label">Dirección completa</label>
              <input
                type="text"
                className="sv-field__input"
                value={form.ubicacion}
                onChange={e => update('ubicacion', e.target.value)}
                maxLength={200}
                placeholder="Calle, Colonia, Ciudad"
              />
            </div>

          </div>
        </div>

        {/* ── Contacto ── */}
        <div className="sv-form-section">
          <div className="sv-form-section__header">
            <span className="material-symbols-outlined">contact_phone</span>
            Contacto
          </div>
          <div className="sv-form-section__body">
            <div className="sv-form-row">
              <div className="sv-field">
                <label className="sv-field__label">Correo electrónico</label>
                <input
                  type="email"
                  className="sv-field__input"
                  value={form.correo}
                  onChange={e => update('correo', e.target.value)}
                />
              </div>
              <div className="sv-field">
                <label className="sv-field__label">Teléfono</label>
                <input
                  type="tel"
                  className="sv-field__input"
                  value={form.telefono}
                  onChange={e => update('telefono', e.target.value)}
                  placeholder="55 1234 5678"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Imágenes ── */}
        <div className="sv-form-section">
          <div className="sv-form-section__header">
            <span className="material-symbols-outlined">photo_library</span>
            Imágenes
          </div>
          <div className="sv-form-section__body">

            {/* Logo upload */}
            <div className="sv-field">
              <label className="sv-field__label">Logo del refugio</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Preview */}
                {form.logo && (
                  <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '1rem', overflow: 'hidden', border: '1.5px solid #e4e4e7', flexShrink: 0, background: '#fafafa' }}>
                    <Image src={form.logo} alt="Logo preview" fill sizes="72px" style={{ objectFit: 'contain', padding: 6 }} />
                  </div>
                )}
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: 999, border: '1.5px solid #e4e4e7', background: '#fff', fontSize: '0.82rem', fontWeight: 800, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                  {form.logo ? 'Cambiar logo' : 'Subir logo'}
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (file) update('logo', URL.createObjectURL(file))
                    e.target.value = ''
                  }}
                />
              </div>
              <p className="sv-field__helper">PNG, JPG, SVG · recomendado 200×200 px</p>
            </div>

            {/* Banner upload */}
            <div className="sv-field">
              <label className="sv-field__label">Imagen de portada</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Preview */}
                {form.imagenPortada && (
                  <div style={{ position: 'relative', width: 'min(100%, 400px)', height: 100, borderRadius: '1rem', overflow: 'hidden', border: '1.5px solid #e4e4e7', flexShrink: 0, background: '#fafafa' }}>
                    <Image src={form.imagenPortada} alt="Banner preview" fill sizes="400px" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: 999, border: '1.5px solid #e4e4e7', background: '#fff', fontSize: '0.82rem', fontWeight: 800, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                  {form.imagenPortada ? 'Cambiar portada' : 'Subir portada'}
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (file) update('imagenPortada', URL.createObjectURL(file))
                    e.target.value = ''
                  }}
                />
              </div>
              <p className="sv-field__helper">PNG, JPG · recomendado proporción 3:1 (p.ej. 1200×400 px)</p>
            </div>

          </div>
        </div>

        {/* ── Redes sociales ── */}
        <div className="sv-form-section">
          <div className="sv-form-section__header">
            <span className="material-symbols-outlined">public</span>
            Redes sociales
          </div>
          <div className="sv-form-section__body">
            {form.socialLinks.map((link, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <select
                  value={link.platform}
                  onChange={e => {
                    const next = [...form.socialLinks]
                    next[i] = { ...next[i], platform: e.target.value as SocialLink['platform'] }
                    update('socialLinks', next)
                  }}
                  style={{ padding: '0.5rem 0.65rem', border: '1.5px solid #e4e4e7', borderRadius: '0.6rem', fontSize: '0.82rem', fontFamily: 'inherit', background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#374151' }}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="web">Sitio web</option>
                </select>
                <input
                  type="url"
                  className="sv-field__input"
                  value={link.url}
                  placeholder="https://..."
                  onChange={e => {
                    const next = [...form.socialLinks]
                    next[i] = { ...next[i], url: e.target.value }
                    update('socialLinks', next)
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => update('socialLinks', form.socialLinks.filter((_, idx) => idx !== i))}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            ))}
            {form.socialLinks.length < 4 && (
              <button
                type="button"
                onClick={() => update('socialLinks', [...form.socialLinks, { platform: 'web', url: '' }])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.95rem', borderRadius: 999, border: '1.5px dashed #e4e4e7', background: '#fafafa', fontSize: '0.78rem', fontWeight: 800, color: '#71717a', cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.25rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                Agregar red social
              </button>
            )}
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>
        )}
        {success && (
          <p style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
            Perfil actualizado correctamente
          </p>
        )}

        {/* Barra de acciones */}
        <div className="sv-submit-bar">
          <button
            type="submit"
            className="sv-submit-bar__btn sv-submit-bar__btn--primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>hourglass_top</span>
                Guardando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                Guardar cambios
              </>
            )}
          </button>
        </div>

      </form>
    </>
  )
}
