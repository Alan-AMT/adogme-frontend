// modules/shelter/application/hooks/useShelterProfile.ts
// Archivo 171 — hook para cargar y actualizar el perfil del refugio.
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Shelter } from '@/modules/shared/domain/Shelter'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'

const CURRENT_SHELTER_ID = 1

export interface UseShelterProfileReturn {
  shelter:     Shelter | null
  isLoading:   boolean
  isSaving:    boolean
  error:       string | null
  success:     boolean
  saveProfile: (data: Partial<Shelter>) => Promise<void>
}

export function useShelterProfile(): UseShelterProfileReturn {
  const [shelter,   setShelter]   = useState<Shelter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving,  setIsSaving]  = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  useEffect(() => {
    setIsLoading(true)
    shelterService.getShelterProfile(CURRENT_SHELTER_ID)
      .then(s => setShelter(s))
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  const saveProfile = useCallback(async (data: Partial<Shelter>) => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const updated = await shelterService.updateShelterProfile(CURRENT_SHELTER_ID, data)
      setShelter(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al guardar perfil')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  return { shelter, isLoading, isSaving, error, success, saveProfile }
}
