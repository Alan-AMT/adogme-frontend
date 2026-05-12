// app/(public)/refugios/[id]/donar/page.tsx
import { notFound } from 'next/navigation'
import { shelterService } from '@/modules/shelter/infrastructure/ShelterServiceFactory'
import DonationView from '@/modules/donations/components/DonationView'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params
  try {
    const shelter = await shelterService.getShelterById(id)
    return {
      title: `Donar a ${shelter.nombre} | aDOGme`,
      description: shelter.donationConfig.descripcionCausa ?? `Apoya a ${shelter.nombre} con tu donación.`,
    }
  } catch {
    return { title: 'Donar | aDOGme' }
  }
}

export default async function DonationPage({ params }: { params: Params }) {
  const { id } = await params

  let shelter
  try {
    shelter = await shelterService.getShelterById(id)
  } catch {
    notFound()
  }

  if (!shelter.donationConfig.aceptaDonaciones) {
    notFound()
  }

  return (
    <div className="dn-page-wrap">
      <DonationView shelter={shelter} />
    </div>
  )
}
