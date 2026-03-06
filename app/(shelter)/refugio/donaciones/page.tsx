// app/(shelter)/refugio/donaciones/page.tsx
// Archivo 196 — Resumen de donaciones del refugio.
import type { Metadata } from 'next'
import ShelterDonationsView from '@/modules/shelter/components/ShelterDonationsView'

export const metadata: Metadata = {
  title: 'Donaciones | Portal Refugio · aDOGme',
}

export default function DonacionesPage() {
  return <ShelterDonationsView />
}
