// app/(shelter)/refugio/perfil/page.tsx
// Archivo 197 — Edición del perfil público del refugio.
import type { Metadata } from 'next'
import ShelterProfileView from '@/modules/shelter/components/ShelterProfileView'

export const metadata: Metadata = {
  title: 'Perfil del refugio | Portal Refugio · aDOGme',
}

export default function PerfilPage() {
  return <ShelterProfileView />
}
