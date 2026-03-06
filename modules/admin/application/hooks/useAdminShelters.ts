'use client'
// modules/admin/application/hooks/useAdminShelters.ts
// Lista completa de refugios + acciones de aprobación, rechazo y suspensión.

import { useCallback, useEffect, useState } from 'react'
import type { Shelter }   from '@/modules/shared/domain/Shelter'
import { adminService }   from '../../infrastructure/AdminServiceFactory'

export interface UseAdminSheltersReturn {
  shelters:   Shelter[]
  isLoading:  boolean
  isUpdating: boolean
  error:      string | null
  approve:    (id: number, nota?: string) => Promise<void>
  reject:     (id: number, nota?: string) => Promise<void>
  suspend:    (id: number, nota?: string) => Promise<void>
}

export function useAdminShelters(): UseAdminSheltersReturn {
  const [shelters,   setShelters]   = useState<Shelter[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const load = useCallback(async () => {
    const data = await adminService.getAllShelters()
    setShelters(data)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    load()
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [load])

  const approve = useCallback(async (id: number, nota?: string) => {
    setIsUpdating(true)
    try   { await adminService.approveShelter(id, nota); await load() }
    finally { setIsUpdating(false) }
  }, [load])

  const reject = useCallback(async (id: number, nota?: string) => {
    setIsUpdating(true)
    try   { await adminService.rejectShelter(id, nota); await load() }
    finally { setIsUpdating(false) }
  }, [load])

  const suspend = useCallback(async (id: number, nota?: string) => {
    setIsUpdating(true)
    try   { await adminService.suspendShelter(id, nota); await load() }
    finally { setIsUpdating(false) }
  }, [load])

  return { shelters, isLoading, isUpdating, error, approve, reject, suspend }
}
