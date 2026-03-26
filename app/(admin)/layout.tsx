// app/(admin)/layout.tsx
// Archivo 200 — Verifica sesión y rol admin antes de renderizar el portal.
// Guards: sin sesión → /login · rol incorrecto → /
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/modules/shared/infrastructure/session'
import { AdminPortalLayout } from '@/modules/admin/components/AdminPortalLayout'

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession()

  if (!session)                redirect('/login')
  if (session.role !== 'admin') redirect('/')

  return <AdminPortalLayout>{children}</AdminPortalLayout>
}
