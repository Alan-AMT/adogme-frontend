// app/(applicant)/adoptar/[dogId]/page.tsx
// Obtiene el perro por ID y renderiza el formulario multi-paso de adopción.
// El layout (applicant) ya garantiza que el usuario sea 'applicant'.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { dogService } from '@/modules/dogs/infrastructure/DogServiceFactory'
import AdoptionFormView from '@/modules/adoption/components/AdoptionFormView'

type Props = { params: Promise<{ dogId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dogId } = await params
  const id  = parseInt(dogId, 10)
  const dog = isNaN(id) ? null : await dogService.getDogById(id)
  const nombre = dog?.nombre ?? 'Adopción'
  return { title: `Adoptar a ${nombre} | aDOGme` }
}

export default async function AdoptarPage({ params }: Props) {
  const { dogId } = await params
  const id = parseInt(dogId, 10)

  if (isNaN(id)) notFound()

  const dog = await dogService.getDogById(id)

  if (!dog) notFound()

  // Solo perros disponibles pueden recibir solicitudes
  if (dog.estado !== 'disponible') notFound()

  return <AdoptionFormView dog={dog} />
}
