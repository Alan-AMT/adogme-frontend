// modules/donations/infrastructure/IDonationService.ts
// Contrato del servicio de donaciones.

import type { Donation, DonationFormData, DonationSummary } from '@/modules/shared/domain/Donation'

export interface IDonationService {
  /**
   * Inicia el flujo de pago. Espera ~1.5s (simula gateway).
   * Lanza error si el pago es rechazado (5% de probabilidad en mock).
   */
  initiateDonation(
    data:        DonationFormData,
    refugioId:   number,
    adoptanteId: number,
    shelterInfo?: { nombre?: string; logo?: string }
  ): Promise<Donation>

  /** Historial de donaciones del adoptante autenticado. */
  getDonationsByAdoptante(adoptanteId: number): Promise<Donation[]>

  /** Todas las donaciones recibidas por un refugio (para dashboard/tabla). */
  getDonationsByRefugio(refugioId: number): Promise<Donation[]>

  /** Resumen de donaciones del refugio (para dashboard). */
  getDonationSummary(refugioId: number, metaMensual?: number): Promise<DonationSummary>
}
