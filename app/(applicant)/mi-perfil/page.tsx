// app/(applicant)/mi-perfil/page.tsx
import type { Metadata } from 'next'
import ProfileView from '@/modules/profile/components/ProfileView'

export const metadata: Metadata = { title: 'Mi perfil | aDOGme' }

export default function MiPerfilPage() {
  return <ProfileView />
}
