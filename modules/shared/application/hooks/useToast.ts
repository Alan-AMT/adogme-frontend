// modules/shared/application/hooks/useToast.ts
// Shorthand semántico sobre sonner. Uso:
//   const toast = useToast()
//   toast.success('Perro guardado')
//   toast.error('No se pudo enviar la solicitud')
//   toast.info('Revisa tu correo')
//   toast.warning('Ya tienes una solicitud activa')
'use client'

import { toast } from 'sonner'

export function useToast() {
  return {
    success: (message: string, duration?: number) =>
      toast.success(message, { duration: duration ?? 4000 }),
    error: (message: string, duration?: number) =>
      toast.error(message, { duration: duration ?? 5000 }),
    info: (message: string, duration?: number) =>
      toast.info(message, { duration: duration ?? 4000 }),
    warning: (message: string, duration?: number) =>
      toast.warning(message, { duration: duration ?? 4000 }),
  }
}
