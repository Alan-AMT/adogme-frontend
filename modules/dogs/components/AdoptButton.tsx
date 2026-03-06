// modules/dogs/components/AdoptButton.tsx
// Botón de adopción con lógica de rol — client component aislado
// Mantiene DogDetailView como server component
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../shared/infrastructure/store/authStore'

interface Props {
  dogId:    number
  dogNombre: string
  className?: string
}

export default function AdoptButton({ dogId, dogNombre, className = '' }: Props) {
  const hydrate = useAuthStore(s => s.hydrate)
  const user    = useAuthStore(s => s.user)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hydrate()
    setReady(true)
  }, [hydrate])

  // Mientras hidrata, muestra el botón de forma optimista (se comportará como visitor)
  if (!ready) {
    return (
      <Link
        href={`/login?redirect=${encodeURIComponent(`/adoptar/${dogId}`)}`}
        className={`dp-adopt-btn ${className}`}
      >
        Quiero adoptar a {dogNombre}
      </Link>
    )
  }

  // Shelter y admin: no pueden solicitar adopciones
  if (user?.role === 'shelter' || user?.role === 'admin') {
    return null
  }

  // Applicant — ir directo al formulario
  if (user?.role === 'applicant') {
    return (
      <Link href={`/adoptar/${dogId}`} className={`dp-adopt-btn ${className}`}>
        Quiero adoptar a {dogNombre}
      </Link>
    )
  }

  // Visitor (no autenticado o role='visitor') — redirigir al login con redirect
  const redirectUrl = encodeURIComponent(`/adoptar/${dogId}`)
  return (
    <Link
      href={`/login?redirect=${redirectUrl}`}
      className={`dp-adopt-btn ${className}`}
    >
      Quiero adoptar a {dogNombre}
    </Link>
  )
}
