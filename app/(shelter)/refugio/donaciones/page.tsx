// app/(shelter)/refugio/donaciones/page.tsx
// Redirige a perfil donde se gestiona la configuración de donaciones
import { redirect } from 'next/navigation'

export default function DonacionesPage() {
  redirect('/refugio/perfil')
}
