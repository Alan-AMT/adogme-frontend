// app/(applicant)/mi-match/quiz/page.tsx
import type { Metadata } from 'next'
import LifestyleQuizView from '@/modules/recommendations/components/LifestyleQuizView'

export const metadata: Metadata = { title: 'Quiz de compatibilidad | aDOGme' }

export default function MiMatchQuizPage() {
  return <LifestyleQuizView />
}
