// app/(public)/refugios/[slug]/donar/page.tsx
// Archivo 217 — Página pública de donación a un refugio.
// Guards: refugio no encontrado → 404; donationConfig.aceptaDonaciones = false → 404
import { notFound } from 'next/navigation'
import { getShelterBySlug } from '@/modules/shared/mockData/shelters.mock'
import DonationView from '@/modules/donations/components/DonationView'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const shelter  = getShelterBySlug(slug)
  if (!shelter) return { title: 'Donar | aDOGme' }
  return {
    title: `Donar a ${shelter.nombre} | aDOGme`,
    description: shelter.donationConfig.descripcionCausa ?? `Apoya a ${shelter.nombre} con tu donación.`,
  }
}

export default async function DonationPage({ params }: { params: Params }) {
  const { slug }  = await params
  const shelter   = getShelterBySlug(slug)

  if (!shelter || !shelter.donationConfig.aceptaDonaciones) {
    notFound()
  }

  return <DonationView shelter={shelter} />
}
