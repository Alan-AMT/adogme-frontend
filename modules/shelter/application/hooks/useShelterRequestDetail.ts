// modules/shelter/application/hooks/useShelterRequestDetail.ts
// Archivo 169 — hook para el detalle de una solicitud + cambio de estado.
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { AdoptionRequest, RequestStatus } from '@/modules/shared/domain/AdoptionRequest'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'

export interface UseShelterRequestDetailReturn {
  request:      AdoptionRequest | null
  isLoading:    boolean
  isSaving:     boolean
  error:        string | null
  updateStatus: (status: RequestStatus, comentario?: string) => Promise<void>
}

export function useShelterRequestDetail(id: string): UseShelterRequestDetailReturn {
  const [request,   setRequest]   = useState<AdoptionRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving,  setIsSaving]  = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    shelterService.getRequestById(id)
      .then(r => setRequest(r))
      .catch((e: Error) => setError(e.message ?? 'Error al cargar solicitud'))
      .finally(() => setIsLoading(false))
  }, [id])

  const updateStatus = useCallback(async (status: RequestStatus, comentario?: string) => {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await shelterService.updateRequestStatus(id, status, comentario)
      setRequest(updated)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al actualizar estado')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [id])

  return { request, isLoading, isSaving, error, updateStatus }
}
