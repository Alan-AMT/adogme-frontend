import { DogCard } from "./DogCard";

export interface HomeDogsListRepository {
  getMainDogs: () => Promise<DogCard[]>;
}
