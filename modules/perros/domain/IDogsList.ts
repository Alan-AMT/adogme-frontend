import { Dog } from "./dog";
import { DogFilters } from "./dogFilters";

export interface IDogsList {
  getDogs: (filters: DogFilters) => Promise<Dog[]>;
}
