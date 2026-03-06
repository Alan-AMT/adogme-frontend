// app/(applicant)/mi-match/page.tsx
import type { Metadata } from 'next'
import { RecommendationsView } from '@/modules/recommendations/components/RecommendationsView'

export const metadata: Metadata = { title: 'Mis recomendaciones | aDOGme' }

export default function MiMatchPage() {
  return <RecommendationsView />
}
