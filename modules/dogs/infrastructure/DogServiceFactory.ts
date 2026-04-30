// modules/dogs/infrastructure/DogServiceFactory.ts
// Único punto de intercambio entre la implementación mock y la real.
// Para usar la API real: descomentar ApiDogService y ajustar la condición.

import { MockDogService } from "./MockDogService";
import { DogService } from "./DogService";
import type { IDogService } from "./IDogService";

function createDogService(): IDogService {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== 'true') {
    return new DogService();
  }
  return new MockDogService();
}

/** Singleton — importar siempre desde aquí, nunca instanciar el servicio directamente */
export const dogService: IDogService = createDogService();
