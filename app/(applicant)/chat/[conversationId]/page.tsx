// app/(applicant)/chat/[conversationId]/page.tsx
// El chat fue reemplazado por WhatsApp directo — redirige a mis solicitudes.
import { redirect } from 'next/navigation'

export default function ChatPage() {
  redirect('/mis-solicitudes')
}
