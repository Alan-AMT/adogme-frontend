// app/(shelter)/refugio/solicitudes/page.tsx
// Archivo 193 — Lista de todas las solicitudes del refugio.
import type { Metadata } from 'next'
import ShelterRequestsView from '@/modules/shelter/components/ShelterRequestsView'

export const metadata: Metadata = {
  title: 'Solicitudes | Portal Refugio · aDOGme',
}

export default function SolicitudesPage() {
  return <ShelterRequestsView />
}
