import { DogCard } from "../domain/DogCard";

export interface HomeDogsListRepository {
  getMainDogs: () => Promise<DogCard[]>;
}
