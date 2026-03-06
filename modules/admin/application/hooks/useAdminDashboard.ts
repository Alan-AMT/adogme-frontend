'use client'
// modules/admin/application/hooks/useAdminDashboard.ts
// Carga las estadísticas globales para el dashboard de admin.

import { useEffect, useState } from 'react'
import type { AdminStats }     from '../../infrastructure/IAdminService'
import { adminService }        from '../../infrastructure/AdminServiceFactory'

export interface UseAdminDashboardReturn {
  stats:     AdminStats | null
  isLoading: boolean
  error:     string | null
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [stats,     setStats]     = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    adminService.getStats()
      .then(s  => setStats(s))
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { stats, isLoading, error }
}
