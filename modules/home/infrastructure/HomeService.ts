// modules/home/infrastructure/HomeService.ts

import { calcularEdadCategoria } from "@/modules/shared/domain";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard } from "../domain/DogCard";
import type { PaginatedShelterCards } from "../domain/ShelterCard";
import type { IHomeService } from "./IHomeService";

// ─── API Response Types ───────────────────────────────────────────────────────

type DogFindAllCatalog = {
  id: string;
  shelterId: string;
  name: string;
  age: number;
  breed: string;
  size: string;
  sex: string;
  energyLevel: string;
  status: string;
  photo: string | null;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  needsYard: boolean;
  shelterName: string | null;
};

type ShelterFindAll = {
  id: string;
  name: string;
  municipality: string | null;
  fullAddress: string | null;
  schedule: string | null;
  logo: string | null;
  imageUrl: string | null;
};

type ShelterListPaginatedApiResponse = {
  data: ShelterFindAll[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

// ─── Label helpers ────────────────────────────────────────────────────────────

function nivelEnergiaLabel(nivel: string): string {
  const map: Record<string, string> = {
    baja: "Bajo", moderada: "Moderado", alta: "Alto", muy_alta: "Muy alto",
  };
  return map[nivel] ?? nivel;
}

function estadoLabel(estado: string): string {
  const map: Record<string, string> = {
    disponible: "Disponible",
    en_proceso: "En adopción",
    adoptado: "Adoptado",
    no_disponible: "No disponible",
  };
  return map[estado] ?? estado;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class HomeService implements IHomeService {
  async getMainDogs(): Promise<DogCard[]> {
    try {
      const { data } = await apiClient.get<DogFindAllCatalog[]>(
        API_ENDPOINTS.DOGS.PORTRAIT,
      );
      return data.map(d => ({
        id:              d.id,
        nombre:          d.name,
        raza:            d.breed,
        edad:            Math.max(1, Math.round(d.age / 12)),
        tamano:          d.size.charAt(0).toUpperCase() + d.size.slice(1),
        nivelEnergia:    nivelEnergiaLabel(d.energyLevel),
        estado:          estadoLabel(d.status),
        imageUrl:        d.photo ?? "",
        tamanoRaw:       d.size,
        nivelEnergiaRaw: d.energyLevel,
        edadCat:         calcularEdadCategoria(d.age),
      }));
    } catch (e) {
      throw new Error("Error al obtener perros destacados", { cause: e });
    }
  }

  async getHomeSheltersList(page: number, limit: number): Promise<PaginatedShelterCards> {
    try {
      const { data } = await apiClient.get<ShelterListPaginatedApiResponse>(
        API_ENDPOINTS.SHELTERS.LIST,
        { params: { limit, page } },
      );
      return {
        data: data.data.map(s => ({
          id:                   s.id,
          nombre:               s.name,
          alcaldia:             s.municipality,
          logo:                 s.logo ?? "",
          imagenPortada:        s.imageUrl ?? "",
          adopcionesRealizadas: 0,
          perrosDisponibles:    0,
          calificacion:         undefined,
        })),
        total:      data.total,
        page:       data.page,
        totalPages: data.totalPages,
        limit:      data.limit,
      };
    } catch (e) {
      throw new Error("Error al obtener refugios", { cause: e });
    }
  }

  async getLatestStories(): Promise<AdoptionStory[]> {
    throw new Error("Not implemented");
  }
}
