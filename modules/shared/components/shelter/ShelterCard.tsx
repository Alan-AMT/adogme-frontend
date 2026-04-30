// modules/shared/components/shelter/ShelterCard.tsx
// Props: shelter: Shelter, variant?: 'grid' | 'compact'
// Visual: Logo + nombre + ciudad + "X perros disponibles" + botón "Ver refugio"
'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Shelter } from '../../domain/Shelter'
import { Button } from '../ui/Button'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ShelterCardProps {
  shelter: Shelter
  variant?: 'grid' | 'compact'
}

// ─── VARIANTE GRID ────────────────────────────────────────────────────────────

function CardGrid({ shelter }: ShelterCardProps) {
  const perros = shelter.perrosDisponibles ?? 0

  return (
    <Link
      href={`/refugios/${shelter.slug}`}
      className="group"
      style={{
        display: 'block',
        textDecoration: 'none',
        background: '#fff',
        borderRadius: '1.2rem',
        border: '1.5px solid #f0f0f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'box-shadow 200ms ease, border-color 200ms ease, transform 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 10px 32px rgba(250,82,82,0.12)'
        el.style.borderColor = '#ffd5d5'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
        el.style.borderColor = '#f0f0f0'
        el.style.transform = ''
      }}
    >
      {/* ── Banner thumbnail ── */}
      <div style={{ position: 'relative', width: '100%', height: 110, overflow: 'hidden', background: '#f5f5f5' }}>
        <Image
          src={shelter.imagenPortada}
          alt={`Portada de ${shelter.nombre}`}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 320px"
        />
        {/* Degradado overlay bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />

        {/* Rating badge */}
        {shelter.calificacion !== undefined && (
          <div style={{
            position: 'absolute', top: 8, right: 10,
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            fontSize: 11, fontWeight: 900, color: '#f59f00',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1", color: '#f59f00' }}>star</span>
            {shelter.calificacion.toFixed(1)}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Logo + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: -28, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '0.75rem',
            border: '2.5px solid #fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            overflow: 'hidden', flexShrink: 0, background: '#f5f5f5',
            position: 'relative',
          }}>
            <Image
              src={shelter.logo}
              alt={`Logo de ${shelter.nombre}`}
              fill
              className="object-cover object-center"
              sizes="52px"
            />
          </div>
          <div style={{ paddingTop: 18 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#18181b', margin: 0, lineHeight: 1.2 }}>
              {shelter.nombre}
            </h3>
          </div>
        </div>

        {/* Ciudad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: -4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#ff6b6b' }}>location_on</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a' }}>
            {shelter.alcaldia ?? shelter.ubicacion}
          </span>
        </div>

        {/* Perros disponibles + adopciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ff6b6b', fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#18181b' }}>
              {perros}{' '}
              <span style={{ fontWeight: 600, color: '#71717a' }}>
                {perros === 1 ? 'perro disponible' : 'perros disponibles'}
              </span>
            </span>
          </div>
          {(shelter.adopcionesRealizadas ?? 0) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#12b886' }}>favorite</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717a' }}>
                {shelter.adopcionesRealizadas} adopciones
              </span>
            </div>
          )}
        </div>

        {/* Botón */}
        <Button variant="primary" size="sm" fullWidth>
          Ver refugio
        </Button>
      </div>
    </Link>
  )
}

// ─── VARIANTE COMPACT ─────────────────────────────────────────────────────────

function CardCompact({ shelter }: ShelterCardProps) {
  const perros = shelter.perrosDisponibles ?? 0

  return (
    <Link
      href={`/refugios/${shelter.slug}`}
      className="group"
      style={{
        display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
        background: '#fff', borderRadius: '1rem',
        border: '1.5px solid #f0f0f0', padding: '10px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 6px 20px rgba(250,82,82,0.10)'
        el.style.borderColor = '#ffd5d5'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
        el.style.borderColor = '#f0f0f0'
      }}
    >
      {/* Logo */}
      <div style={{
        width: 44, height: 44, borderRadius: '0.65rem',
        border: '1.5px solid #f0f0f0', overflow: 'hidden',
        flexShrink: 0, position: 'relative', background: '#f5f5f5',
      }}>
        <Image
          src={shelter.logo}
          alt={`Logo de ${shelter.nombre}`}
          fill className="object-cover object-center" sizes="44px"
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.88rem', fontWeight: 900, color: '#18181b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shelter.nombre}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#a1a1aa' }}>location_on</span>
          <span style={{ fontSize: '0.73rem', fontWeight: 600, color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shelter.alcaldia ?? shelter.ubicacion}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#ff6b6b', fontVariationSettings: "'FILL' 1" }}>pets</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff6b6b' }}>
            {perros} {perros === 1 ? 'perro' : 'perros'}
          </span>
        </div>
      </div>

      {/* Flecha */}
      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#d4d4d8', flexShrink: 0, transition: 'color 200ms ease, transform 200ms ease' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ff6b6b' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#d4d4d8' }}
      >
        chevron_right
      </span>
    </Link>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ShelterCard({ shelter, variant = 'grid' }: ShelterCardProps) {
  if (variant === 'compact') return <CardCompact shelter={shelter} variant={variant} />
  return <CardGrid shelter={shelter} variant={variant} />
}
