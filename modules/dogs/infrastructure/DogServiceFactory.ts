// modules/dogs/infrastructure/DogServiceFactory.ts
// Único punto de intercambio entre la implementación mock y la real.
// NEXT_PUBLIC_USE_MOCK=true → MockDogService (datos en memoria)
// otro valor / no seteado → DogService (HTTP contra la API real)

import { MockDogService } from "./MockDogService";
import { DogService } from "./DogService";
import type { IDogService } from "./IDogService";

function createDogService(): IDogService {
  const isMock = false;
  // const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true"
  if (isMock) {
    return new MockDogService();
  }
  return new DogService();
}

/** Singleton — importar siempre desde aquí, nunca instanciar el servicio directamente */
export const dogService: IDogService = createDogService()
