// app/(shelter)/refugio/solicitudes/[id]/page.tsx
// Archivo 194 — Detalle de una solicitud de adopción.
import type { Metadata } from 'next'
import ShelterRequestDetailView from '@/modules/shelter/components/ShelterRequestDetailView'

export const metadata: Metadata = {
  title: 'Detalle de solicitud | Portal Refugio · aDOGme',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function SolicitudDetailPage({ params }: Props) {
  const { id } = await params
  const requestId = parseInt(id, 10)

  return <ShelterRequestDetailView requestId={isNaN(requestId) ? 0 : requestId} />
}
