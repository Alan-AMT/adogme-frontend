// modules/shared/components/dog/DogGrid.tsx
// Grid responsivo usando las clases exactas de catalog.css
// cat-grid: 1col mobile → 2col tablet → 3col desktop → 4col xl
// loading → skeletons | vacío → cat-empty | datos → DogCard

import { DogCard, DogCardSkeleton, type DogListItem } from './DogCard'

interface DogGridProps {
  dogs:                 DogListItem[]
  loading?:             boolean
  skeletonCount?:       number
  variant?:             'grid' | 'list'
  onToggleFavorite?:    (dogId: string) => void
  favorites?:           string[]
  compatibilityScores?: Record<string, number>
  showShelterInfo?:     boolean
}

// ─── EmptyState — usa clases de catalog.css ───────────────────────────────────

function EmptyDogs() {
  return (
    <div className="cat-empty" style={{ gridColumn: '1 / -1' }}>
      <p className="cat-empty__icon">🐾</p>
      <p className="cat-empty__text">No encontramos perros con esos filtros.</p>
      <p className="cat-empty__sub">Intenta ajustar tu búsqueda o limpiar los filtros.</p>
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DogGrid({
  dogs,
  loading       = false,
  skeletonCount = 9,
  variant       = 'grid',
  onToggleFavorite,
  favorites     = [],
  compatibilityScores,
  showShelterInfo = true,
}: DogGridProps) {

  // Vista lista — stack vertical, no usa cat-grid
  if (variant === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <DogCardSkeleton key={i} variant="list" />
            ))
          : dogs.length === 0
            ? (
              <div className="cat-empty">
                <p className="cat-empty__icon">🐾</p>
                <p className="cat-empty__text">No encontramos perros con esos filtros.</p>
                <p className="cat-empty__sub">Intenta ajustar tu búsqueda.</p>
              </div>
            )
            : dogs.map(dog => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  variant="list"
                  isFavorite={favorites.includes(dog.id)}
                  onToggleFavorite={onToggleFavorite}
                  compatibilityScore={compatibilityScores?.[dog.id]}
                  showShelterInfo={showShelterInfo}
                />
              ))
        }
      </div>
    )
  }

  // Vista grid — usa la clase cat-grid del catalog.css
  return (
    <div className="cat-grid">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <DogCardSkeleton key={i} variant="grid" />
          ))
        : dogs.length === 0
          ? <EmptyDogs />
          : dogs.map(dog => (
              <DogCard
                key={dog.id}
                dog={dog}
                variant="grid"
                isFavorite={favorites.includes(dog.id)}
                onToggleFavorite={onToggleFavorite}
                compatibilityScore={compatibilityScores?.[dog.id]}
                showShelterInfo={showShelterInfo}
              />
            ))
      }
    </div>
  )
}
