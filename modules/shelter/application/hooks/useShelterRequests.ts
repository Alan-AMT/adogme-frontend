// modules/shelter/application/hooks/useShelterRequests.ts
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type {
  AdoptionRequestListItem,
  PaginatedResult,
  RequestStatus,
} from '@/modules/shared/domain/AdoptionRequest'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'
import { useAuth } from '../../../shared/application/hooks/useAuth'

const DEFAULT_LIMIT = 12

export type RequestFilter = 'all' | RequestStatus

export interface UseShelterRequestsReturn {
  result:      PaginatedResult<AdoptionRequestListItem> | null
  filtered:    AdoptionRequestListItem[]
  isLoading:   boolean
  error:       string | null
  filter:      RequestFilter
  search:      string
  page:        number
  isUpdating:  boolean
  updateError: string | null
  setFilter:    (f: RequestFilter) => void
  setSearch:    (s: string) => void
  setPage:      (p: number) => void
  updateRequestStatus: (id: string, status: RequestStatus, comentario?: string) => Promise<void>
  refetch:     () => Promise<void>
}

export function useShelterRequests(): UseShelterRequestsReturn {
  const { shelterId } = useAuth()
  const [result,      setResult]      = useState<PaginatedResult<AdoptionRequestListItem> | null>(null)
  const [isLoading,   setIsLoading]   = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [filter,      setFilterState] = useState<RequestFilter>('all')
  const [search,      setSearchState] = useState('')
  const [page,        setPageState]   = useState(1)
  const [isUpdating,  setIsUpdating]  = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const searchRef = useRef(search)
  searchRef.current = search

  const load = useCallback(async (currentPage: number, currentFilter: RequestFilter, currentSearch: string) => {
    if (!shelterId) return
    setIsLoading(true)
    setError(null)
    try {
      const status = currentFilter !== 'all' ? currentFilter as RequestStatus : undefined
      const data = await shelterService.getShelterRequests(
        shelterId,
        currentPage,
        DEFAULT_LIMIT,
        status,
        currentSearch || undefined,
      )
      setResult(data)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }, [shelterId])

  useEffect(() => {
    const id = setTimeout(() => { load(page, filter, search) }, 350)
    return () => clearTimeout(id)
  }, [load, page, filter, search])

  const setSearch = useCallback((s: string) => {
    setSearchState(s)
    setPageState(1)
  }, [])

  const setFilter = useCallback((f: RequestFilter) => {
    setFilterState(f)
    setPageState(1)
  }, [])

  const setPage = useCallback((p: number) => {
    setPageState(p)
  }, [])

  const filtered = result?.data ?? []

  const updateRequestStatus = useCallback(async (
    id:          string,
    status:      RequestStatus,
    comentario?: string,
  ) => {
    if (!shelterId) throw new Error('No hay refugio activo')
    setIsUpdating(true)
    setUpdateError(null)
    try {
      await shelterService.updateRequestStatus(id, shelterId, status, comentario)
      await load(page, filter, searchRef.current)
    } catch (e: unknown) {
      setUpdateError((e as Error).message ?? 'Error al actualizar solicitud')
      throw e
    } finally {
      setIsUpdating(false)
    }
  }, [load, page, filter, shelterId])

  return {
    result, filtered, isLoading, error,
    filter, search, page,
    isUpdating, updateError,
    setFilter, setSearch, setPage,
    updateRequestStatus,
    refetch: () => load(page, filter, searchRef.current),
  }
}
