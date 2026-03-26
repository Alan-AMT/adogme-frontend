// modules/shared/components/dog/DogCard.tsx
// REFACTOR — usa las clases CSS exactas de catalog.css + dogProfile.css
// Marco: cat-dog-frame → backgroundImage: back.jpg (igual al original)
// 4 variantes: grid | list | featured | compact
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CompatibilityGroup, type CompatibilityAnswer } from './CompatibilityIcon'
import { EnergyBar, type EnergyLevel } from './EnergyBar'
import { PersonalityTag, type PersonalityTag as PersonalityTagType } from './PersonalityTag'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type DogStatus = 'disponible' | 'en_proceso' | 'adoptado'
export type DogSize   = 'pequeño' | 'mediano' | 'grande' | 'gigante'
export type DogSex    = 'macho' | 'hembra'

export interface DogListItem {
  id:               string
  nombre:           string
  raza:             string
  edad:             number
  sexo:             DogSex
  tamano:           DogSize
  nivelEnergia:     EnergyLevel
  estado:           DogStatus
  imageUrl:         string
  descripcion:      string
  shelterName:      string
  shelterCity?:     string
  personalityTags?: PersonalityTagType[]
  compatKids?:      CompatibilityAnswer
  compatCats?:      CompatibilityAnswer
  compatDogs?:      CompatibilityAnswer
}

export interface DogCardProps {
  dog:                 DogListItem
  variant?:            'grid' | 'list' | 'featured' | 'compact'
  isFavorite?:         boolean
  onToggleFavorite?:   (dogId: string) => void
  compatibilityScore?: number
  loading?:            boolean
  onCardClick?:        (dogId: string) => void
  showShelterInfo?:    boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function edadLabel(m: number) {
  if (m < 12) return `${m} ${m === 1 ? 'mes' : 'meses'}`
  const a = Math.floor(m / 12)
  return `${a} ${a === 1 ? 'año' : 'años'}`
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const ESTADO_BADGE: Record<DogStatus, { cls: string; label: string }> = {
  disponible: { cls: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200', label: 'Disponible' },
  en_proceso: { cls: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',       label: 'En proceso' },
  adoptado:   { cls: 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200',           label: 'Adoptado'   },
}

const ENERGY_ICON: Record<EnergyLevel, string> = {
  1: 'psychiatry', 2: 'psychiatry', 3: 'bolt',
  4: 'local_fire_department', 5: 'local_fire_department',
}
const ENERGY_LABEL: Record<EnergyLevel, string> = {
  1: 'Baja', 2: 'Moderada', 3: 'Alta', 4: 'Muy alta', 5: 'Extrema',
}

// ─── InfoRow — igual al original ─────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="cat-dog-info">
      <span className="material-symbols-outlined cat-dog-info__icon">{icon}</span>
      <span className="cat-dog-info__label">{label}</span>
      <span className="cat-dog-info__value">{value}</span>
    </div>
  )
}

// ─── FavoriteBtn ─────────────────────────────────────────────────────────────

function FavoriteBtn({ isFavorite, onClick }: {
  isFavorite: boolean; onClick: (e: React.MouseEvent) => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 150ms ease',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.15)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 17,
          color: isFavorite ? '#ff6b6b' : '#a1a1aa',
          fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 18`,
          transition: 'all 200ms ease',
        }}
      >
        favorite
      </span>
    </button>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626'
  return (
    <div style={{
      position: 'absolute', top: 6, left: 6, zIndex: 10,
      padding: '3px 8px', borderRadius: 999,
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      fontSize: 10, fontWeight: 900, color,
    }}>
      {score}% match
    </div>
  )
}

// ─── VARIANTE GRID — usa clases exactas cat-dog-* ────────────────────────────

function CardGrid({ dog, isFavorite, onToggleFavorite, compatibilityScore, showShelterInfo, onCardClick }: DogCardProps) {
  const badge = ESTADO_BADGE[dog.estado] ?? ESTADO_BADGE.adoptado
  const handleFav = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(dog.id) }
  const handleClick = onCardClick ? (e: React.MouseEvent) => { e.preventDefault(); onCardClick(dog.id) } : undefined

  return (
    <Link href={`/perros/${dog.id}`} onClick={handleClick} className="cat-dog-frame group">
      <div className="cat-dog-panel">

        {/* ── Imagen ── */}
        <div className="cat-dog-media">
          {compatibilityScore !== undefined && <ScoreBadge score={compatibilityScore} />}
          <div className="cat-dog-photo">
            <Image
              src={dog.imageUrl}
              alt={`Fotografía de ${dog.nombre}`}
              fill
              className="cat-dog-photo__img group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 240px"
            />
          </div>
          {onToggleFavorite && (
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
              <FavoriteBtn isFavorite={!!isFavorite} onClick={handleFav} />
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="cat-dog-body">
          <span className={`cat-dog-badge ${badge.cls}`}>{badge.label}</span>
          <h3 className="cat-dog-name">{dog.nombre}</h3>
          <p className="cat-dog-breed">{dog.raza}</p>
          {showShelterInfo && <p className="cat-dog-shelter">{dog.shelterName}</p>}
          <p className="cat-dog-desc">{dog.descripcion}</p>

          {/* Personality tags — máx 3 */}
          {dog.personalityTags && dog.personalityTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
              {dog.personalityTags.slice(0, 3).map(tag => (
                <PersonalityTag key={tag.id} tag={tag} size="sm" />
              ))}
            </div>
          )}

          {/* Info rows — igual al original */}
          <div className="cat-dog-infoList">
            <InfoRow icon="cake"                         label="Edad"    value={edadLabel(dog.edad)} />
            <InfoRow icon="straighten"                   label="Tamaño"  value={cap(dog.tamano)} />
            <InfoRow icon={ENERGY_ICON[dog.nivelEnergia]} label="Energía" value={ENERGY_LABEL[dog.nivelEnergia]} />
            <InfoRow icon={dog.sexo === 'macho' ? 'male' : 'female'} label="Sexo" value={cap(dog.sexo)} />
          </div>

          <span className="cat-dog-cta">Ver perfil →</span>
        </div>
      </div>
    </Link>
  )
}

// ─── VARIANTE LIST ────────────────────────────────────────────────────────────

function CardList({ dog, isFavorite, onToggleFavorite, compatibilityScore, showShelterInfo }: DogCardProps) {
  const badge = ESTADO_BADGE[dog.estado] ?? ESTADO_BADGE.adoptado
  const handleFav = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(dog.id) }

  return (
    <Link
      href={`/perros/${dog.id}`}
      className="group"
      style={{
        display: 'flex', gap: 14, textDecoration: 'none',
        background: '#fff', borderRadius: '1.1rem',
        border: '1.5px solid #f0f0f0', padding: 14,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; el.style.borderColor = '#ffe4e4' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; el.style.borderColor = '#f0f0f0' }}
    >
      {/* Foto pequeña con marco back.jpg */}
      <div style={{
        flexShrink: 0, width: 100, height: 100, borderRadius: '0.85rem',
        backgroundImage: "url('/assets/ui/back.jpg')",
        backgroundRepeat: 'repeat', backgroundSize: '80px auto', padding: 7,
        position: 'relative',
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <Image
            src={dog.imageUrl} alt={dog.nombre} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="100px"
          />
        </div>
        {compatibilityScore !== undefined && (
          <div style={{
            position: 'absolute', bottom: 4, right: 4,
            padding: '2px 6px', borderRadius: 999,
            background: '#fff', fontSize: 9, fontWeight: 900, color: '#ff6b6b',
          }}>
            {compatibilityScore}%
          </div>
        )}
      </div>

      {/* Info derecha */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#18181b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {dog.nombre}
            </h3>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#71717a', margin: 0 }}>
              {dog.raza} · {edadLabel(dog.edad)}
            </p>
            {showShelterInfo && (
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ff6b6b', margin: 0 }}>
                {dog.shelterName}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span className={`cat-dog-badge ${badge.cls}`} style={{ position: 'static' }}>{badge.label}</span>
            {onToggleFavorite && <FavoriteBtn isFavorite={!!isFavorite} onClick={handleFav} />}
          </div>
        </div>

        <div style={{ width: 120 }}>
          <EnergyBar level={dog.nivelEnergia} showLabel={false} size="sm" />
        </div>

        {(dog.compatKids || dog.compatCats || dog.compatDogs) && (
          <CompatibilityGroup
            kids={dog.compatKids ?? 'maybe'}
            cats={dog.compatCats ?? 'maybe'}
            dogs={dog.compatDogs ?? 'maybe'}
            size="sm" showLabels={false}
          />
        )}

        {dog.personalityTags && dog.personalityTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {dog.personalityTags.slice(0, 4).map(tag => (
              <PersonalityTag key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

// ─── VARIANTE FEATURED ────────────────────────────────────────────────────────

function CardFeatured({ dog, isFavorite, onToggleFavorite, showShelterInfo }: DogCardProps) {
  const badge = ESTADO_BADGE[dog.estado] ?? ESTADO_BADGE.adoptado
  const handleFav = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(dog.id) }

  return (
    <Link href={`/perros/${dog.id}`} className="cat-dog-frame group">
      <div className="cat-dog-panel">
        <div style={{ position: 'relative', width: '100%', height: 220, flexShrink: 0 }}>
          <Image
            src={dog.imageUrl} alt={dog.nombre} fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#fff', lineHeight: 1.1, margin: 0 }}>{dog.nombre}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>{dog.raza}</p>
            </div>
            <span className={`cat-dog-badge ${badge.cls}`} style={{ position: 'static' }}>{badge.label}</span>
          </div>
          {onToggleFavorite && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <FavoriteBtn isFavorite={!!isFavorite} onClick={handleFav} />
            </div>
          )}
        </div>

        <div className="cat-dog-body">
          {showShelterInfo && (
            <p className="cat-dog-shelter" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>home_work</span>
              {dog.shelterName}
            </p>
          )}
          <p className="cat-dog-desc" style={{ WebkitLineClamp: 3, fontSize: '0.88rem' }}>{dog.descripcion}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            {[
              { icon: 'cake', value: edadLabel(dog.edad) },
              { icon: 'straighten', value: cap(dog.tamano) },
              { icon: dog.sexo === 'macho' ? 'male' : 'female', value: cap(dog.sexo) },
            ].map(s => (
              <span key={s.icon} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 700, color: '#52525b' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#ff6b6b' }}>{s.icon}</span>
                {s.value}
              </span>
            ))}
          </div>
          {dog.personalityTags && dog.personalityTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
              {dog.personalityTags.slice(0, 5).map(tag => (
                <PersonalityTag key={tag.id} tag={tag} size="sm" />
              ))}
            </div>
          )}
          <span className="cat-dog-cta">Conocer a {dog.nombre} →</span>
        </div>
      </div>
    </Link>
  )
}

// ─── VARIANTE COMPACT ─────────────────────────────────────────────────────────

function CardCompact({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  const handleFav = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(dog.id) }
  return (
    <Link
      href={`/perros/${dog.id}`}
      className="group"
      style={{
        display: 'block', textDecoration: 'none',
        borderRadius: '1rem', padding: 8,
        backgroundImage: "url('/assets/ui/back.jpg')",
        backgroundRepeat: 'repeat', backgroundSize: '120px auto',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        transition: 'transform 200ms ease',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = '')}
    >
      <div style={{ background: '#fff', borderRadius: '0.7rem', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
          <Image src={dog.imageUrl} alt={dog.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="160px" />
          {onToggleFavorite && (
            <div style={{ position: 'absolute', top: 6, right: 6 }}>
              <FavoriteBtn isFavorite={!!isFavorite} onClick={handleFav} />
            </div>
          )}
        </div>
        <div style={{ padding: '8px 10px' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#18181b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dog.nombre}</p>
          <p style={{ fontSize: '0.73rem', fontWeight: 600, color: '#a1a1aa', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dog.raza}</p>
        </div>
      </div>
    </Link>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DogCard(props: DogCardProps) {
  if (props.loading) return <DogCardSkeleton variant={props.variant} />
  switch (props.variant) {
    case 'list':     return <CardList     {...props} />
    case 'featured': return <CardFeatured {...props} />
    case 'compact':  return <CardCompact  {...props} />
    default:         return <CardGrid     {...props} />
  }
}

// ─── Skeleton — misma estructura visual exacta que CardGrid ─────────────────

export function DogCardSkeleton({ variant = 'grid' }: { variant?: DogCardProps['variant'] }) {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'sk-shimmer 1.5s infinite',
  } as React.CSSProperties

  return (
    <>
      <style>{`@keyframes sk-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {variant === 'compact' && (
        <div style={{
          borderRadius: '1rem', padding: 8,
          backgroundImage: "url('/assets/ui/back.jpg')",
          backgroundRepeat: 'repeat', backgroundSize: '120px auto',
        }}>
          <div style={{ background: '#fff', borderRadius: '0.7rem', overflow: 'hidden' }}>
            <div style={{ ...shimmerStyle, aspectRatio: '1/1', width: '100%' }} />
            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ ...shimmerStyle, height: 14, borderRadius: 6, width: '75%' }} />
              <div style={{ ...shimmerStyle, height: 11, borderRadius: 6, width: '50%' }} />
            </div>
          </div>
        </div>
      )}

      {variant === 'list' && (
        <div style={{ display: 'flex', gap: 14, background: '#fff', borderRadius: '1.1rem', border: '1.5px solid #f0f0f0', padding: 14 }}>
          <div style={{ ...shimmerStyle, flexShrink: 0, width: 100, height: 100, borderRadius: '0.85rem' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
            <div style={{ ...shimmerStyle, height: 16, borderRadius: 6, width: '55%' }} />
            <div style={{ ...shimmerStyle, height: 12, borderRadius: 6, width: '40%' }} />
            <div style={{ ...shimmerStyle, height: 8, borderRadius: 6, width: 120, marginTop: 4 }} />
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[1,2,3].map(i => <div key={i} style={{ ...shimmerStyle, height: 20, width: 52, borderRadius: 999 }} />)}
            </div>
          </div>
        </div>
      )}

      {(variant === 'grid' || variant === 'featured' || !variant) && (
        <div className="cat-dog-frame" style={{ pointerEvents: 'none' }}>
          <div className="cat-dog-panel">
            <div className="cat-dog-media">
              <div className="cat-dog-photo">
                <div style={{ ...shimmerStyle, position: 'absolute', inset: 0 }} />
              </div>
            </div>
            <div className="cat-dog-body" style={{ gap: 8 }}>
              {/* Badge placeholder */}
              <div style={{ ...shimmerStyle, height: 18, width: 80, borderRadius: 999, marginLeft: 'auto', marginBottom: 4 }} />
              <div style={{ ...shimmerStyle, height: 18, borderRadius: 6, width: '65%' }} />
              <div style={{ ...shimmerStyle, height: 13, borderRadius: 6, width: '50%' }} />
              <div style={{ ...shimmerStyle, height: 11, borderRadius: 6, width: '40%' }} />
              <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                {[1,2,3].map(i => <div key={i} style={{ ...shimmerStyle, height: 20, width: 58, borderRadius: 999 }} />)}
              </div>
              <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ ...shimmerStyle, width: 18, height: 18, borderRadius: 4, flexShrink: 0 }} />
                    <div style={{ ...shimmerStyle, height: 12, borderRadius: 6, flex: 1 }} />
                  </div>
                ))}
              </div>
              <div style={{ ...shimmerStyle, height: 32, borderRadius: 999, marginTop: 8 }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
