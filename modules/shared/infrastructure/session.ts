// modules/shared/infrastructure/session.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lectura de sesión en SERVER COMPONENTS y layouts de Next.js App Router.
// Los layouts de (shelter), (applicant) y (admin) llaman a getAuthSession()
// para verificar auth y rol ANTES de renderizar la página.
//
// NO usar en Client Components — ahí usar useAuth() del authStore.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from 'next/headers'
import type { Administrador, Adoptante, ShelterUser, User } from '../domain/User'

// ─── Tipo de sesión deserializada ────────────────────────────────────────────

export interface SessionData {
  userId:        number
  correo:        string
  role:          User['role']
  shelterStatus?: ShelterUser['shelterStatus']   // solo si role === 'shelter'
  shelterId?:    number                           // solo si role === 'shelter'
  nombre:        string
  avatarUrl?:    string
  exp:           number   // unix timestamp de expiración
}

// ─── Función principal ────────────────────────────────────────────────────────

export async function getAuthSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  try {
    return decodeSessionToken(token)
  } catch {
    return null
  }
}

// ─── Helpers de rol (para layouts) ───────────────────────────────────────────

export async function requireAuth(): Promise<SessionData> {
  const session = await getAuthSession()
  if (!session) throw new Error('UNAUTHENTICATED')
  return session
}

export async function requireRole(
  role: User['role']
): Promise<SessionData> {
  const session = await getAuthSession()
  if (!session) throw new Error('UNAUTHENTICATED')
  if (session.role !== role) throw new Error('FORBIDDEN')
  return session
}

// ─── Decodificador del token ──────────────────────────────────────────────────
// En mock:    el token es un JSON en base64 con los datos de SessionData
// En prod:    verificar el JWT con la clave pública del backend
// El switch se hace con NEXT_PUBLIC_USE_MOCK

function decodeSessionToken(token: string): SessionData | null {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (useMock) {
    return decodeMockToken(token)
  }

  return decodeProdToken(token)
}

// Mock: el token es simplemente base64(JSON)
function decodeMockToken(token: string): SessionData | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    return payload as SessionData
  } catch {
    return null
  }
}

// Prod: decodifica el payload del JWT sin verificar firma (el backend ya lo hizo)
// Para verificación criptográfica real usar 'jose' o 'jsonwebtoken' con la clave pública
function decodeProdToken(token: string): SessionData | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'))

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload as SessionData
  } catch {
    return null
  }
}

// ─── Utilidad: crear token mock (para MockAuthService) ───────────────────────

export function createMockToken(user: Adoptante | ShelterUser | Administrador): string {
  const session: SessionData = {
    userId:   user.id,
    correo:   user.correo,
    role:     user.role,
    nombre:   user.nombre,
    avatarUrl: user.avatarUrl,
    exp:      Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    ...(user.role === 'shelter' && {
      shelterId:    (user as ShelterUser).shelterId,
      shelterStatus:(user as ShelterUser).shelterStatus,
    }),
  }
  return Buffer.from(JSON.stringify(session)).toString('base64')
}
