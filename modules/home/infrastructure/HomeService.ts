// modules/home/infrastructure/HomeService.ts

import { calcularEdadCategoria } from "@/modules/shared/domain";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import type { GetDogsApiResponse } from "@/modules/dogs/infrastructure/ApiResponses";
import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard } from "../domain/DogCard";
import type { ShelterCard } from "../domain/ShelterCard";
import type { IHomeService } from "./IHomeService";

// ─── API Response Types ───────────────────────────────────────────────────────

type ShelterListItemApiResponse = {
  id: string;
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  logo: string | null;
  imageUrl: string | null;
  municipality: string | null;
  createdAt: string | Date;
  approved: boolean;
  availableDogs?: number;
  adoptionsDone?: number;
  rating?: number;
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
      const { data } = await apiClient.get<GetDogsApiResponse>(
        API_ENDPOINTS.DOGS.LIST,
        { params: { limit: 4, status: "disponible" } },
      );
      return data.data.map(d => ({
        id:             d.id,
        nombre:         d.name,
        raza:           d.breed,
        descripcion:    "",
        edad:           Math.max(1, Math.round(d.age / 12)),
        tamano:         d.size.charAt(0).toUpperCase() + d.size.slice(1),
        nivelEnergia:   nivelEnergiaLabel(d.energyLevel),
        salud:          "",
        estado:         estadoLabel(d.status),
        imageUrl:       d.photo ?? "",
        tamanoRaw:      d.size,
        nivelEnergiaRaw: d.energyLevel,
        edadCat:        calcularEdadCategoria(d.age),
      }));
    } catch (e) {
      throw new Error("Error al obtener perros destacados", { cause: e });
    }
  }

  async getHomeSheltersList(): Promise<ShelterCard[]> {
    try {
      const { data } = await apiClient.get<ShelterListItemApiResponse[]>(
        API_ENDPOINTS.SHELTERS.LIST,
        { params: { limit: 5 } },
      );
      return data.map(s => ({
        id:                   s.id,
        nombre:               s.name,
        ubicacion:            s.municipality ?? "",
        alcaldia:             s.municipality ?? null,
        descripcion:          s.description ?? "",
        correo:               s.email ?? "",
        telefono:             s.phone ?? "",
        logo:                 s.logo ?? "",
        imagenPortada:        s.imageUrl ?? "",
        fechaRegistro:        new Date(s.createdAt).toLocaleDateString("en-GB"),
        aprobado:             s.approved,
        imageUrl:             s.imageUrl ?? "",
        adopcionesRealizadas: s.adoptionsDone ?? 0,
        perrosDisponibles:    s.availableDogs ?? 0,
        calificacion:         s.rating,
      }));
    } catch (e) {
      throw new Error("Error al obtener refugios", { cause: e });
    }
  }

  async getLatestStories(): Promise<AdoptionStory[]> {
    throw new Error("Not implemented");
  }
}
