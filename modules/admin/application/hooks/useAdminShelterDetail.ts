'use client'
// modules/admin/application/hooks/useAdminShelterDetail.ts
// Carga un refugio por ID y expone acción para cambiar su estado.

import { useCallback, useEffect, useState } from 'react'
import type { Shelter, ShelterStatus } from '@/modules/shared/domain/Shelter'
import { adminService }               from '../../infrastructure/AdminServiceFactory'

export interface UseAdminShelterDetailReturn {
  shelter:      Shelter | null
  isLoading:    boolean
  isSaving:     boolean
  error:        string | null
  success:      boolean
  updateStatus: (status: ShelterStatus, nota: string) => Promise<void>
}

export function useAdminShelterDetail(id: number): UseAdminShelterDetailReturn {
  const [shelter,   setShelter]   = useState<Shelter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving,  setIsSaving]  = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  useEffect(() => {
    setIsLoading(true)
    adminService.getShelterById(id)
      .then(s  => setShelter(s))
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [id])

  const updateStatus = useCallback(async (status: ShelterStatus, nota: string) => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      let updated: Shelter
      if      (status === 'approved')  updated = await adminService.approveShelter(id, nota)
      else if (status === 'rejected')  updated = await adminService.rejectShelter(id, nota)
      else if (status === 'suspended') updated = await adminService.suspendShelter(id, nota)
      else throw new Error('Estado no soportado')
      setShelter(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al guardar')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [id])

  return { shelter, isLoading, isSaving, error, success, updateStatus }
}
