// modules/adoption/infrastructure/AdoptionServiceFactory.ts
// Singleton — único punto de intercambio entre mock y real.
// Para usar la API real: descomentar ApiAdoptionService y ajustar la condición.

import { MockAdoptionService } from './MockAdoptionService'
import type { IAdoptionService } from './IAdoptionService'

// import { ApiAdoptionService } from './AdoptionService'

function createAdoptionService(): IAdoptionService {
  // if (process.env.NEXT_PUBLIC_USE_REAL_API === 'true') {
  //   return new ApiAdoptionService(process.env.NEXT_PUBLIC_API_URL!)
  // }
  return new MockAdoptionService()
}

/** Importar siempre desde aquí — nunca instanciar directamente */
export const adoptionService = createAdoptionService()
