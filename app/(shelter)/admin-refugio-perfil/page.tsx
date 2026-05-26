// app/(shelter)/admin-refugio-perfil/page.tsx
import type { Metadata } from 'next'
import ShelterAdminProfileView from '@/modules/shelter/components/AdminProfileView'

export const metadata: Metadata = { title: 'Perfil del administrador del refugio | aDOGme' }

export default function AdminRefugioPerfilPage() {
    return <ShelterAdminProfileView />
}
