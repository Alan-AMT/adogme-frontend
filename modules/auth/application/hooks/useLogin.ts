// modules/auth/application/hooks/useLogin.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hook de aplicación para el formulario de login.
// Desacopla la lógica de UI: el componente sólo consume estado y handlers.
//
// FLUJO:
//   1. Usuario envía correo + password
//   2. Se llama authService.login() (mock o real según env)
//   3. Se actualiza authStore (setUser + setToken)
//   4. Redirect basado en role:
//       applicant → /mis-solicitudes (o ?redirect= si viene de ruta protegida)
//       shelter   → /refugio/dashboard
//       admin     → /admin
//   5. Si error es SHELTER_PENDING → isPendingShelter=true (UI especial en LoginView)
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { authService } from '@/modules/auth/infrastructure/AuthServiceFactory'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

// ── Redirect según rol ────────────────────────────────────────────────────────

function getPostLoginUrl(role: string, redirectParam: string | null): string {
  // Si viene de una ruta protegida, respetar el ?redirect= del middleware
  if (role === 'applicant' && redirectParam) {
    return decodeURIComponent(redirectParam)
  }
  switch (role) {
    case 'applicant': return '/mis-solicitudes'
    case 'shelter':   return '/refugio/dashboard'
    case 'admin':     return '/admin'
    default:          return '/'
  }
}

// ── Tipos del hook ────────────────────────────────────────────────────────────

export interface UseLoginState {
  correo:         string
  password:       string
  showPass:       boolean
  recordar:       boolean
  loading:        boolean
  error:          string
  isPendingShelter: boolean
}

export interface UseLoginActions {
  setCorreo:       (v: string)  => void
  setPassword:     (v: string)  => void
  toggleShowPass:  ()           => void
  setRecordar:     (v: boolean) => void
  handleSubmit:    (e: FormEvent) => Promise<void>
  clearError:      ()           => void
}

export type UseLoginReturn = UseLoginState & UseLoginActions

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLogin(): UseLoginReturn {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const setUser  = useAuthStore(s => s.setUser)
  const setToken = useAuthStore(s => s.setToken)

  const [correo,   setCorreo]   = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [recordar, setRecordar] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [isPendingShelter, setIsPendingShelter] = useState(false)

  // ── Validación ──────────────────────────────────────────────────────────────
  function validate(): string {
    if (!correo.trim())                        return 'El correo electrónico es requerido.'
    if (!/\S+@\S+\.\S+/.test(correo.trim()))   return 'El correo electrónico no es válido.'
    if (!password)                             return 'La contraseña es requerida.'
    if (password.length < 6)                   return 'La contraseña debe tener al menos 6 caracteres.'
    return ''
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsPendingShelter(false)

    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      const res = await authService.login({ correo: correo.trim(), password })

      // Actualiza authStore — Navbar y rutas protegidas reaccionan automáticamente
      setUser(res.user)
      setToken(res.token)

      const redirectParam = searchParams.get('redirect')
      router.push(getPostLoginUrl(res.user.role, redirectParam))
      router.refresh()

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión.'

      if (msg.startsWith('SHELTER_PENDING')) {
        // Refugio pendiente: UI especial (card informativa, no simple error)
        setIsPendingShelter(true)
        setError(msg.replace(/^SHELTER_PENDING:\s*/, ''))
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    correo,   setCorreo,
    password, setPassword,
    showPass, toggleShowPass: () => setShowPass(v => !v),
    recordar, setRecordar,
    loading,  error, isPendingShelter,
    handleSubmit,
    clearError: () => { setError(''); setIsPendingShelter(false) },
  }
}
