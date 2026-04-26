// modules/home/infrastructure/HomeService.ts
// Implementación real — usa apiClient + API_ENDPOINTS para consistencia.

import { apiClient }     from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard }       from "../domain/DogCard";
import type { ShelterCard }   from "../domain/ShelterCard";
import type { IHomeService }  from "./IHomeService";

const HOME_LIMITS = {
  dogs:     4,
  shelters: 5,
  stories:  3,
} as const;

export class HomeService implements IHomeService {
  async getMainDogs(): Promise<DogCard[]> {
    // El backend aún no soporta paginación: traemos todos y recortamos en cliente.
    const { data } = await apiClient.get<DogCard[]>(API_ENDPOINTS.DOGS.LIST);
    return data.slice(0, HOME_LIMITS.dogs);
  }

  async getHomeSheltersList(): Promise<ShelterCard[]> {
    const { data } = await apiClient.get<ShelterCard[]>(API_ENDPOINTS.SHELTERS.LIST);
    return data.slice(0, HOME_LIMITS.shelters);
  }

  async getLatestStories(): Promise<AdoptionStory[]> {
    // TODO: agregar STORIES en API_ENDPOINTS cuando exista el microservicio.
    return [];
  }
}
