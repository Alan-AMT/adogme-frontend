// modules/shared/components/ui/Toast.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useUIStore, type Toast as ToastData } from '../../infrastructure/store/uiStore'

// ─── Configuración por tipo ───────────────────────────────────────────────────
// Basado en .auth-alert--error/success/warn/info del CSS original

const CONFIG = {
  success: {
    bg:     'bg-[#f0fdf4]',
    border: 'border-[#dcfce7]',
    text:   'text-[#15803d]',
    bar:    'bg-[#22c55e]',
    icon:   'check_circle',
  },
  error: {
    bg:     'bg-[#fef2f2]',
    border: 'border-[#fee2e2]',
    text:   'text-[#b91c1c]',
    bar:    'bg-[#ef4444]',
    icon:   'error',
  },
  warning: {
    bg:     'bg-[#fffbeb]',
    border: 'border-[#fef3c7]',
    text:   'text-[#b45309]',
    bar:    'bg-[#f59e0b]',
    icon:   'warning',
  },
  info: {
    bg:     'bg-[#eff6ff]',
    border: 'border-[#dbeafe]',
    text:   'text-[#1d4ed8]',
    bar:    'bg-[#3b82f6]',
    icon:   'info',
  },
}

// ─── Toast individual ─────────────────────────────────────────────────────────

interface ToastItemProps {
  toast:     ToastData
  onRemove:  (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [progress, setProgress] = useState(100)
  const [visible,  setVisible]  = useState(false)
  const cfg = CONFIG[toast.type]
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Entrada con pequeño delay para la animación
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  // Barra de progreso
  useEffect(() => {
    const step = 100 / (toast.duration / 50)
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p <= 0) { clearInterval(intervalRef.current!); return 0 }
        return p - step
      })
    }, 50)
    return () => clearInterval(intervalRef.current!)
  }, [toast.duration])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      className={[
        // .auth-alert base + animación slide desde derecha
        'relative overflow-hidden rounded-[14px] border shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
        'flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-[360px]',
        'transition-all duration-300',
        cfg.bg, cfg.border, cfg.text,
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      ].filter(Boolean).join(' ')}
    >
      {/* Icono */}
      <span className="material-symbols-outlined mt-0.5 flex-shrink-0"
        style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18" }}>
        {cfg.icon}
      </span>

      {/* Mensaje */}
      <p className="flex-1 text-sm font-[800] leading-snug">{toast.message}</p>

      {/* Cerrar */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity -mr-1"
        aria-label="Cerrar"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
      </button>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10">
        <div
          className={`h-full transition-[width] ease-linear ${cfg.bar}`}
          style={{ width: `${progress}%`, transitionDuration: '50ms' }}
        />
      </div>
    </div>
  )
}

// ─── ToastContainer ───────────────────────────────────────────────────────────
// Posición: fixed bottom-right — stack vertical

export function ToastContainer() {
  const toasts     = useUIStore(state => state.toasts)
  const removeToast = useUIStore(state => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 items-end"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
