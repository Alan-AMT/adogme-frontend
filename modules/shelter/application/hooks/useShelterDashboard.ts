// modules/shelter/application/hooks/useShelterDashboard.ts
// Carga stats del dashboard del refugio en dos llamadas: perros y solicitudes.
'use client'

import { useEffect, useState } from 'react'
import type {
  DashboardChartPeriod,
  DashboardChartPoint,
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

export type ChartPoint = DashboardChartPoint

const PERIOD_API_MAP: Record<DashboardPeriod, DashboardChartPeriod> = {
  week: 'semana',
  month: 'mes',
  year: 'año',
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
  const [solicitudesCanceladas, setSolicitudesCanceladas] = useState(0)
  const [solicitudesRechazadas, setSolicitudesRechazadas] = useState(0)
  const [recentRequests, setRecentRequests] = useState<AdoptionRequestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [period,  setPeriod]  = useState<DashboardPeriod>('month')
  const [chartData, setChartData] = useState<ChartPoint[]>([])

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
        setSolicitudesCanceladas(reqs.solicitudesCanceladas)
        setSolicitudesRechazadas(reqs.solicitudesRechazadas)
        setRecentRequests(reqs.recentRequests)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [shelterId])

  useEffect(() => {
    if (!shelterId) return
    let cancelled = false
    shelterService
      .getDashboardRequestsChartData(shelterId, PERIOD_API_MAP[period])
      .then((points) => {
        if (!cancelled) setChartData(points)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [shelterId, period])

  return {
    dogsByStatus,
    recentDogs,
    solicitudesPendientes,
    solicitudesEnRevision,
    solicitudesCompletadas,
    solicitudesCanceladas,
    solicitudesRechazadas,
    recentRequests,
    loading,
    error,
    period,
    setPeriod,
    chartData,
  }
}
