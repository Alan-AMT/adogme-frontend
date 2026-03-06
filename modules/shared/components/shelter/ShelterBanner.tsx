// modules/shared/components/shelter/ShelterBanner.tsx
// REFACTOR del shelterBanner original en perro/
// Props: shelter: Shelter, showContactInfo?: boolean
// Visual: Imagen de banner con degradado overlay bottom.
//         Logo superpuesto con efecto glass. Nombre, ciudad, descripción sobre el overlay.
'use client'

import Image from 'next/image'
import type { Shelter } from '../../domain/Shelter'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ShelterBannerProps {
  shelter: Shelter
  showContactInfo?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShelterBanner({ shelter, showContactInfo = false }: ShelterBannerProps) {
  const perros = shelter.perrosDisponibles ?? 0

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.13)' }}>

      {/* ── Imagen de portada ── */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(220px, 32vw, 380px)', background: '#1a1a2e' }}>
        <Image
          src={shelter.imagenPortada}
          alt={`Portada de ${shelter.nombre}`}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1200px"
        />

        {/* Degradado overlay bottom — cubre ~60% inferior */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 45%, transparent 75%)',
        }} />

        {/* ── Contenido sobre el overlay ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(16px, 3vw, 28px)',
          display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px, 2vw, 20px)',
        }}>

          {/* Logo con efecto glass */}
          <div style={{
            flexShrink: 0,
            width: 'clamp(64px, 10vw, 96px)',
            height: 'clamp(64px, 10vw, 96px)',
            borderRadius: '1.1rem',
            position: 'relative',
            overflow: 'hidden',
            // Glass effect
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '2px solid rgba(255,255,255,0.35)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}>
            <Image
              src={shelter.logo}
              alt={`Logo de ${shelter.nombre}`}
              fill
              className="object-cover object-center"
              sizes="96px"
            />
          </div>

          {/* Nombre + ciudad + descripción */}
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
            <h1 style={{
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              fontWeight: 900, color: '#fff', margin: 0,
              lineHeight: 1.15,
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {shelter.nombre}
            </h1>

            {/* Ciudad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#ff8c8c', fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                {shelter.ciudad}{shelter.estado !== shelter.ciudad ? `, ${shelter.estado}` : ''}
              </span>
            </div>

            {/* Descripción corta */}
            <p style={{
              fontSize: '0.82rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.75)',
              margin: '6px 0 0', lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              maxWidth: 520,
            }}>
              {shelter.descripcion}
            </p>
          </div>

          {/* Stats pill — derecha */}
          <div style={{
            flexShrink: 0, alignSelf: 'flex-start', marginTop: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
            paddingBottom: 4,
          }}>
            {/* Perros disponibles */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#ff8c8c', fontVariationSettings: "'FILL' 1" }}>pets</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                {perros} {perros === 1 ? 'perro' : 'perros'}
              </span>
            </div>

            {/* Calificación */}
            {shelter.calificacion !== undefined && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#f59f00', fontVariationSettings: "'FILL' 1" }}>star</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                  {shelter.calificacion.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sección de contacto (opcional) ── */}
      {showContactInfo && (
        <div style={{
          background: '#fff',
          padding: 'clamp(12px, 2.5vw, 20px) clamp(16px, 3vw, 28px)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          gap: 'clamp(12px, 2vw, 24px)',
          borderTop: '1px solid #f4f4f5',
        }}>
          {/* Correo */}
          <a
            href={`mailto:${shelter.correo}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#52525b' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#ff6b6b' }}>mail</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{shelter.correo}</span>
          </a>

          {/* Teléfono */}
          <a
            href={`tel:${shelter.telefono}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#52525b' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#ff6b6b' }}>phone</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{shelter.telefono}</span>
          </a>

          {/* Redes sociales */}
          {shelter.redesSociales?.instagram && (
            <a
              href={shelter.redesSociales.instagram}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#52525b' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#ff6b6b' }}>photo_camera</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Instagram</span>
            </a>
          )}

          {shelter.redesSociales?.facebook && (
            <a
              href={shelter.redesSociales.facebook}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#52525b' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#ff6b6b' }}>thumb_up</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Facebook</span>
            </a>
          )}

          {shelter.redesSociales?.web && (
            <a
              href={shelter.redesSociales.web}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#52525b' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#ff6b6b' }}>language</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Sitio web</span>
            </a>
          )}

          {/* Adopciones realizadas — al final, separado a la derecha */}
          {(shelter.adopcionesRealizadas ?? 0) > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#12b886', fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#18181b' }}>
                {shelter.adopcionesRealizadas}
                <span style={{ fontWeight: 600, color: '#71717a' }}> adopciones</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
