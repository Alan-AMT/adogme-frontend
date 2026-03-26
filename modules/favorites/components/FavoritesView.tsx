// modules/favorites/components/FavoritesView.tsx
// Grid de perros favoritos del adoptante.
// Lee IDs del favoritesStore (localStorage) y carga los datos de cada perro.
// Roles: solo applicant llega aquí — el layout (applicant) redirige a los demás.
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { useFavoritesStore } from '../../shared/infrastructure/store/favoritesStore'
import { dogService }        from '../../dogs/infrastructure/DogServiceFactory'
import { Spinner }           from '../../shared/components/ui/Spinner'
import type { Dog }          from '../../shared/domain/Dog'
import '../styles/favorites.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  disponible:    { bg: '#f0fdf4', color: '#16a34a', label: 'Disponible' },
  en_proceso:    { bg: '#fffbeb', color: '#d97706', label: 'En proceso' },
  adoptado:      { bg: '#f4f4f5', color: '#71717a', label: 'Adoptado' },
  no_disponible: { bg: '#f4f4f5', color: '#71717a', label: 'No disponible' },
}

function edadLabel(meses: number): string {
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  const a = Math.floor(meses / 12)
  return `${a} ${a === 1 ? 'año' : 'años'}`
}

function dogSlug(nombre: string): string {
  return nombre.toLowerCase().replace(/\s+/g, '-')
}

// ─── FavoriteCard ─────────────────────────────────────────────────────────────

function FavoriteCard({ dog, onRemove }: { dog: Dog; onRemove: () => void }) {
  const slug  = dogSlug(dog.nombre)
  const badge = STATUS_BADGE[dog.estado] ?? STATUS_BADGE.no_disponible

  return (
    <div className="fv-card">

      {/* ── Remove button ── */}
      <button
        type="button"
        className="fv-card__remove"
        onClick={onRemove}
        aria-label={`Quitar a ${dog.nombre} de favoritos`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
      </button>

      {/* ── Photo ── */}
      <Link href={`/perros/${slug}`} className="fv-card__photo">
        <Image
          src={dog.foto}
          alt={dog.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 220px"
        />
        <span
          className="fv-card__badge"
          style={{ background: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>
      </Link>

      {/* ── Body ── */}
      <div className="fv-card__body">
        <Link href={`/perros/${slug}`} className="fv-card__name">
          {dog.nombre}
        </Link>
        <p className="fv-card__breed">
          {dog.raza}
          {dog.refugioNombre ? ` · ${dog.refugioNombre}` : ''}
        </p>
        <p className="fv-card__meta">
          {edadLabel(dog.edad)} · {dog.tamano} · {dog.sexo}
        </p>

        {/* Adopt CTA — solo si disponible */}
        {dog.estado === 'disponible' && (
          <div className="fv-card__adopt-btn">
            <Link href={`/adoptar/${dog.id}`} className="fv-card__adopt-link">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>favorite</span>
              Quiero adoptarlo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="fv-empty">
      <span
        className="material-symbols-outlined fv-empty__icon"
      >
        favorite
      </span>
      <h2 className="fv-empty__title">Aún no tienes favoritos</h2>
      <p className="fv-empty__sub">
        Guarda los perros que más te gustan presionando el corazón en cada perfil.
      </p>
      <Link href="/perros" className="fv-empty__btn">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
        Explorar perros
      </Link>
    </div>
  )
}

// ─── FavoritesView ────────────────────────────────────────────────────────────

export default function FavoritesView() {
  const { favoriteIds, toggleFavorite, clearFavorites } = useFavoritesStore()
  const [dogs,    setDogs]    = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)

  // Carga los perros favoritos cada vez que cambia la lista de IDs
  useEffect(() => {
    if (favoriteIds.length === 0) {
      setDogs([])
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all(favoriteIds.map(id => dogService.getDogById(id)))
      .then(results => setDogs(results.filter((d): d is Dog => d !== null)))
      .catch(() => setDogs([]))
      .finally(() => setLoading(false))
  }, [favoriteIds])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fv-page">
        <div className="fv-header">
          <div>
            <h1 className="fv-header__title">Mis favoritos</h1>
          </div>
        </div>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (dogs.length === 0) {
    return (
      <div className="fv-page">
        <div className="fv-header">
          <div>
            <h1 className="fv-header__title">Mis favoritos</h1>
            <p className="fv-header__sub">Aún no has guardado ningún perro</p>
          </div>
        </div>
        <EmptyState />
      </div>
    )
  }

  // ── Grid ───────────────────────────────────────────────────────────────────
  const disponibles = dogs.filter(d => d.estado === 'disponible').length

  return (
    <div className="fv-page">

      {/* ── Header ── */}
      <div className="fv-header">
        <div>
          <h1 className="fv-header__title">Mis favoritos</h1>
          <p className="fv-header__sub">
            {dogs.length} {dogs.length === 1 ? 'perro guardado' : 'perros guardados'}
            {disponibles > 0 && (
              <> · <span style={{ color: '#16a34a', fontWeight: 700 }}>{disponibles} disponible{disponibles !== 1 ? 's' : ''}</span></>
            )}
          </p>
        </div>

        <button
          type="button"
          className="fv-clear-btn"
          onClick={clearFavorites}
        >
          <span className="material-symbols-outlined">delete_sweep</span>
          Limpiar todo
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="fv-grid">
        {dogs.map(dog => (
          <FavoriteCard
            key={dog.id}
            dog={dog}
            onRemove={() => toggleFavorite(dog.id)}
          />
        ))}
      </div>
    </div>
  )
}
