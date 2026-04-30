// modules/dogs/components/AdoptButton.tsx
// Botón de adopción con lógica de rol — client component aislado
// Mantiene DogDetailView como server component
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../shared/infrastructure/store/authStore'
import AdoptLoginPrompt from './AdoptLoginPrompt'

function BtnContent({ nombre }: { nombre: string }) {
  return (
    <>
      <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20" }}>
        pets
      </span>
      Quiero adoptar a {nombre}
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
        arrow_forward
      </span>
    </>
  )
}

interface Props {
  dogId:     string
  dogNombre: string
  className?: string
}

export default function AdoptButton({ dogId, dogNombre, className = '' }: Props) {
  const user    = useAuthStore(s => s.user)
  const [ready,     setReady]     = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  // Shelter y admin: no pueden solicitar adopciones
  if (ready && (user?.role === 'shelter' || user?.role === 'admin')) {
    return null
  }

  // Applicant — ir directo al formulario
  if (ready && user?.role === 'applicant') {
    return (
      <Link href={`/adoptar/${dogId}`} className={`dp-adopt-btn ${className}`}>
        <BtnContent nombre={dogNombre} />
      </Link>
    )
  }

  // Visitor (no autenticado, role='visitor', o mientras hidrata) — abrir modal
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`dp-adopt-btn ${className}`}
      >
        <BtnContent nombre={dogNombre} />
      </button>

      {showModal && (
        <AdoptLoginPrompt
          dogNombre={dogNombre}
          dogId={dogId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
