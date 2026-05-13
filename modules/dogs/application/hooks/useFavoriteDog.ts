'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { apiClient } from '@/modules/shared/infrastructure/api/apiClient'
import { API_ENDPOINTS } from '@/modules/shared/infrastructure/api/endpoints'
import type { Adoptante } from '@/modules/shared/domain/User'

const DEBOUNCE_MS = 800

export function useFavoriteDog(dogId: string) {
  const user              = useAuthStore(s => s.user)
  const patchFavoriteDogs = useAuthStore(s => s.patchFavoriteDogs)

  const adoptante        = user?.role === 'applicant' ? (user as Adoptante) : null
  const serverIsFavorite = adoptante?.favoriteDogs?.includes(dogId) ?? false

  const [isFavorite, setIsFavorite] = useState(serverIsFavorite)
  const [loading, setLoading]       = useState(false)

  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<boolean | null>(null)

  // Keep in sync with server state when no local toggle is in flight
  useEffect(() => {
    if (pendingRef.current === null) {
      setIsFavorite(serverIsFavorite)
    }
  }, [serverIsFavorite])

  const toggle = useCallback(() => {
    const applicantId = adoptante?.applicantId
    if (!applicantId) return

    const next = !isFavorite
    const prevFavorites = adoptante?.favoriteDogs ?? []
    const optimisticFavorites = next
      ? [...prevFavorites, dogId]
      : prevFavorites.filter(id => id !== dogId)

    // Optimistic: update both local state and authStore immediately
    setIsFavorite(next)
    patchFavoriteDogs(optimisticFavorites)
    pendingRef.current = next

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      const target = pendingRef.current
      if (target === null) return

      const endpoint = target
        ? API_ENDPOINTS.APPLICANTS.ADD_FAVORITE(applicantId, dogId)
        : API_ENDPOINTS.APPLICANTS.REMOVE_FAVORITE(applicantId, dogId)

      setLoading(true)
      try {
        const { data } = await apiClient.patch<{ favoriteDogs?: string[] }>(endpoint)
        if (Array.isArray(data.favoriteDogs)) {
          patchFavoriteDogs(data.favoriteDogs)
        }
      } catch {
        // Revert both
        setIsFavorite(!target)
        patchFavoriteDogs(prevFavorites)
      } finally {
        setLoading(false)
        pendingRef.current = null
      }
    }, DEBOUNCE_MS)
  }, [isFavorite, adoptante, dogId, patchFavoriteDogs])

  return { isFavorite, toggle, loading }
}
