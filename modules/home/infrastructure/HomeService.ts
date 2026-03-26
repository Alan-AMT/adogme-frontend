// modules/home/infrastructure/HomeService.ts
// Implementación real — conectar a la API cuando esté disponible

import type { AdoptionProcess } from "../domain/AdoptionProcess";
import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard } from "../domain/DogCard";
import type { GlobalStats } from "../domain/GlobalStats";
import type { ShelterCard } from "../domain/ShelterCard";
import type { IHomeService } from "./IHomeService";

export class HomeService implements IHomeService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getMainDogs(): Promise<DogCard[]> {
    const res = await fetch(`${this.baseUrl}/dogs?limit=4&status=available`);
    if (!res.ok) throw new Error("Error al obtener perros");
    return res.json();
  }

  async getHomeSheltersList(): Promise<ShelterCard[]> {
    const res = await fetch(`${this.baseUrl}/shelters?limit=5`);
    if (!res.ok) throw new Error("Error al obtener refugios");
    return res.json();
  }

  async getLatestStories(): Promise<AdoptionStory[]> {
    const res = await fetch(`${this.baseUrl}/stories?limit=3`);
    if (!res.ok) throw new Error("Error al obtener historias");
    return res.json();
  }

  async getAdoptionProcess(): Promise<AdoptionProcess> {
    const res = await fetch(`${this.baseUrl}/adoption-process`);
    if (!res.ok) throw new Error("Error al obtener el proceso de adopción");
    return res.json();
  }

  async getGlobalStats(): Promise<GlobalStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) throw new Error("Error al obtener estadísticas");
    return res.json();
  }
}
