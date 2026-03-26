// modules/shared/application/hooks/useToast.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shorthand semántico para disparar toasts desde cualquier componente.
//
// Uso:
//   const toast = useToast()
//   toast.success('Perro guardado en favoritos')
//   toast.error('No se pudo enviar la solicitud')
//   toast.info('Revisa tu correo para verificar tu cuenta')
//   toast.warning('Este perro ya tiene una solicitud activa')
//   toast.custom({ type: 'success', message: '...', duration: 8000 })
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import type { ToastType } from '../../infrastructure/store/uiStore'
import { useUIStore } from '../../infrastructure/store/uiStore'

export function useToast() {
  const addToast = useUIStore(state => state.addToast)

  const show = (type: ToastType, message: string, duration = 4000) =>
    addToast({ type, message, duration })

  return {
    success: (message: string, duration?: number) => show('success', message, duration),
    error:   (message: string, duration?: number) => show('error',   message, duration ?? 5000),
    info:    (message: string, duration?: number) => show('info',    message, duration),
    warning: (message: string, duration?: number) => show('warning', message, duration),
    custom:  addToast,
  }
}
