// app/(public)/refugios/[id]/donar/page.tsx
// Archivo 217 — Página pública de donación a un refugio.
// Guards: refugio no encontrado → 404; donationConfig.aceptaDonaciones = false → 404
import { notFound } from 'next/navigation'
import { getShelterById } from '@/modules/shared/mockData/shelters.mock'
import DonationView from '@/modules/donations/components/DonationView'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params
  const shelter  = getShelterById(id)
  if (!shelter) return { title: 'Donar | aDOGme' }
  return {
    title: `Donar a ${shelter.nombre} | aDOGme`,
    description: shelter.donationConfig.descripcionCausa ?? `Apoya a ${shelter.nombre} con tu donación.`,
  }
}

export default async function DonationPage({ params }: { params: Params }) {
  const { id }  = await params
  const shelter   = getShelterById(id)

  if (!shelter || !shelter.donationConfig.aceptaDonaciones) {
    notFound()
  }

  return (
    <div className="dn-page-wrap">
      <DonationView shelter={shelter} />
    </div>
  )
}
