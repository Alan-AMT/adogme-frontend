// app/(shelter)/refugio/perros/[id]/editar/page.tsx
// Archivo 192 — Formulario de edición de un perro existente.
import type { Metadata } from 'next'
import ShelterDogFormView from '@/modules/shelter/components/ShelterDogFormView'

export const metadata: Metadata = {
  title: 'Editar perro | Portal Refugio · aDOGme',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarPerroPage({ params }: Props) {
  const { id } = await params
  const dogId = parseInt(id, 10)

  return <ShelterDogFormView dogId={isNaN(dogId) ? undefined : dogId} />
}
