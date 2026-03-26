// app/(admin)/admin/perros/[id]/editar/page.tsx
// Archivo 210 — Moderación de un perro: info completa + cambio de estado.
import AdminDogEditView from '@/modules/admin/components/AdminDogEditView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminDogEditPage({ params }: Props) {
  const { id } = await params
  return <AdminDogEditView id={parseInt(id, 10)} />
}
