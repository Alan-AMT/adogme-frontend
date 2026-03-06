// modules/shared/components/ui/ToastContainer.tsx
// Notificaciones tipo toast — lee desde uiStore
'use client'

import { useUIStore } from '@/modules/shared/infrastructure/store/uiStore'
import type { Toast, ToastType } from '@/modules/shared/infrastructure/store/uiStore'
import { useEffect, useState } from 'react'

// ─── Config visual por tipo ────────────────────────────────────────────────────
const TOAST_CFG: Record<ToastType, {
  bg: string; border: string; iconColor: string; textColor: string; icon: string
}> = {
  success: { bg: '#f0fdf4', border: '#dcfce7', iconColor: '#16a34a', textColor: '#15803d', icon: 'check_circle'   },
  error:   { bg: '#fef2f2', border: '#fee2e2', iconColor: '#dc2626', textColor: '#b91c1c', icon: 'error'           },
  warning: { bg: '#fffbeb', border: '#fef3c7', iconColor: '#d97706', textColor: '#b45309', icon: 'warning'         },
  info:    { bg: '#eff6ff', border: '#dbeafe', iconColor: '#2563eb', textColor: '#1d4ed8', icon: 'info'            },
}

// ─── Toast individual ─────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const cfg = TOAST_CFG[toast.type]

  // Animación de entrada
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16)
    return () => clearTimeout(t)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(() => onRemove(toast.id), 280)
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 w-[340px] max-w-[calc(100vw-2.5rem)]
                 px-4 py-3.5 rounded-[16px] border
                 shadow-[0_8px_28px_rgba(0,0,0,0.11)]
                 transition-all duration-300 ease-out"
      style={{
        background:  cfg.bg,
        borderColor: cfg.border,
        opacity:     visible ? 1 : 0,
        transform:   visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.96)',
      }}
    >
      {/* Icono */}
      <span
        className="material-symbols-outlined flex-shrink-0 mt-px"
        style={{
          fontSize: 18,
          color: cfg.iconColor,
          fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18",
        }}
      >
        {cfg.icon}
      </span>

      {/* Mensaje */}
      <p
        className="flex-1 text-[13px] font-[700] leading-[1.5]"
        style={{ color: cfg.textColor }}
      >
        {toast.message}
      </p>

      {/* Cerrar */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-0.5 rounded-full transition-opacity duration-150 opacity-40 hover:opacity-80"
        style={{ color: cfg.iconColor }}
        aria-label="Cerrar notificación"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
      </button>
    </div>
  )
}

// ─── Contenedor global ────────────────────────────────────────────────────────
export function ToastContainer() {
  const toasts     = useUIStore(s => s.toasts)
  const removeToast = useUIStore(s => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-5 z-[300] flex flex-col gap-2 items-end"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}
