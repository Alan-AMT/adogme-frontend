// modules/shelter/application/hooks/useShelterDashboard.ts
// Archivo 172 — Carga stats del refugio con selector de período reactivo.
'use client'

import { useEffect, useState } from 'react'
import type { ShelterDashboardStats } from '../../infrastructure/IShelterService'
import type { AdoptionRequestListItem } from '../../../shared/domain/AdoptionRequest'
import { shelterService } from '../../infrastructure/ShelterServiceFactory'

const CURRENT_SHELTER_ID = "1"

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export type DashboardPeriod = 'week' | 'month' | 'year'

export interface ChartPoint {
  label: string
  value: number
}

// ─── Datos mock fijos para el LineChart (solicitudes por tiempo) ──────────────

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

// Donaciones acumuladas según el período seleccionado (mock)
const DONACIONES_PERIODO: Record<DashboardPeriod, number> = {
  week:   850,
  month: 3200,
  year: 28500,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShelterDashboard() {
  const [stats,    setStats]    = useState<ShelterDashboardStats | null>(null)
  const [requests, setRequests] = useState<AdoptionRequestListItem[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [period,   setPeriod]   = useState<DashboardPeriod>('month')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      shelterService.getDashboardStats(CURRENT_SHELTER_ID),
      shelterService.getRecentRequests(CURRENT_SHELTER_ID, 5),
    ])
      .then(([s, r]) => {
        // Inyecta las donaciones del período seleccionado
        setStats({ ...s, donacionesEstemes: DONACIONES_PERIODO[period] })
        setRequests(r)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  return {
    stats,
    requests,
    loading,
    error,
    period,
    setPeriod,
    chartData:  SOLICITUDES_CHART[period],
    refugioId:  CURRENT_SHELTER_ID,
  }
}
