'use client'
// modules/admin/application/hooks/useAdminDogs.ts
// Lista global de perros + acción para cambiar estado (publicar/despublicar/moderar).

import { useCallback, useEffect, useState } from 'react'
import type { Dog, DogStatus } from '@/modules/shared/domain/Dog'
import { adminService }        from '../../infrastructure/AdminServiceFactory'

export interface UseAdminDogsReturn {
  dogs:        Dog[]
  isLoading:   boolean
  isUpdating:  boolean
  error:       string | null
  updateStatus:(id: string, status: DogStatus) => Promise<void>
}

export function useAdminDogs(): UseAdminDogsReturn {
  const [dogs,       setDogs]       = useState<Dog[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const load = useCallback(async () => {
    const data = await adminService.getAllDogs()
    setDogs(data)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    load()
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [load])

  const updateStatus = useCallback(async (id: string, status: DogStatus) => {
    setIsUpdating(true)
    try   { await adminService.updateDogStatus(id, status); await load() }
    finally { setIsUpdating(false) }
  }, [load])

  return { dogs, isLoading, isUpdating, error, updateStatus }
}
