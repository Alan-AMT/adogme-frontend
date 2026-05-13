// modules/chatbot/components/ChatDogCard.tsx
// Tarjeta compacta de un perro embebida en el mensaje del bot.
'use client'

import Link from 'next/link'
import type { ChatDogCard as DogCard } from '../domain/Chatbot'

interface Props {
  dog: DogCard
}

// La edad viene del backend en MESES.
function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`
  const years = Math.round(months / 12)
  return `${years} ${years === 1 ? 'año' : 'años'}`
}

function cap(s?: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Acepta 0-1 (0.95) o 0-100 (95). Devuelve entero porcentual.
function toPercent(score: number): number {
  const pct = score <= 1 ? score * 100 : score
  return Math.max(0, Math.min(100, Math.round(pct)))
}

// Tono del badge según el match.
function scoreTone(pct: number): string {
  if (pct >= 80) return 'cb-card__score--high'
  if (pct >= 60) return 'cb-card__score--mid'
  return 'cb-card__score--low'
}

export default function ChatDogCard({ dog }: Props) {
  const meta = [
    dog.breed,
    typeof dog.age === 'number' ? formatAge(dog.age) : undefined,
    cap(dog.sex),
  ].filter(Boolean).join(' · ')

  const sub = [cap(dog.size), dog.shelterName].filter(Boolean).join(' · ')

  const hasScore = typeof dog.compatibility_score === 'number'
  const pct      = hasScore ? toPercent(dog.compatibility_score!) : 0

  return (
    <Link href={`/perros/${dog.id}`} className="cb-card cb-card--dog">
      {hasScore && (
        <span className={`cb-card__score ${scoreTone(pct)}`}>{pct}% match</span>
      )}
      <div className="cb-card__media">
        {dog.photo
          ? <img src={dog.photo} alt={dog.name} />
          : <div className="cb-card__placeholder">🐶</div>
        }
      </div>
      <div className="cb-card__body">
        <p className="cb-card__title">{dog.name}</p>
        {meta && <p className="cb-card__meta">{meta}</p>}
        {sub  && <p className="cb-card__sub">📍 {sub}</p>}
      </div>
    </Link>
  )
}
