// modules/shared/mockData/donations.mock.ts
// 20 donaciones de los últimos 3 meses distribuidas entre los 5 refugios

import type { Donation, DonationSummary } from '../domain/Donation'
import { SHELTER_IDS } from './shelters.mock'

export const MOCK_DONATIONS: Donation[] = [
  // Noviembre 2024
  { id: 1, adoptanteId: 101, refugioId: SHELTER_IDS.HUELLITAS, monto: 500, metodoPago: 'tarjeta',
    fecha: '2024-11-03', confirmado: true, status: 'confirmed',
    transactionId: 'txn_001', concepto: 'Para vacunas de los cachorros', esAnonima: false,
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'Ana García' },
  { id: 2, adoptanteId: 102, refugioId: SHELTER_IDS.PATITAS, monto: 200, metodoPago: 'paypal',
    fecha: '2024-11-08', confirmado: true, status: 'confirmed',
    transactionId: 'txn_002', esAnonima: true,
    refugioNombre: 'Patitas Libres', adoptanteNombre: 'Anónimo' },
  { id: 3, adoptanteId: 103, refugioId: SHELTER_IDS.SEGUNDA, monto: 1000, metodoPago: 'transferencia',
    fecha: '2024-11-12', confirmado: true, status: 'confirmed',
    transactionId: 'txn_003', concepto: 'Con mucho cariño para los perros fronterizos', esAnonima: false,
    refugioNombre: 'Segunda Oportunidad', adoptanteNombre: 'Laura Soto' },
  { id: 4, adoptanteId: 104, refugioId: SHELTER_IDS.AMIGOS, monto: 350, metodoPago: 'tarjeta',
    fecha: '2024-11-18', confirmado: true, status: 'confirmed',
    transactionId: 'txn_004', esAnonima: false,
    refugioNombre: 'Amigos de 4 Patas', adoptanteNombre: 'María Hernández' },
  { id: 5, adoptanteId: 105, refugioId: SHELTER_IDS.ESPERANZA, monto: 150, metodoPago: 'paypal',
    fecha: '2024-11-25', confirmado: true, status: 'confirmed',
    transactionId: 'txn_005', esAnonima: true,
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Anónimo' },
  { id: 6, adoptanteId: 106, refugioId: SHELTER_IDS.HUELLITAS, monto: 750, metodoPago: 'transferencia',
    fecha: '2024-11-28', confirmado: false, status: 'pending',
    esAnonima: false, refugioNombre: 'Huellitas MX', adoptanteNombre: 'Roberto Díaz' },

  // Diciembre 2024
  { id: 7, adoptanteId: 101, refugioId: SHELTER_IDS.PATITAS, monto: 300, metodoPago: 'tarjeta',
    fecha: '2024-12-05', confirmado: true, status: 'confirmed',
    transactionId: 'txn_007', concepto: 'Navidad para los perritos', esAnonima: false,
    refugioNombre: 'Patitas Libres', adoptanteNombre: 'Ana García' },
  { id: 8, adoptanteId: 107, refugioId: SHELTER_IDS.ESPERANZA, monto: 500, metodoPago: 'tarjeta',
    fecha: '2024-12-10', confirmado: true, status: 'confirmed',
    transactionId: 'txn_008', concepto: 'Felices fiestas', esAnonima: false,
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Sofía Torres' },
  { id: 9, adoptanteId: 108, refugioId: SHELTER_IDS.SEGUNDA, monto: 2000, metodoPago: 'tarjeta',
    fecha: '2024-12-15', confirmado: true, status: 'confirmed',
    transactionId: 'txn_009', concepto: 'Donación de fin de año', esAnonima: false,
    refugioNombre: 'Segunda Oportunidad', adoptanteNombre: 'Javier Morales' },
  { id: 10, adoptanteId: 109, refugioId: SHELTER_IDS.HUELLITAS, monto: 100, metodoPago: 'paypal',
    fecha: '2024-12-18', confirmado: true, status: 'confirmed',
    transactionId: 'txn_010', esAnonima: true,
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'Anónimo' },
  { id: 11, adoptanteId: 110, refugioId: SHELTER_IDS.AMIGOS, monto: 600, metodoPago: 'transferencia',
    fecha: '2024-12-22', confirmado: true, status: 'confirmed',
    transactionId: 'txn_011', concepto: 'Para las fiestas de los peludos', esAnonima: false,
    refugioNombre: 'Amigos de 4 Patas', adoptanteNombre: 'Pedro Ramírez' },
  { id: 12, adoptanteId: 102, refugioId: SHELTER_IDS.ESPERANZA, monto: 250, metodoPago: 'tarjeta',
    fecha: '2024-12-28', confirmado: true, status: 'confirmed',
    transactionId: 'txn_012', esAnonima: false,
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Carlos Méndez' },
  { id: 13, adoptanteId: 103, refugioId: SHELTER_IDS.PATITAS, monto: 400, metodoPago: 'paypal',
    fecha: '2024-12-30', confirmado: false, status: 'failed',
    esAnonima: false, refugioNombre: 'Patitas Libres', adoptanteNombre: 'Laura Soto' },

  // Enero 2025
  { id: 14, adoptanteId: 101, refugioId: SHELTER_IDS.HUELLITAS, monto: 1500, metodoPago: 'tarjeta',
    fecha: '2025-01-05', confirmado: true, status: 'confirmed',
    transactionId: 'txn_014', concepto: 'Año nuevo, nueva esperanza', esAnonima: false,
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'Ana García' },
  { id: 15, adoptanteId: 104, refugioId: SHELTER_IDS.SEGUNDA, monto: 500, metodoPago: 'transferencia',
    fecha: '2025-01-08', confirmado: true, status: 'confirmed',
    transactionId: 'txn_015', esAnonima: false,
    refugioNombre: 'Segunda Oportunidad', adoptanteNombre: 'María Hernández' },
  { id: 16, adoptanteId: 111, refugioId: SHELTER_IDS.AMIGOS, monto: 200, metodoPago: 'paypal',
    fecha: '2025-01-10', confirmado: true, status: 'confirmed',
    transactionId: 'txn_016', esAnonima: true,
    refugioNombre: 'Amigos de 4 Patas', adoptanteNombre: 'Anónimo' },
  { id: 17, adoptanteId: 105, refugioId: SHELTER_IDS.PATITAS, monto: 800, metodoPago: 'tarjeta',
    fecha: '2025-01-12', confirmado: true, status: 'confirmed',
    transactionId: 'txn_017', esAnonima: false,
    refugioNombre: 'Patitas Libres', adoptanteNombre: 'Roberto Díaz' },
  { id: 18, adoptanteId: 106, refugioId: SHELTER_IDS.ESPERANZA, monto: 300, metodoPago: 'tarjeta',
    fecha: '2025-01-15', confirmado: true, status: 'confirmed',
    transactionId: 'txn_018', concepto: 'Para los cachorros nuevos', esAnonima: false,
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Sofía Torres' },
  { id: 19, adoptanteId: 107, refugioId: SHELTER_IDS.HUELLITAS, monto: 450, metodoPago: 'paypal',
    fecha: '2025-01-18', confirmado: true, status: 'confirmed',
    transactionId: 'txn_019', esAnonima: false,
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'Javier Morales' },
  { id: 20, adoptanteId: 101, refugioId: SHELTER_IDS.SEGUNDA, monto: 1000, metodoPago: 'tarjeta',
    fecha: '2025-01-22', confirmado: true, status: 'confirmed',
    transactionId: 'txn_020', concepto: 'Para los perritos de la frontera', esAnonima: false,
    refugioNombre: 'Segunda Oportunidad', adoptanteNombre: 'Ana García' },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getDonationsByShelterId = (refugioId: number): Donation[] =>
  MOCK_DONATIONS.filter(d => d.refugioId === refugioId)

export const getDonationsByAdoptante = (adoptanteId: number): Donation[] =>
  MOCK_DONATIONS.filter(d => d.adoptanteId === adoptanteId)

export const getDonationSummary = (refugioId: number, metaMensual?: number): DonationSummary => {
  const todas = getDonationsByShelterId(refugioId).filter(d => d.status === 'confirmed')
  const enero2025 = todas.filter(d => d.fecha.startsWith('2025-01'))
  const totalMes = enero2025.reduce((sum, d) => sum + d.monto, 0)
  const totalHistorico = todas.reduce((sum, d) => sum + d.monto, 0)
  return {
    totalMes,
    totalHistorico,
    totalDonaciones: todas.length,
    progresoMeta: metaMensual ? Math.min(100, Math.round((totalMes / metaMensual) * 100)) : undefined,
    ultimasDonaciones: todas.slice(-5).reverse(),
  }
}
