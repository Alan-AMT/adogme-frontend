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
    return [
      {
        id: 1,
        dogName: "Luna",
        adopterName: "Sofía Ramírez",
        storyShort:
          "Perdí a mi perra de 15 años y pensé que no podría querer a otro perro. Luna llegó al refugio después de ser encontrada en la calle, asustada y desnutrida. El día que la vi, me miró fijo a los ojos y algo se rompió dentro de mí. Hoy duerme en mi cama y me recibe cada noche como si fuera la primera vez.",
        imageUrl: "/historia1.jpg",
      },
      {
        id: 2,
        dogName: "Canelo",
        adopterName: "Marco Antonio Jiménez",
        storyShort:
          "Canelo tenía 9 años cuando lo fui a ver. Me dijeron que los perros mayores casi nunca se adoptan. Me lo llevé esa misma tarde. En sus últimos tres años no le faltó nada: caminatas, cobija propia y alguien que lo esperara en casa. Él me enseñó que el tiempo que nos queda vale más que el tiempo que nos falta.",
        imageUrl: "/historia2.png.avif",
      },
      {
        id: 3,
        dogName: "Pinta",
        adopterName: "Valeria Moreno",
        storyShort:
          "Pinta tardó dos meses en dejarme tocarla. Vivía escondida debajo del sillón, temblando ante cualquier ruido. No la forcé. Un día se acercó sola, apoyó el hocico en mi rodilla y cerró los ojos. Ese momento lo voy a cargar siempre. Ahora me sigue a todos lados y ladra cuando llego tarde.",
        imageUrl: "/historia3.png.avif",
      },
    ];
  }
}
