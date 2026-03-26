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
  nombre:        string
  descripcion:   string
  correo:        string
  telefono:      string
  ubicacion:     string
  ciudad:        string
  estado:        string
  logo:          string
  imagenPortada: string
  socialLinks:   SocialLink[]
  // Donaciones
  aceptaDonaciones: boolean
  descripcionCausa: string
  cuentaClabe:      string
  banco:            string
  titularCuenta:    string
  paypalLink:       string
  mercadoPagoLink:  string
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
    aceptaDonaciones: s.donationConfig?.aceptaDonaciones ?? false,
    descripcionCausa: s.donationConfig?.descripcionCausa ?? '',
    cuentaClabe:      s.donationConfig?.cuentaClabe ?? '',
    banco:            s.donationConfig?.banco ?? '',
    titularCuenta:    s.donationConfig?.titularCuenta ?? '',
    paypalLink:       s.donationConfig?.paypalLink ?? '',
    mercadoPagoLink:  s.donationConfig?.mercadoPagoLink ?? '',
  }
}

const EMPTY_FORM: FormState = {
  nombre: '', descripcion: '', correo: '', telefono: '',
  ubicacion: '', ciudad: '', estado: '', logo: '', imagenPortada: '',
  socialLinks: [],
  aceptaDonaciones: false, descripcionCausa: '', cuentaClabe: '',
  banco: '', titularCuenta: '', paypalLink: '', mercadoPagoLink: '',
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

// ─── Vista de perfil (hero con banner + logo) ─────────────────────────────────

function ProfileHero({
  form,
  onEditBanner,
  onEditLogo,
}: {
  form: FormState
  onEditBanner: () => void
  onEditLogo: () => void
}) {
  return (
    <div className="sv-profile-hero">
      {/* Banner */}
      <div className="sv-profile-hero__banner">
        {form.imagenPortada && (
          <Image
            src={form.imagenPortada}
            alt="Portada"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="sv-profile-hero__overlay" />

        {/* Botón editar portada */}
        <button type="button" className="sv-profile-hero__edit-banner" onClick={onEditBanner}>
          <span className="material-symbols-outlined">photo_camera</span>
          Cambiar portada
        </button>

        {/* Logo */}
        <div className="sv-profile-hero__logo-wrap">
          {form.logo && (
            <Image src={form.logo} alt="Logo" fill sizes="64px" style={{ objectFit: 'contain', padding: 6 }} />
          )}
        </div>

        {/* Botón editar logo */}
        <button type="button" className="sv-profile-hero__edit-logo" onClick={onEditLogo}>
          <span className="material-symbols-outlined">upload</span>
          {form.logo ? 'Cambiar logo' : 'Subir logo'}
        </button>
      </div>

      {/* Info */}
      <div className="sv-profile-hero__info">
        <h2 className="sv-profile-hero__name">{form.nombre || 'Nombre del refugio'}</h2>
        <p className="sv-profile-hero__location">
          <span className="material-symbols-outlined">location_on</span>
          {form.ciudad && form.estado ? `${form.ciudad}, ${form.estado}` : 'Sin ubicación'}
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
      donationConfig: {
        aceptaDonaciones: form.aceptaDonaciones,
        descripcionCausa: form.descripcionCausa.trim() || undefined,
        cuentaClabe:      form.cuentaClabe.trim()      || undefined,
        banco:            form.banco.trim()             || undefined,
        titularCuenta:    form.titularCuenta.trim()     || undefined,
        paypalLink:       form.paypalLink.trim()        || undefined,
        mercadoPagoLink:  form.mercadoPagoLink.trim()   || undefined,
      },
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
      {/* Hero: banner + logo (inputs ocultos conectados) */}
      <ProfileHero
        form={form}
        onEditBanner={() => bannerInputRef.current?.click()}
        onEditLogo={() => logoInputRef.current?.click()}
      />

      {/* Inputs de archivo ocultos */}
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

      <form onSubmit={handleSubmit} className="sv-profile-form">
        <div className="sv-profile-cols">

          {/* ── Columna izquierda ── */}
          <div className="sv-profile-col-main">

            {/* Información general */}
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

            {/* Imágenes — referencia de tamaños */}
            <div className="sv-form-section">
              <div className="sv-form-section__header">
                <span className="material-symbols-outlined">photo_library</span>
                Imágenes
              </div>
              <div className="sv-form-section__body">
                <p style={{ fontSize: '0.82rem', color: '#71717a', fontWeight: 500, margin: 0 }}>
                  Usa los botones sobre el banner de arriba para cambiar la portada y el logo del refugio.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160, background: '#f9fafb', border: '1.5px solid #f0f0f0', borderRadius: '1rem', padding: '0.85rem 1rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Logo</p>
                    <p style={{ fontSize: '0.78rem', color: '#52525b', fontWeight: 500, margin: 0 }}>PNG, JPG, SVG · 200×200 px recomendado</p>
                  </div>
                  <div style={{ flex: 2, minWidth: 160, background: '#f9fafb', border: '1.5px solid #f0f0f0', borderRadius: '1rem', padding: '0.85rem 1rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Portada</p>
                    <p style={{ fontSize: '0.78rem', color: '#52525b', fontWeight: 500, margin: 0 }}>PNG, JPG · proporción 3:1 — 1200×400 px recomendado</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Columna derecha ── */}
          <div className="sv-profile-col-side">

            {/* Contacto */}
            <div className="sv-form-section">
              <div className="sv-form-section__header">
                <span className="material-symbols-outlined">contact_phone</span>
                Contacto
              </div>
              <div className="sv-form-section__body">
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

            {/* Redes sociales */}
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

          </div>

          {/* ── Donaciones ── */}
          <div className="sv-form-section" style={{ gridColumn: '1 / -1' }}>
            <div className="sv-form-section__header">
              <span className="material-symbols-outlined">volunteer_activism</span>
              Configuración de donaciones
            </div>
            <div className="sv-form-section__body">

              {/* Toggle aceptar donaciones */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#fafafa', borderRadius: '0.85rem', border: '1.5px solid #f0f0f0', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', margin: '0 0 0.1rem' }}>Aceptar donaciones</p>
                  <p style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500, margin: 0 }}>Activa el botón "Donar" en tu perfil público</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('aceptaDonaciones', !form.aceptaDonaciones)}
                  style={{
                    width: 44, height: 24, borderRadius: 999, border: 'none', flexShrink: 0,
                    background: form.aceptaDonaciones ? '#ff6b6b' : '#e4e4e7',
                    cursor: 'pointer', position: 'relative', transition: 'background 200ms ease',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, left: form.aceptaDonaciones ? 23 : 3,
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    transition: 'left 200ms ease', display: 'block',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>

              <div className="sv-form-row" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>

                <div className="sv-field">
                  <label className="sv-field__label">CLABE interbancaria</label>
                  <input
                    type="text"
                    className="sv-field__input"
                    value={form.cuentaClabe}
                    onChange={e => update('cuentaClabe', e.target.value)}
                    placeholder="18 dígitos"
                    maxLength={18}
                    style={{ fontFamily: 'monospace', letterSpacing: '0.06em' }}
                  />
                </div>

                <div className="sv-field">
                  <label className="sv-field__label">Banco</label>
                  <input
                    type="text"
                    className="sv-field__input"
                    value={form.banco}
                    onChange={e => update('banco', e.target.value)}
                    placeholder="Ej: BBVA, Santander, STP"
                    maxLength={60}
                  />
                </div>

                <div className="sv-field">
                  <label className="sv-field__label">Titular de la cuenta</label>
                  <input
                    type="text"
                    className="sv-field__input"
                    value={form.titularCuenta}
                    onChange={e => update('titularCuenta', e.target.value)}
                    placeholder="Nombre como aparece en banco"
                    maxLength={120}
                  />
                </div>

                <div className="sv-field">
                  <label className="sv-field__label">Link de PayPal</label>
                  <input
                    type="url"
                    className="sv-field__input"
                    value={form.paypalLink}
                    onChange={e => update('paypalLink', e.target.value)}
                    placeholder="https://www.paypal.me/..."
                  />
                </div>

                <div className="sv-field">
                  <label className="sv-field__label">Link de MercadoPago</label>
                  <input
                    type="url"
                    className="sv-field__input"
                    value={form.mercadoPagoLink}
                    onChange={e => update('mercadoPagoLink', e.target.value)}
                    placeholder="https://link.mercadopago.com.mx/..."
                  />
                </div>

              </div>

              <div className="sv-field" style={{ marginTop: '0.25rem' }}>
                <label className="sv-field__label">¿A dónde va tu donación? (descripción de la causa)</label>
                <textarea
                  className="sv-field__textarea"
                  value={form.descripcionCausa}
                  onChange={e => update('descripcionCausa', e.target.value)}
                  rows={3}
                  maxLength={400}
                  placeholder="Explica a los donantes cómo usarás su apoyo..."
                />
                <p className="sv-field__helper">{form.descripcionCausa.length}/400 caracteres</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem 1rem', background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '0.75rem', marginTop: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#0369a1', flexShrink: 0, fontVariationSettings: "'FILL' 1", marginTop: 1 }}>info</span>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#0c4a6e', fontWeight: 500, lineHeight: 1.5 }}>
                  Los donantes realizan transferencias directamente a tu cuenta. aDOGme no procesa ni retiene pagos.
                </p>
              </div>

            </div>
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
