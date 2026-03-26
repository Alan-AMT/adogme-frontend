// app/(shelter)/refugio/mensajes/page.tsx
// El chat fue reemplazado por WhatsApp directo — redirige al dashboard.
import { redirect } from 'next/navigation'

export default function MensajesPage() {
  redirect('/refugio/dashboard')
}
