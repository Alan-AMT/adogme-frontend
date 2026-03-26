// modules/shared/components/ui/EmptyState.tsx
// Basado en .cat-empty del catálogo CSS
'use client'

import type { ReactNode } from 'react';

interface EmptyStateAction { label: string; onClick: () => void }

interface EmptyStateProps {
  illustration?: ReactNode
  title:         string
  description?:  string
  action?:       EmptyStateAction
  size?:         'sm' | 'md' | 'lg'
}

const SIZE_CLS = {
  sm: 'py-8',
  md: 'py-12',  // .cat-empty: padding 4rem
  lg: 'py-16',
}

export function EmptyState({ illustration, title, description, action, size = 'md' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-3 px-4 ${SIZE_CLS[size]}`}>
      {/* .cat-empty__icon */}
      {illustration ?? (
        <span className="text-5xl select-none" aria-hidden>🐾</span>
      )}
      {/* .cat-empty__text */}
      <p className="text-lg font-[800] text-[#3f3f46]">{title}</p>
      {/* .cat-empty__sub */}
      {description && <p className="text-sm text-[#a1a1aa] font-[500]">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-5 py-2.5 rounded-full bg-[var(--brand)] text-white text-sm font-[800]
                     hover:bg-[var(--brand-600)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// ─── Variantes predefinidas ───────────────────────────────────────────────────

export const EMPTY_STATES = {
  noDogs:       { title: 'No hay perros disponibles', description: 'Vuelve pronto, los refugios actualizan su catálogo constantemente.' },
  noRequests:   { title: 'Sin solicitudes todavía',   description: 'Cuando envíes una solicitud de adopción aparecerá aquí.' },
  noFavorites:  { title: 'Sin favoritos',              description: 'Guarda perros que te interesen con el corazón para verlos aquí.' },
  noMessages:   { title: 'Sin mensajes',               description: 'Aquí aparecerán tus conversaciones con los refugios.' },
  noResults:    { title: 'Sin resultados',             description: 'Intenta con otros filtros o busca un nombre diferente.' },
  noDonations:  { title: 'Sin donaciones todavía',     description: 'Apoya un refugio para que este historial cobre vida.' },
}
