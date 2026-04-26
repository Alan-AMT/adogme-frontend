// modules/chatbot/components/ChatDogCard.tsx
// Tarjeta compacta de un perro embebida en el mensaje del bot.
'use client'

import Link from 'next/link'
import type { ChatDogCard as DogCard } from '../domain/Chatbot'

interface Props {
  dog: DogCard
}

export default function ChatDogCard({ dog }: Props) {
  const meta = [dog.breed, dog.age, dog.sex].filter(Boolean).join(' · ')

  return (
    <Link href={`/perros/${dog.id}`} className="cb-card cb-card--dog">
      <div className="cb-card__media">
        {dog.photo_url
          ? <img src={dog.photo_url} alt={dog.name} />
          : <div className="cb-card__placeholder">🐶</div>
        }
      </div>
      <div className="cb-card__body">
        <p className="cb-card__title">{dog.name}</p>
        {meta && <p className="cb-card__meta">{meta}</p>}
        {dog.shelter_name && (
          <p className="cb-card__sub">📍 {dog.shelter_name}</p>
        )}
      </div>
    </Link>
  )
}
