// modules/shelter/application/hooks/useShelterDashboard.ts
// Carga stats del dashboard del refugio en dos llamadas: perros y solicitudes.
'use client'

import { useEffect, useState } from 'react'
import type {
  DashboardDogsByStatus,
  DashboardDogsStats,
  DashboardRequestsStats,
} from '../../infrastructure/IShelterService'
import type { AdoptionRequestListItem } from '../../../shared/domain/AdoptionRequest'
import type { DogListItem } from '../../../shared/domain/Dog'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'
import { useAuth } from '../../../shared/application/hooks/useAuth'
import { useAuthStore } from '../../../shared/infrastructure/store/authStore'

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export type DashboardPeriod = 'week' | 'month' | 'year'

export interface ChartPoint {
  label: string
  value: number
}

// ─── Datos mock fijos para el LineChart (solicitudes por tiempo) ──────────────
// Opción A: el filtrado por período se mantiene client-side mientras el
// backend no exponga este dato.

const SOLICITUDES_CHART: Record<DashboardPeriod, ChartPoint[]> = {
  week: [
    { label: 'Lun', value: 2 }, { label: 'Mar', value: 5 },
    { label: 'Mié', value: 3 }, { label: 'Jue', value: 7 },
    { label: 'Vie', value: 4 }, { label: 'Sáb', value: 8 },
    { label: 'Dom', value: 1 },
  ],
  month: [
    { label: 'Sem 1', value: 12 }, { label: 'Sem 2', value: 18 },
    { label: 'Sem 3', value:  9 }, { label: 'Sem 4', value: 15 },
  ],
  year: [
    { label: 'Ene', value:  8 }, { label: 'Feb', value: 12 },
    { label: 'Mar', value: 15 }, { label: 'Abr', value: 22 },
    { label: 'May', value: 18 }, { label: 'Jun', value: 25 },
    { label: 'Jul', value: 30 }, { label: 'Ago', value: 28 },
    { label: 'Sep', value: 20 }, { label: 'Oct', value: 35 },
    { label: 'Nov', value: 42 }, { label: 'Dic', value: 38 },
  ],
}

const EMPTY_DOGS_BY_STATUS: DashboardDogsByStatus = {
  disponible: 0,
  en_proceso: 0,
  adoptado: 0,
  no_disponible: 0,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShelterDashboard() {
  const { shelterId } = useAuth()
  const hydrate = useAuthStore((s) => s.hydrate)

  const [dogsByStatus, setDogsByStatus]   = useState<DashboardDogsByStatus>(EMPTY_DOGS_BY_STATUS)
  const [recentDogs, setRecentDogs]       = useState<DogListItem[]>([])
  const [solicitudesPendientes, setSolicitudesPendientes] = useState(0)
  const [solicitudesEnRevision, setSolicitudesEnRevision] = useState(0)
  const [solicitudesCompletadas, setSolicitudesCompletadas] = useState(0)
  const [recentRequests, setRecentRequests] = useState<AdoptionRequestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [period,  setPeriod]  = useState<DashboardPeriod>('month')

  // Si la sesión no trae shelterId aún, intenta re-hidratar una vez.
  useEffect(() => {
    if (!shelterId) {
      void hydrate()
    }
  }, [shelterId, hydrate])

  useEffect(() => {
    if (!shelterId) {
      setLoading(false)
      setError('No se pudo identificar el refugio en tu sesión.')
      return
    }

    setLoading(true)
    setError(null)

    Promise.all([
      shelterService.getDashboardDogsStats(shelterId),
      shelterService.getDashboardRequestsStats(shelterId),
    ])
      .then(([dogs, reqs]: [DashboardDogsStats, DashboardRequestsStats]) => {
        setDogsByStatus(dogs.dogsByStatus)
        setRecentDogs(dogs.recentDogs)
        setSolicitudesPendientes(reqs.solicitudesPendientes)
        setSolicitudesEnRevision(reqs.solicitudesEnRevision)
        setSolicitudesCompletadas(reqs.solicitudesCompletadas)
        setRecentRequests(reqs.recentRequests)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [shelterId])

  return {
    dogsByStatus,
    recentDogs,
    solicitudesPendientes,
    solicitudesEnRevision,
    solicitudesCompletadas,
    recentRequests,
    loading,
    error,
    period,
    setPeriod,
    chartData: SOLICITUDES_CHART[period],
  }
}
