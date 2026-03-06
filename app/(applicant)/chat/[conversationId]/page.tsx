// app/(applicant)/chat/[conversationId]/page.tsx
// Archivo 167 — página del chat de una conversación específica.
import type { Metadata } from 'next'
import ChatView from '@/modules/messaging/components/ChatView'

export const metadata: Metadata = { title: 'Mensajes | aDOGme' }

interface Props {
  params: Promise<{ conversationId: string }>
}

export default async function ChatPage({ params }: Props) {
  const { conversationId } = await params
  const id = parseInt(conversationId, 10)

  return <ChatView conversationId={isNaN(id) ? 0 : id} />
}
