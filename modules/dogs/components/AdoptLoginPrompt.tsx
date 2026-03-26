// modules/dogs/components/AdoptLoginPrompt.tsx
// Modal intermediario para visitantes que intentan adoptar.
// Muestra mensaje amigable antes de redirigir a login/registro.
'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface Props {
  dogNombre: string
  dogId: number
  onClose: () => void
}

export default function AdoptLoginPrompt({ dogNombre, dogId, onClose }: Props) {
  const redirect = encodeURIComponent(`/adoptar/${dogId}`)

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-[400px] rounded-[24px] bg-white overflow-hidden"
        style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}
      >
        {/* Header decorativo */}
        <div
          className="px-6 pt-7 pb-5 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(160deg, #fff5f5 0%, #fff 60%)' }}
        >
          {/* Icono */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)', boxShadow: '0 8px 20px rgba(255,107,107,0.35)' }}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: 30, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 30" }}
            >
              pets
            </span>
          </div>

          <h2 className="text-[20px] font-[900] text-[#111827] leading-tight tracking-[-0.02em]">
            ¡{dogNombre} te está esperando!
          </h2>
          <p className="text-[13.5px] text-[#6b7280] mt-2 leading-relaxed max-w-[300px]">
            Para iniciar el proceso de adopción necesitas una cuenta.
            Es gratis y solo toma un minuto.
          </p>
        </div>

        {/* Beneficios */}
        <div className="px-6 py-4 flex flex-col gap-2.5">
          {[
            { icon: 'verified_user', text: 'Procesos de adopción responsables y verificados' },
            { icon: 'chat',          text: 'Comunicación directa con el refugio' },
            { icon: 'favorite',      text: 'Guarda tus perritos favoritos' },
          ].map(({ icon, text }) => (
            <div key={icon} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: '#fff5f5' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, color: '#ff6b6b', fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 16" }}
                >
                  {icon}
                </span>
              </div>
              <p className="text-[12.5px] font-[700] text-[#374151]">{text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="px-6 pb-6 flex flex-col gap-2.5 pt-1">
          <Link
            href={`/login?redirect=${redirect}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-white text-[13.5px] font-[900] transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)', boxShadow: '0 10px 22px rgba(255,107,107,0.3)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 17" }}>
              login
            </span>
            Iniciar sesión
          </Link>

          <Link
            href={`/registro?redirect=${redirect}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-[#ff6b6b] text-[13.5px] font-[900] border-2 border-[#ffd5d5] transition-colors hover:bg-[#fff5f5]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
              person_add
            </span>
            Registrarse gratis
          </Link>

          <button
            onClick={onClose}
            className="text-[12px] font-[700] text-[#9ca3af] mt-1 hover:text-[#6b7280] transition-colors"
          >
            Ahora no
          </button>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-colors"
          aria-label="Cerrar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      </div>
    </div>
  )
}
