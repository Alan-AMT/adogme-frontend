// modules/adoption/infrastructure/AdoptionServiceFactory.ts
// Singleton — único punto de intercambio entre mock y real.

import { AdoptionService } from './AdoptionService'
import type { IAdoptionService } from './IAdoptionService'

function createAdoptionService(): IAdoptionService {
  return new AdoptionService()
}

/** Importar siempre desde aquí — nunca instanciar directamente */
export const adoptionService = createAdoptionService()
