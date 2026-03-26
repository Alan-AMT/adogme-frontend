// app/(applicant)/favoritos/page.tsx
import type { Metadata } from 'next'
import FavoritesView from '@/modules/favorites/components/FavoritesView'

export const metadata: Metadata = { title: 'Mis favoritos | aDOGme' }

export default function FavoritosPage() {
  return <FavoritesView />
}
