import axios from "axios";
import type { Dog, DogFilters, PaginatedDogs } from "@/modules/shared/domain";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import type { CreateDogApiResponse, GetDogsApiResponse } from "./ApiResponses";
import { parseDog, parseDogListItem } from "./parseDog";
import { DogNotFoundError, type IDogService } from "./IDogService";

// Filtros expuestos por DogsSearchView + paginación + refugioId (usado por
// vistas que prefiltran por refugio vía initialFilters).
const SUPPORTED_FILTERS = [
  "search",
  "raza",
  "tamano",
  "sexo",
  "edadCategoria",
  "nivelEnergia",
  "aptoNinos",
  "aptoPerros",
  "refugioId",
  "page",
  "limit",
] as const satisfies ReadonlyArray<keyof DogFilters>;

const PARAMS_TRASNLATION = {
  search: "search",
  raza: "breed",
  tamano: "size",
  sexo: "sex",
  edadCategoria: "ageCategory",
  nivelEnergia: "energyLevel",
  aptoNinos: "goodWithKids",
  aptoPerros: "goodWithDogs",
  refugioId: "shelterId",
  page: "page",
  limit: "limit",
};

function toQueryParams(
  filters: DogFilters,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const key of SUPPORTED_FILTERS) {
    const value = filters[key];
    if (value === undefined || value === null || value === "") continue;
    params[PARAMS_TRASNLATION[key]] = value;
  }
  return params;
}

export class DogService implements IDogService {
  async getDogs(filters: DogFilters = {}): Promise<PaginatedDogs> {
    try {
      const { data } = await apiClient.get<GetDogsApiResponse>(
        API_ENDPOINTS.DOGS.LIST,
        { params: toQueryParams(filters) },
      );
      return {
        data: data.data.map(parseDogListItem),
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        limit: data.limit,
      };
    } catch (e) {
      throw new Error("Error al obtener los perros", { cause: e });
    }
  }

  async getDogById(id: string): Promise<Dog> {
    try {
      const { data } = await apiClient.get<CreateDogApiResponse>(
        API_ENDPOINTS.DOGS.BY_ID(id),
      );
      return parseDog(data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        throw new DogNotFoundError(id, { cause: e });
      }
      throw new Error("Error al obtener el perro", { cause: e });
    }
  }
}
