// modules/dogs/infrastructure/DogServiceFactory.ts
// Selecciona implementación de IDogService según env:
//   NEXT_PUBLIC_USE_MOCK=true  → MockDogService (sin red)
//   default                    → ApiDogService (HTTP a dogs-ms)

import type { IDogService } from "./IDogService"
import { MockDogService } from "./MockDogService"
import { ApiDogService } from "./ApiDogService"

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true"

function createDogService(): IDogService {
  return useMock ? new MockDogService() : new ApiDogService()
}

/** Singleton — importar siempre desde aquí, nunca instanciar el servicio directamente */
export const dogService: IDogService = createDogService()
