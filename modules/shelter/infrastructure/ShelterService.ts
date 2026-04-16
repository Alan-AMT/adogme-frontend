import {
  AdoptionRequest,
  AdoptionRequestListItem,
  Dog,
  DogFilters,
  DonationConfig,
  PaginatedDogs,
  RequestStatus,
  Shelter,
} from "@/modules/shared/domain";
import {
  DogCreateData,
  IShelterService,
  ShelterDashboardStats,
} from "./IShelterService";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";

export class ShelterService implements IShelterService {
  async getShelterProfile(refugioId: string): Promise<Shelter> {
    try {
      const { data } = await apiClient.get<{
        id: string;
        userOwnerId: string;
        name: string;
        description: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        municipality: string | null;
        fullAddress: string | null;
        schedule: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        approved: boolean;
        status: "pending" | "approved" | "rejected" | "suspended";
        logo: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>(API_ENDPOINTS.SHELTERS.BY_ID(refugioId));
      const shelter: Shelter = {
        id: data.id,
        nombre: data.name,
        status: data.status,
        descripcion: data.description ?? "",
        telefono: data.phone ?? "",
        correo: data.email ?? "",
        redesSociales: {
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          twitter: data.twitter ?? "",
          web: data.website ?? "",
        },
        alcaldia: data.municipality ?? "",
        ubicacion: data.municipality ?? "",
        userOwnerId: data.userOwnerId,
        direccionCompleta: data.fullAddress ?? "",
        schedule: data.schedule ?? "",
        aprobado: data.approved,
        logo: data.logo ?? "",
        imagenPortada: data.imageUrl ?? "",
        fechaRegistro: new Date(data.createdAt).toLocaleDateString("en-GB"),
        slug: "",
        donationConfig: {
          aceptaDonaciones: true,
        } as DonationConfig,
      };
      return shelter;
    } catch (e) {
      console.log(e);
      throw Error("No se pudo obtener el perfil del refugio.");
    }
  }

  createDog(data: DogCreateData): Promise<Dog> {
    throw Error("Nto implemented");
  }

  deleteDog(id: string): Promise<void> {
    throw Error("Not implemented");
  }

  getDashboardStats(refugioId: string): Promise<ShelterDashboardStats> {
    throw Error("Not implemented");
  }

  getDogs(refugioId: string): Promise<Dog[]> {
    throw Error("Not implemented");
  }

  getDogById(id: string): Promise<Dog> {
    throw Error("Not implemented");
  }

  updateDog(id: string, data: DogCreateData): Promise<Dog> {
    throw Error("Not implemented");
  }

  getShelterById(id: string): Promise<Shelter> {
    throw Error("Not implemented");
  }

  getRecentRequests(
    refugioId: string,
    limit?: number,
  ): Promise<AdoptionRequestListItem[]> {
    throw Error("Not implemented");
  }

  getRequestById(id: string): Promise<AdoptionRequest | null> {
    throw Error("Not implemented");
  }

  getShelterDogs(
    refugioId: string,
    filters?: DogFilters,
  ): Promise<PaginatedDogs> {
    throw Error("Not implemented");
  }

  updateShelterProfile(
    refugioId: string,
    data: Partial<Shelter>,
  ): Promise<Shelter> {
    throw Error("Not implemented");
  }

  getShelterRequests(refugioId: string): Promise<AdoptionRequestListItem[]> {
    throw Error("Not implemented");
  }

  updateRequestStatus(
    id: string,
    status: RequestStatus,
  ): Promise<AdoptionRequest> {
    throw Error("Not implemented");
  }

  togglePublish(id: string): Promise<Dog> {
    throw Error("Not implemented");
  }
}
