// modules/auth/infrastructure/AuthServiceFactory.ts
// ─────────────────────────────────────────────────────────────────────────────
// Singleton del servicio de autenticación.
// Selecciona la implementación según la variable de entorno:
//
//   NEXT_PUBLIC_USE_MOCK=true   → MockAuthService (dev / staging)
//   NEXT_PUBLIC_USE_MOCK=false  → AuthService real (producción)
//
// PARA ACTIVAR EL SERVICIO REAL CUANDO EL BACKEND ESTÉ LISTO:
//   1. Crear `modules/auth/infrastructure/AuthService.ts` implementando IAuthService
//   2. Descomentar el import de AuthService más abajo
//   3. Cambiar NEXT_PUBLIC_USE_MOCK=false en .env.production
// ─────────────────────────────────────────────────────────────────────────────

import type { IAuthService } from './IAuthService'
import { MockAuthService } from './MockAuthService'

// import { AuthService } from './AuthService'  ← descomentar cuando el API esté listo

const isMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export const authService: IAuthService = isMock
  ? new MockAuthService()
  : (() => {
      // Fallback seguro mientras AuthService no esté implementado.
      // En producción: reemplazar con `new AuthService()`
      console.warn(
        '[AuthServiceFactory] NEXT_PUBLIC_USE_MOCK=false pero AuthService real no ' +
        'está implementado. Usando MockAuthService como fallback.'
      )
      return new MockAuthService()
    })()
