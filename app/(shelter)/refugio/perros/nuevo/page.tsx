// app/(shelter)/refugio/perros/nuevo/page.tsx
// Archivo 191 — Formulario para agregar un nuevo perro.
import type { Metadata } from 'next'
import ShelterDogFormView from '@/modules/shelter/components/ShelterDogFormView'

export const metadata: Metadata = {
  title: 'Nuevo perro | Portal Refugio · aDOGme',
}

export default function NuevoPerroPage() {
  return <ShelterDogFormView />
}
