// modules/dogs/infrastructure/IDogService.ts
import type { Dog, DogFilters, DogListItem, PaginatedDogs } from "../domain/dog";

export interface IDogService {
  getDogs(filters?: DogFilters): Promise<PaginatedDogs>
  getDogById(id: string): Promise<Dog>
  getDogsByIds(ids: string[]): Promise<DogListItem[]>
}

/** Thrown by `getDogById` when the dog id does not exist (HTTP 404 in the real
 *  service, missing entry in the mock). Pages should catch this and call
 *  `notFound()`; any other error means an actual failure and should propagate. */
export class DogNotFoundError extends Error {
  constructor(id: string, options?: { cause?: unknown }) {
    super(`Perro ${id} no encontrado`, options);
    this.name = "DogNotFoundError";
  }
}
