// modules/home/infrastructure/IHomeService.ts

import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard } from "../domain/DogCard";
import type { PaginatedShelterCards } from "../domain/ShelterCard";

export interface IHomeService {
  getMainDogs(): Promise<DogCard[]>;
  getHomeSheltersList(page: number, limit: number): Promise<PaginatedShelterCards>;
  getLatestStories(): Promise<AdoptionStory[]>;
}
