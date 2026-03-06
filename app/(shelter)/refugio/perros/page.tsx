// app/(shelter)/refugio/perros/page.tsx
// Archivo 190 — Gestión del catálogo de perros del refugio.
import type { Metadata } from 'next'
import ShelterDogsView from '@/modules/shelter/components/ShelterDogsView'

export const metadata: Metadata = {
  title: 'Mis perros | Portal Refugio · aDOGme',
}

export default function PerrosPage() {
  return <ShelterDogsView />
}
