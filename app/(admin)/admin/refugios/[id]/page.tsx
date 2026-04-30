// app/(admin)/admin/refugios/[id]/page.tsx
// Archivo 208 — Detalle de refugio: info completa + panel de decisión + historial.
import AdminShelterDetailView from '@/modules/admin/components/AdminShelterDetailView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminShelterDetailPage({ params }: Props) {
  const { id } = await params
  return <AdminShelterDetailView id={id} />
}
