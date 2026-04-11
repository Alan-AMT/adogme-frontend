// modules/home/infrastructure/IHomeService.ts

import type { AdoptionProcess } from "../domain/AdoptionProcess";
import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard } from "../domain/DogCard";
import type { ShelterCard } from "../domain/ShelterCard";

export interface IHomeService {
  getMainDogs(): Promise<DogCard[]>;
  getHomeSheltersList(): Promise<ShelterCard[]>;
  getLatestStories(): Promise<AdoptionStory[]>;
  getAdoptionProcess(): Promise<AdoptionProcess>;
}
