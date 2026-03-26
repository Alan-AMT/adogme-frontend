// modules/auth/infrastructure/MockAuthService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Implementación MOCK de IAuthService — usa datos hardcoded (MOCK_CREDENTIALS).
// Activa con NEXT_PUBLIC_USE_MOCK=true en .env.local.
//
// CREDENCIALES DE PRUEBA:
//   adoptante  : ana@test.com          / test1234
//   refugio    : refugio@huellitas.com / shelter123
//   pendiente  : nuevo@refugio.com     / pending123    ← lanza SHELTER_PENDING
//   admin      : admin@plataforma.com  / admin123
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import type { AuthResponse, ShelterUser } from '@/modules/shared/domain/User'
import { MOCK_CREDENTIALS } from '@/modules/shared/mockData/users.mock'
import type { IAuthService, LoginCredentials, RegisterData, ShelterRegisterData } from './IAuthService'

// ── Helpers internos ──────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

/** Token compatible con authStore.decodeUserFromToken (btoa + encodeURIComponent) */
function buildMockToken(user: AuthResponse['user']): string {
  const payload = {
    ...user,
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
}

function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `auth-token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`
}

function clearAuthCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

// ── Clase ─────────────────────────────────────────────────────────────────────

export class MockAuthService implements IAuthService {
  // ── login ──────────────────────────────────────────────────────────────────
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(600)

    const record = MOCK_CREDENTIALS[credentials.correo]
    if (!record || record.password !== credentials.password) {
      throw new Error('Correo o contraseña incorrectos.')
    }

    const user = record.user

    // Caso especial: refugio pendiente de aprobación — error semántico, no 401
    if (user.role === 'shelter' && (user as ShelterUser).shelterStatus === 'pending') {
      throw new Error(
        'SHELTER_PENDING: Tu solicitud de refugio está en revisión. ' +
        'Te notificaremos por correo cuando sea aprobada.'
      )
    }

    const token     = buildMockToken(user)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    setAuthCookie(token)
    // Sincroniza con apiClient (mismo patrón que authStore)
    if (typeof window !== 'undefined') window.__authToken = token

    return {
      user,
      token,
      refreshToken: `refresh-${user.id}-${Date.now()}`,
      expiresAt,
    }
  }

  // ── register ───────────────────────────────────────────────────────────────
  async register(data: RegisterData): Promise<void> {
    await delay(600)

    if (MOCK_CREDENTIALS[data.correo]) {
      throw new Error('El correo ya está registrado.')
    }
    // Mock: registro exitoso — en producción crearía el usuario en BD
    // El nuevo usuario quedaría con status: 'pending_verification' hasta confirmar correo
  }

  // ── registerShelter ────────────────────────────────────────────────────────
  async registerShelter(data: ShelterRegisterData): Promise<void> {
    await delay(600)

    if (MOCK_CREDENTIALS[data.correo]) {
      throw new Error('El correo ya está registrado.')
    }
    // Mock: solicitud enviada — shelterStatus queda 'pending' hasta aprobación manual
  }

  // ── forgotPassword ─────────────────────────────────────────────────────────
  async forgotPassword(_email: string): Promise<void> {
    await delay(600)
    // Siempre retorna éxito — nunca revelar si el correo existe o no (seguridad)
  }

  // ── resetPassword ──────────────────────────────────────────────────────────
  async resetPassword(_token: string, _password: string): Promise<void> {
    await delay(600)
    // Simula reset exitoso
  }

  // ── logout ─────────────────────────────────────────────────────────────────
  async logout(): Promise<void> {
    clearAuthCookie()
    if (typeof window !== 'undefined') window.__authToken = undefined
  }
}

// ── Exports de compatibilidad ─────────────────────────────────────────────────
// LoginPage.tsx y RegisterPage.tsx llaman a estas funciones directamente.
// TODO: migrar ambos componentes a usar useAuthStore.login / useAuthStore.register
//       para centralizar el estado y eliminar estos shims.

const _svc = new MockAuthService()

/** @deprecated Usar useAuthStore.login — centraliza estado + cookie */
export async function mockLogin(creds: {
  correo:    string
  contrasena: string
  recordar?: boolean
}): Promise<{ id: number; nombre: string; correo: string; rol: string; token: string }> {
  const res = await _svc.login({ correo: creds.correo, password: creds.contrasena })
  return {
    id:     res.user.id,
    nombre: res.user.nombre,
    correo: res.user.correo,
    rol:    res.user.role,
    token:  res.token,
  }
}

/** @deprecated Usar useAuthStore.register cuando esté disponible */
export async function mockRegisterAdoptante(data: {
  nombre: string; correo: string; telefono: string; contrasena: string
  alcaldia?: string; colonia?: string; calle?: string
  numExt?: string; numInt?: string; cp?: string
}): Promise<void> {
  await _svc.register({
    nombre:          data.nombre,
    correo:          data.correo,
    telefono:        data.telefono,
    password:        data.contrasena,
    alcaldia:        data.alcaldia,
    colonia:         data.colonia,
    calle:           data.calle,
    numeroExterior:  data.numExt,
    numeroInterior:  data.numInt,
    codigoPostal:    data.cp,
  })
}

/** @deprecated Usar useAuthStore.registerShelter cuando esté disponible */
export async function mockRegisterRefugio(data: {
  nombre: string; correo: string; telefono: string; contrasena: string
  refNombre?: string; refAlcaldia?: string; refUbicacion?: string
  refTelefono?: string; refCorreo?: string
  refHorario?: string; refCapacidad?: number; refDescripcion?: string
}): Promise<void> {
  await _svc.registerShelter({
    nombre:         data.nombre,
    correo:         data.correo,
    telefono:       data.telefono,
    password:       data.contrasena,
    nombreRefugio:  data.refNombre  ?? '',
    alcaldia:       data.refAlcaldia ?? '',
    direccion:      data.refUbicacion ?? '',
    telefonoRefugio: data.refTelefono,
    correoRefugio:  data.refCorreo,
    horario:        data.refHorario,
    capacidad:      data.refCapacidad,
    descripcion:    data.refDescripcion,
  })
}

// ── Lista de alcaldías (usada por RegisterPage y ShelterRegisterPage) ─────────

export const ALCALDIAS_CDMX = [
  'Gustavo A. Madero',
  'Azcapotzalco',
  'Iztapalapa',
  'Coyoacán',
  'Cuauhtémoc',
  'Álvaro Obregón',
  'Xochimilco',
  'Tlalpan',
  'Iztacalco',
  'Benito Juárez',
  'Miguel Hidalgo',
  'Venustiano Carranza',
  'Tláhuac',
  'La Magdalena Contreras',
  'Cuajimalpa de Morelos',
  'Milpa Alta',
]
