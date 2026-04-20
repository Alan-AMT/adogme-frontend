// modules/shared/infrastructure/store/favoritesStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Favoritos del adoptante — persiste en localStorage
// DogCard lo usa para mostrar el corazón relleno/vacío
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { create } from 'zustand'

const LS_KEY = 'adogme:favorites'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FavoritesState {
  favoriteIds:     string[]
  toggleFavorite:  (dogId: string) => void
  isFavorite:      (dogId: string) => boolean
  clearFavorites:  () => void
  hydrate:         () => void   // lee de localStorage al montar
}

// ─── Helpers de localStorage ──────────────────────────────────────────────────

function readFromLS(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeToLS(ids: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(ids))
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],

  toggleFavorite: (dogId) => {
    const { favoriteIds } = get()
    const next = favoriteIds.includes(dogId)
      ? favoriteIds.filter(id => id !== dogId)
      : [...favoriteIds, dogId]

    writeToLS(next)
    set({ favoriteIds: next })
  },

  isFavorite: (dogId) => get().favoriteIds.includes(dogId),

  clearFavorites: () => {
    writeToLS([])
    set({ favoriteIds: [] })
  },

  hydrate: () => {
    set({ favoriteIds: readFromLS() })
  },
}))
