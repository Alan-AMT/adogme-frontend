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

export interface UseShelterDogsReturn {
  // Estado
  dogs:            DogListItem[]
  isLoading:       boolean
  error:           string | null
  selectedDog:     DogListItem | null
  statusFilter:    DogStatusFilter
  search:          string

  // Filtros
  setStatusFilter: (f: DogStatusFilter) => void
  setSearch:       (s: string) => void
  setSelectedDog:  (d: DogListItem | null) => void

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

  const [dogs,         setDogs]         = useState<DogListItem[]>([])
  const [isLoading,    setIsLoading]    = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [selectedDog,  setSelectedDog]  = useState<DogListItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<DogStatusFilter>('all')
  const [search,       setSearch]       = useState('')

  // ── Carga (lectura) ──────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    if (!shelterId) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await shelterService.getShelterDogs(shelterId, {
        estado: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        limit:  100,
      })
      setDogs(result.data)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al cargar perros')
    } finally {
      setIsLoading(false)
    }
  }, [shelterId, statusFilter, search])

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
    statusFilter, search,
    setStatusFilter, setSearch, setSelectedDog,
    refetch: load,
    createDog, updateDog, deleteDog, togglePublish,
  }
}
