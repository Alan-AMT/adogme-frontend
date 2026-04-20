// modules/adoption/application/hooks/useMyRequests.ts
// Lista y detalle de solicitudes del adoptante autenticado
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AdoptionRequest, AdoptionRequestListItem } from '../../../shared/domain/AdoptionRequest'
import { adoptionService } from '../../infrastructure/AdoptionServiceFactory'
import { useAuthStore } from '../../../shared/infrastructure/store/authStore'

// ─── Lista de mis solicitudes ─────────────────────────────────────────────────

export function useMyRequests() {
  const user = useAuthStore(s => s.user)

  const [requests,  setRequests]  = useState<AdoptionRequestListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) { setIsLoading(false); return }
    setIsLoading(true)
    setError(null)
    try {
      const data = await adoptionService.getMyRequests(user.id)
      setRequests(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  return { requests, isLoading, error, refetch: load }
}

// ─── Detalle de una solicitud ─────────────────────────────────────────────────

export function useRequestDetail(id: string) {
  const user = useAuthStore(s => s.user)

  const [request,   setRequest]   = useState<AdoptionRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    // D1 — pasar adoptanteId para validar ownership en el servicio
    adoptionService
      .getById(id, user?.id)
      .then(setRequest)
      .catch(e => setError(e instanceof Error ? e.message : 'Error al cargar solicitud'))
      .finally(() => setIsLoading(false))
  }, [id])

  const cancel = useCallback(
    async (motivo?: string) => {
      if (!request) return
      setCancelling(true)
      setError(null)
      try {
        // D2 — pasar adoptanteId requerido para validar ownership
        const updated = await adoptionService.cancel(request.id, user?.id ?? "", motivo)
        setRequest(updated)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cancelar')
      } finally {
        setCancelling(false)
      }
    },
    [request],
  )

  return { request, isLoading, error, cancelling, cancel }
}
