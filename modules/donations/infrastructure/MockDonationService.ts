// modules/donations/infrastructure/MockDonationService.ts
// Archivo 212 — Implementación mock del servicio de donaciones.
//
// initiateDonation:
//   · Espera 1.5s simulando latencia del gateway de pago
//   · 5% de probabilidad de fallo (pago rechazado)
//   · Genera transactionId único (TXN-{timestamp}-{random})
//   · Agrega la donación a la copia mutable en memoria
//   · Retorna el objeto Donation creado

import type { Donation, DonationFormData, DonationSummary } from '@/modules/shared/domain/Donation'
import { MOCK_DONATIONS } from '@/modules/shared/mockData/donations.mock'
import type { IDonationService } from './IDonationService'

// ─── Estado mutable en memoria ────────────────────────────────────────────────

let _donations: Donation[] = [...MOCK_DONATIONS]
let _nextId    = Math.max(...MOCK_DONATIONS.map(d => d.id)) + 1

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

function generateTransactionId(): string {
  const ts  = Date.now()
  const rnd = Math.floor(Math.random() * 100_000).toString().padStart(5, '0')
  return `TXN-${ts}-${rnd}`
}

function currentISODate(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Implementación ───────────────────────────────────────────────────────────

export class MockDonationService implements IDonationService {

  async initiateDonation(
    data:        DonationFormData,
    refugioId:   number,
    adoptanteId: number,
    shelterInfo?: { nombre?: string; logo?: string }
  ): Promise<Donation> {
    // Simula la latencia del gateway de pago
    await delay(1500)

    // 5% de probabilidad de fallo
    if (Math.random() < 0.05) {
      throw new Error(
        'El pago fue rechazado. Verifica los datos de tu tarjeta e intenta de nuevo.'
      )
    }

    const donation: Donation = {
      id:            _nextId++,
      adoptanteId,
      refugioId,
      monto:         data.monto,
      metodoPago:    data.metodoPago,
      fecha:         currentISODate(),
      confirmado:    true,
      status:        'confirmed',
      transactionId: generateTransactionId(),
      concepto:      data.concepto,
      esAnonima:     data.esAnonima,
      refugioNombre: shelterInfo?.nombre,
      refugioLogo:   shelterInfo?.logo,
      // No exponemos el nombre del adoptante si es anónima
      adoptanteNombre: data.esAnonima ? 'Anónimo' : undefined,
    }

    _donations.push(donation)
    return donation
  }

  async getDonationsByAdoptante(adoptanteId: number): Promise<Donation[]> {
    await delay(400)
    return _donations
      .filter(d => d.adoptanteId === adoptanteId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
  }

  async getDonationsByRefugio(refugioId: number): Promise<Donation[]> {
    await delay(300)
    return _donations
      .filter(d => d.refugioId === refugioId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
  }

  async getDonationSummary(refugioId: number, metaMensual?: number): Promise<DonationSummary> {
    await delay(300)

    const confirmed = _donations.filter(
      d => d.refugioId === refugioId && d.status === 'confirmed'
    )

    const now       = new Date()
    const thisMes   = confirmed.filter(d => {
      const date = new Date(d.fecha)
      return (
        date.getMonth()     === now.getMonth() &&
        date.getFullYear()  === now.getFullYear()
      )
    })

    const totalMes       = thisMes.reduce((s, d) => s + d.monto, 0)
    const totalHistorico = confirmed.reduce((s, d) => s + d.monto, 0)

    const progresoMeta = metaMensual && metaMensual > 0
      ? Math.min(100, Math.round((totalMes / metaMensual) * 100))
      : undefined

    return {
      totalMes,
      totalHistorico,
      totalDonaciones:   confirmed.length,
      progresoMeta,
      ultimasDonaciones: confirmed
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, 5),
    }
  }
}
