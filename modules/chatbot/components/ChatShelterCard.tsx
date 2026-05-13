// modules/chatbot/components/ChatShelterCard.tsx
// Tarjeta compacta de un refugio embebida en el mensaje del bot.
'use client'

import Link from 'next/link'
import type { ChatShelterCard as ShelterCard } from '../domain/Chatbot'

interface Props {
  shelter: ShelterCard
}

export default function ChatShelterCard({ shelter }: Props) {
  const photo = shelter.imageUrl ?? shelter.logo

  return (
    <Link href={`/refugios/${shelter.id}`} className="cb-card cb-card--shelter">
      <div className="cb-card__media">
        {photo
          ? <img src={photo} alt={shelter.name} />
          : <div className="cb-card__placeholder">🏠</div>
        }
      </div>
      <div className="cb-card__body">
        <p className="cb-card__title">{shelter.name}</p>
        {shelter.municipality && (
          <p className="cb-card__meta">📍 {shelter.municipality}</p>
        )}
        {shelter.schedule && (
          <p className="cb-card__sub">🕒 {shelter.schedule}</p>
        )}
        {shelter.phone && (
          <p className="cb-card__sub">📞 {shelter.phone}</p>
        )}
      </div>
    </Link>
  )
}
