// modules/shelter/application/hooks/useShelterDogs.ts
// Archivo 174 — CRUD completo de perros del refugio.
// Estado: dogs, loading, selectedDog
// Acciones: createDog, updateDog, deleteDog (con confirm), togglePublish
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { DogListItem, DogStatus } from '@/modules/shared/domain/Dog'
import type { DogCreateData, DogUpdateData } from '../../infrastructure/IShelterService'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type DogStatusFilter = 'all' | DogStatus

export interface DogsPagination {
  page:       number
  totalPages: number
  total:      number
  limit:      number
}

export interface UseShelterDogsReturn {
  // Estado
  dogs:            DogListItem[]
  isLoading:       boolean
  error:           string | null
  selectedDog:     DogListItem | null
  statusFilter:    DogStatusFilter
  search:          string
  pagination:      DogsPagination

  // Filtros
  setStatusFilter: (f: DogStatusFilter) => void
  setSearch:       (s: string) => void
  setSelectedDog:  (d: DogListItem | null) => void
  setPage:         (p: number) => void

  // Lectura
  refetch:         () => Promise<void>

  // Mutaciones
  createDog:     (data: DogCreateData) => Promise<void>
  updateDog:     (id: string, data: DogUpdateData) => Promise<void>
  deleteDog:     (id: string) => Promise<void>
  togglePublish: (id: string) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShelterDogs(): UseShelterDogsReturn {
  const { user, hydrate } = useAuthStore()
  const shelterId = user?.role === 'shelter' ? user.shelterId ?? '' : ''

  useEffect(() => {
    if (!shelterId) hydrate()
  }, [])

  const [dogs,            setDogs]            = useState<DogListItem[]>([])
  const [isLoading,       setIsLoading]       = useState(true)
  const [error,           setError]           = useState<string | null>(null)
  const [selectedDog,     setSelectedDog]     = useState<DogListItem | null>(null)
  const [statusFilter,    setStatusFilterRaw] = useState<DogStatusFilter>('all')
  const [search,          setSearchRaw]       = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page,            setPage]            = useState(1)
  const [pagination,      setPagination]      = useState<DogsPagination>({
    page: 1, totalPages: 1, total: 0, limit: 0,
  })

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 600)
    return () => clearTimeout(t)
  }, [search])

  // Cambiar filtros vuelve a la primera página (resetea junto al cambio para
  // evitar una doble carga al cambiar de status estando en una página > 1)
  const setStatusFilter = useCallback((f: DogStatusFilter) => {
    setStatusFilterRaw(f)
    setPage(1)
  }, [])

  const setSearch = useCallback((s: string) => {
    setSearchRaw(s)
    setPage(1)
  }, [])

  // ── Carga (lectura) ──────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    if (!shelterId) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await shelterService.getShelterDogs(shelterId, {
        estado: statusFilter === 'all' ? undefined : statusFilter,
        search: debouncedSearch || undefined,
        page,
        limit: 20,
      })
      setDogs(result.data)
      setPagination({
        page:       result.page,
        totalPages: result.totalPages,
        total:      result.total,
        limit:      result.limit,
      })
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al cargar perros')
    } finally {
      setIsLoading(false)
    }
  }, [shelterId, statusFilter, debouncedSearch, page])

  useEffect(() => { load() }, [load])

  // ── Mutaciones ────────────────────────────────────────────────────────────────

  const createDog = useCallback(async (data: DogCreateData) => {
    setError(null)
    try {
      await shelterService.createDog({ ...data, refugioId: shelterId })
      await load()
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al crear el perro')
      throw e
    }
  }, [load])

  const updateDog = useCallback(async (id: string, data: DogUpdateData) => {
    setError(null)
    try {
      await shelterService.updateDog(id, data)
      await load()
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al actualizar el perro')
      throw e
    }
  }, [load])

  const deleteDog = useCallback(async (id: string) => {
    setError(null)
    try {
      await shelterService.deleteDog(id)
      if (selectedDog?.id === id) setSelectedDog(null)
      await load()
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al eliminar el perro')
      throw e
    }
  }, [selectedDog, load])

  const togglePublish = useCallback(async (id: string) => {
    setError(null)
    try {
      await shelterService.togglePublish(id)
      await load()
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al cambiar el estado del perro')
      throw e
    }
  }, [load])

  return {
    dogs, isLoading, error, selectedDog,
    statusFilter, search, pagination,
    setStatusFilter, setSearch, setSelectedDog, setPage,
    refetch: load,
    createDog, updateDog, deleteDog, togglePublish,
  }
}
