// modules/dogs/infrastructure/IDogService.ts
import type { Dog, DogFilters, PaginatedDogs } from "../domain/dog";

export interface IDogService {
  getDogs(filters?: DogFilters): Promise<PaginatedDogs>
  getDogById(id: string): Promise<Dog | null>
}
