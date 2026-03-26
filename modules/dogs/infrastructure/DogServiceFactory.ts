// modules/dogs/infrastructure/DogServiceFactory.ts
// Único punto de intercambio entre la implementación mock y la real.
// Para usar la API real: descomentar ApiDogService y ajustar la condición.

import { MockDogService } from "./MockDogService";
import type { IDogService } from "./IDogService";

// import { ApiDogService } from "./ApiDogService";

function createDogService(): IDogService {
  // if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
  //   return new ApiDogService(process.env.NEXT_PUBLIC_API_URL!);
  // }
  return new MockDogService();
}

/** Singleton — importar siempre desde aquí, nunca instanciar el servicio directamente */
export const dogService: IDogService = createDogService();
