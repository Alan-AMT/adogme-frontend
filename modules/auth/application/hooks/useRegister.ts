// modules/auth/application/hooks/useRegister.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hook de aplicación para el formulario de registro multi-paso.
// Maneja: role, step, datos de cada paso, validación, submit final.
//
// PASOS:
//   Adoptante: [1] Datos → [2] Contraseña → [3] Dirección → submit
//   Refugio:   [1] Datos → [2] Contraseña → [3] Datos refugio → submit
//
// USO:
//   const reg = useRegister()
//   // Step 1: reg.data.nombre, reg.data.correo, reg.data.telefono
//   // Step 2: reg.data.password, reg.data.confirmar
//   // Step 3 (adoptante): reg.data.alcaldia, .colonia, .calle, .numExt, .numInt, .cp
//   // Step 3 (refugio): reg.data.refNombre, .refAlcaldia, .refUbicacion, etc.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { authService } from '@/modules/auth/infrastructure/AuthServiceFactory'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useCallback, useState } from 'react'

// ── Tipos ──────────────────────────────────────────────────────────────────────

export type RegisterRole = 'adoptante' | 'refugio'
export type RegisterStep = 1 | 2 | 3

/** Todos los campos posibles — campos opcionales según role/step */
export interface RegisterFormData {
  // Step 1 — compartido
  nombre:   string
  correo:   string
  telefono: string

  // Step 2 — compartido
  password: string
  confirmar: string

  // Step 3 — adoptante
  alcaldia:  string
  colonia:   string
  calle:     string
  numExt:    string
  numInt:    string
  cp:        string

  // Step 3 — refugio
  refNombre:      string
  refAlcaldia:    string
  refUbicacion:   string
  refTelefono:    string
  refCorreo:      string
  refHorario:     string
  refCapacidad:   string
  refDescripcion: string
}

const INITIAL_DATA: RegisterFormData = {
  nombre: '', correo: '', telefono: '',
  password: '', confirmar: '',
  alcaldia: '', colonia: '', calle: '', numExt: '', numInt: '', cp: '',
  refNombre: '', refAlcaldia: '', refUbicacion: '',
  refTelefono: '', refCorreo: '', refHorario: '', refCapacidad: '', refDescripcion: '',
}

export interface UseRegisterReturn {
  // Config del formulario
  role:    RegisterRole
  step:    RegisterStep
  steps:   { id: string; label: string }[]

  // Datos
  data:    RegisterFormData
  update:  <K extends keyof RegisterFormData>(key: K, value: string) => void

  // Estado
  loading: boolean
  error:   string
  success: boolean

  // Password strength
  passwordStrength: { pct: number; label: string; color: string }

  // Navegación y submit
  setRole:       (r: RegisterRole) => void
  handleNext:    (e: FormEvent) => void
  handleBack:    ()             => void
  handleSubmit:  (e: FormEvent) => Promise<void>
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPasswordStrength(p: string): { pct: number; label: string; color: string } {
  if (!p) return { pct: 0, label: '', color: '#e4e4e7' }
  let s = 0
  if (p.length >= 8)          s++
  if (/[A-Z]/.test(p))        s++
  if (/[0-9]/.test(p))        s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return [
    { pct: 20,  label: 'Muy débil', color: '#ef4444' },
    { pct: 40,  label: 'Débil',     color: '#f97316' },
    { pct: 65,  label: 'Regular',   color: '#eab308' },
    { pct: 85,  label: 'Buena',     color: '#22c55e' },
    { pct: 100, label: 'Excelente', color: '#16a34a' },
  ][s] ?? { pct: 20, label: 'Muy débil', color: '#ef4444' }
}

const ADOPTANTE_STEPS = [
  { id: 'perfil',    label: 'Perfil' },
  { id: 'password',  label: 'Contraseña' },
  { id: 'direccion', label: 'Dirección' },
]
const REFUGIO_STEPS = [
  { id: 'datos',    label: 'Datos' },
  { id: 'password', label: 'Contraseña' },
  { id: 'refugio',  label: 'Refugio' },
]

// ── Validaciones por paso ─────────────────────────────────────────────────────

function validateStep1(d: RegisterFormData): string {
  if (!d.nombre.trim())                       return 'El nombre completo es requerido.'
  if (!d.correo.trim())                       return 'El correo electrónico es requerido.'
  if (!/\S+@\S+\.\S+/.test(d.correo.trim())) return 'El correo electrónico no es válido.'
  if (!d.telefono.trim())                     return 'El teléfono es requerido.'
  return ''
}

function validateStep2(d: RegisterFormData): string {
  if (!d.password)              return 'La contraseña es requerida.'
  if (d.password.length < 8)   return 'La contraseña debe tener al menos 8 caracteres.'
  if (d.password !== d.confirmar) return 'Las contraseñas no coinciden.'
  return ''
}

function validateStep3Adoptante(d: RegisterFormData): string {
  if (!d.alcaldia)          return 'Selecciona tu alcaldía.'
  if (!d.colonia.trim())    return 'La colonia es requerida.'
  if (!d.calle.trim())      return 'La calle es requerida.'
  if (!d.numExt.trim())     return 'El número exterior es requerido.'
  if (!d.cp.trim() || d.cp.trim().length !== 5) return 'El código postal debe tener 5 dígitos.'
  return ''
}

function validateStep3Refugio(d: RegisterFormData): string {
  if (!d.refNombre.trim())    return 'El nombre del refugio es requerido.'
  if (!d.refAlcaldia)         return 'Selecciona la alcaldía del refugio.'
  if (!d.refUbicacion.trim()) return 'La dirección del refugio es requerida.'
  if (!d.refDescripcion.trim()) return 'La descripción del refugio es requerida.'
  return ''
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRegister(): UseRegisterReturn {
  const router = useRouter()

  const [role,    setRoleState] = useState<RegisterRole>('adoptante')
  const [step,    setStep]      = useState<RegisterStep>(1)
  const [data,    setData]      = useState<RegisterFormData>(INITIAL_DATA)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState(false)

  const steps = role === 'adoptante' ? ADOPTANTE_STEPS : REFUGIO_STEPS

  // ── update: actualiza un campo del form ────────────────────────────────────
  const update = useCallback(<K extends keyof RegisterFormData>(
    key: K, value: string
  ) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── setRole: cambia el rol y resetea el formulario ─────────────────────────
  function setRole(r: RegisterRole) {
    setRoleState(r)
    setStep(1)
    setError('')
  }

  // ── handleNext: valida el paso actual y avanza ─────────────────────────────
  function handleNext(e: FormEvent) {
    e.preventDefault()
    setError('')
    const err = step === 1 ? validateStep1(data) : step === 2 ? validateStep2(data) : ''
    if (err) { setError(err); return }
    setStep(s => (s + 1) as RegisterStep)
  }

  // ── handleBack: retrocede un paso ─────────────────────────────────────────
  function handleBack() {
    setError('')
    setStep(s => (s - 1) as RegisterStep)
  }

  // ── handleSubmit: valida paso 3 y llama al servicio ───────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const err = role === 'adoptante'
      ? validateStep3Adoptante(data)
      : validateStep3Refugio(data)

    if (err) { setError(err); return }

    setLoading(true)
    try {
      if (role === 'adoptante') {
        await authService.register({
          name:            data.nombre,
          email:           data.correo,
          phone:           data.telefono,
          password:        data.password,
          municipality:    data.alcaldia,
          neighborhood:    data.colonia,
          street:          data.calle,
          exteriorNumber:  data.numExt,
          interiorNumber:  data.numInt || undefined,
          postalCode:      data.cp,
        })
      } else {
        await authService.registerShelter({
          name:           data.nombre,
          email:          data.correo,
          phone:          data.telefono,
          password:       data.password,
          shelterName:    data.refNombre,
          municipality:   data.refAlcaldia,
          address:        data.refUbicacion,
          shelterPhone:   data.refTelefono || undefined,
          shelterEmail:   data.refCorreo   || undefined,
          schedule:       data.refHorario  || undefined,
          capacity:       data.refCapacidad ? Number(data.refCapacidad) : undefined,
          description:    data.refDescripcion,
        })
      }
      setSuccess(true)
      // Adoptante → verificar email; refugio → estado pendiente
      // El componente decide la UI de éxito según el role
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return {
    role,  step,  steps,
    data,  update,
    loading, error, success,
    passwordStrength: getPasswordStrength(data.password),
    setRole,
    handleNext, handleBack, handleSubmit,
  }
}
