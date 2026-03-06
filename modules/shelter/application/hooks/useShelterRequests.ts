// modules/shelter/application/hooks/useShelterRequests.ts
// Archivo 184 — hook para la lista completa de solicitudes del refugio.
// Filtros: por estado, por perro (dogFilter), por búsqueda de texto.
// Acción: updateRequestStatus(id, status, comentario?) — actualiza en el servicio y refresca.
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { AdoptionRequestListItem, RequestStatus } from '@/modules/shared/domain/AdoptionRequest'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'

const CURRENT_SHELTER_ID = 1

export type RequestFilter = 'all' | RequestStatus

export interface UseShelterRequestsReturn {
  requests:    AdoptionRequestListItem[]
  filtered:    AdoptionRequestListItem[]
  isLoading:   boolean
  error:       string | null
  filter:      RequestFilter
  dogFilter:   number | null
  search:      string
  isUpdating:  boolean
  updateError: string | null
  setFilter:    (f: RequestFilter) => void
  setDogFilter: (id: number | null) => void
  setSearch:    (s: string) => void
  updateRequestStatus: (id: number, status: RequestStatus, comentario?: string) => Promise<void>
  refetch:     () => Promise<void>
}

export function useShelterRequests(): UseShelterRequestsReturn {
  const [requests,    setRequests]    = useState<AdoptionRequestListItem[]>([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [filter,      setFilter]      = useState<RequestFilter>('all')
  const [dogFilter,   setDogFilter]   = useState<number | null>(null)
  const [search,      setSearch]      = useState('')
  const [isUpdating,  setIsUpdating]  = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await shelterService.getShelterRequests(CURRENT_SHELTER_ID)
      setRequests(data)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.estado !== filter) return false
    if (dogFilter !== null && r.perroId !== dogFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const matchesText =
        (r.perroNombre     ?? '').toLowerCase().includes(q) ||
        (r.adoptanteNombre ?? '').toLowerCase().includes(q)
      if (!matchesText) return false
    }
    return true
  })

  const updateRequestStatus = useCallback(async (
    id:          number,
    status:      RequestStatus,
    comentario?: string,
  ) => {
    setIsUpdating(true)
    setUpdateError(null)
    try {
      await shelterService.updateRequestStatus(id, status, comentario)
      // Refresh list to reflect the new status
      const data = await shelterService.getShelterRequests(CURRENT_SHELTER_ID)
      setRequests(data)
    } catch (e: unknown) {
      setUpdateError((e as Error).message ?? 'Error al actualizar solicitud')
      throw e
    } finally {
      setIsUpdating(false)
    }
  }, [])

  return {
    requests, filtered, isLoading, error,
    filter, dogFilter, search,
    isUpdating, updateError,
    setFilter, setDogFilter, setSearch,
    updateRequestStatus,
    refetch: load,
  }
}
