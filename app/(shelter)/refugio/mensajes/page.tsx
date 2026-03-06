// app/(shelter)/refugio/mensajes/page.tsx
// Archivo 195 — Mensajes del refugio con adoptantes.
import type { Metadata } from 'next'
import ShelterMessagesView from '@/modules/shelter/components/ShelterMessagesView'

export const metadata: Metadata = {
  title: 'Mensajes | Portal Refugio · aDOGme',
}

export default function MensajesPage() {
  return <ShelterMessagesView />
}
