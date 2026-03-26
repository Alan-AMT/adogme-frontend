// app/(applicant)/mis-donaciones/page.tsx
import type { Metadata } from 'next'
import DonationHistoryView from '@/modules/donations/components/DonationHistoryView'

export const metadata: Metadata = { title: 'Mis donaciones | aDOGme' }

export default function MisDonacionesPage() {
  return <DonationHistoryView />
}
