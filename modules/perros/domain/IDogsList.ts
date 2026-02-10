import { Dog } from "./dog";
import { DogFilters } from "./dogFilters";

export interface DogsList {
  getDogs: (filters: DogFilters) => Promise<Dog[]>;
}
