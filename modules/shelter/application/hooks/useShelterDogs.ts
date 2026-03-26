// modules/shelter/application/hooks/useShelterDogs.ts
// Archivo 174 — CRUD completo de perros del refugio.
// Estado: dogs, loading, selectedDog
// Acciones: createDog, updateDog, deleteDog (con confirm), togglePublish
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { DogListItem, DogStatus } from '@/modules/shared/domain/Dog'
import type { DogCreateData, DogUpdateData } from '../../infrastructure/IShelterService'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'

const CURRENT_SHELTER_ID = 1

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
  updateDog:     (id: number, data: DogUpdateData) => Promise<void>
  deleteDog:     (id: number) => Promise<void>
  togglePublish: (id: number) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShelterDogs(): UseShelterDogsReturn {
  const [dogs,         setDogs]         = useState<DogListItem[]>([])
  const [isLoading,    setIsLoading]    = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [selectedDog,  setSelectedDog]  = useState<DogListItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<DogStatusFilter>('all')
  const [search,       setSearch]       = useState('')

  // ── Carga (lectura) ──────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await shelterService.getShelterDogs(CURRENT_SHELTER_ID, {
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
  }, [statusFilter, search])

  useEffect(() => { load() }, [load])

  // ── Mutaciones ────────────────────────────────────────────────────────────────

  const createDog = useCallback(async (data: DogCreateData) => {
    setError(null)
    try {
      await shelterService.createDog({ ...data, refugioId: CURRENT_SHELTER_ID })
      await load()
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al crear el perro')
      throw e
    }
  }, [load])

  const updateDog = useCallback(async (id: number, data: DogUpdateData) => {
    setError(null)
    try {
      await shelterService.updateDog(id, data)
      await load()
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al actualizar el perro')
      throw e
    }
  }, [load])

  const deleteDog = useCallback(async (id: number) => {
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

  const togglePublish = useCallback(async (id: number) => {
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
