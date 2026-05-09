// app/(applicant)/adoptar/[dogId]/page.tsx
// Obtiene el perro por ID y renderiza el formulario multi-paso de adopción.
// El layout (applicant) ya garantiza que el usuario sea 'applicant'.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { dogService } from '@/modules/dogs/infrastructure/DogServiceFactory'
import { DogNotFoundError } from '@/modules/dogs/infrastructure/IDogService'
import AdoptionFormView from '@/modules/adoption/components/AdoptionFormView'

type Props = { params: Promise<{ dogId: string }> }

async function loadDog(dogId: string) {
  try {
    return await dogService.getDogById(dogId)
  } catch (e) {
    if (e instanceof DogNotFoundError) notFound()
    throw e
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dogId } = await params
  const dog = await loadDog(dogId)
  return { title: `Adoptar a ${dog.nombre} | aDOGme` }
}

export default async function AdoptarPage({ params }: Props) {
  const { dogId } = await params

  const dog = await loadDog(dogId)

  // Solo perros disponibles pueden recibir solicitudes
  if (dog.estado !== 'disponible') notFound()

  return (
    <AdoptionFormView
      perroId={dog.id}
      refugioId={dog.refugioId}
      perroNombre={dog.nombre}
      perroRaza={dog.raza}
      perroFoto={dog.foto ?? null}
      refugioNombre={dog.refugioNombre ?? ''}
      refugioLogo={dog.refugioLogo ?? null}
      dogVector={dog.dogVector ?? null}
    />
  )
}
