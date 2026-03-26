// modules/donations/application/hooks/useDonationHistory.ts
// B1 — Hook para el historial de donaciones del adoptante autenticado.

import { useEffect, useState } from 'react'
import { donationService } from '@/modules/donations/infrastructure/DonationServiceFactory'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import type { Donation } from '@/modules/shared/domain/Donation'

interface UseDonationHistoryReturn {
  donations:  Donation[]
  isLoading:  boolean
  error:      string | null
  refresh:    () => void
}

export function useDonationHistory(): UseDonationHistoryReturn {
  const user = useAuthStore(s => s.user)

  const [donations,  setDonations]  = useState<Donation[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [tick,       setTick]       = useState(0)

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    donationService.getDonationsByAdoptante(user.id)
      .then(data => { if (!cancelled) setDonations(data) })
      .catch(() => { if (!cancelled) setError('No se pudo cargar el historial de donaciones') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [user?.id, tick])

  const refresh = () => setTick(t => t + 1)

  return { donations, isLoading, error, refresh }
}
