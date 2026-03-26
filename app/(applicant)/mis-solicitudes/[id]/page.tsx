// app/(applicant)/mis-solicitudes/[id]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdoptionDetailView from '@/modules/adoption/components/AdoptionDetailView'

export const metadata: Metadata = { title: 'Detalle de solicitud | aDOGme' }

type Props = { params: Promise<{ id: string }> }

export default async function SolicitudDetailPage({ params }: Props) {
  const { id } = await params
  const requestId = parseInt(id, 10)

  if (isNaN(requestId)) notFound()

  return <AdoptionDetailView requestId={requestId} />
}
