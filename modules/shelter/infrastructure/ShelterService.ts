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
  DogUpdateData,
  IShelterService,
  ShelterDashboardStats,
} from "./IShelterService";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import {
  GetShelterProfileApiResponse,
  UpdateShelterApiResponse,
} from "./ApiResponses";
import {
  CreateDogApiResponse,
  CreateDogWithUploadUrlsApiResponse,
  GetDogsApiResponse,
} from "@/modules/dogs/infrastructure/ApiResponses";
import {
  parseDog,
  parseDogListItem,
} from "@/modules/dogs/infrastructure/parseDog";

export class ShelterService implements IShelterService {
  async getShelterProfile(refugioId: string): Promise<Shelter> {
    try {
      const { data } = await apiClient.get<GetShelterProfileApiResponse>(
        API_ENDPOINTS.SHELTERS.BY_ID(refugioId),
      );
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
        direccionCompleta: data.fullAddress ?? "",
        schedule: data.schedule ?? "",
        aprobado: data.approved,
        logo: data.logo ?? "",
        imagenPortada: data.imageUrl ?? "",
        fechaRegistro: new Date(data.createdAt).toLocaleDateString("en-GB"),
        cuotaAdopcion: data.adoptionFee ?? 0,
        donationConfig: {
          aceptaDonaciones: data.acceptsDonations,
          banco: data.donationBankName,
          cuentaClabe: data.donationClabe,
          descripcionCausa: data.donationCauseText,
          mercadoPagoLink: data.donationMercadoPagoLink,
          paypalLink: data.donationPaypalLink,
          titularCuenta: data.donationAccountHolder,
        } as DonationConfig,
      };
      return shelter;
    } catch (e) {
      console.log(e);
      throw Error("No se pudo obtener el perfil del refugio.");
    }
  }

  async updateShelterProfile(
    refugioId: string,
    shelterUpdate: Partial<Shelter>,
  ): Promise<Shelter> {
    try {
      const { data } = await apiClient.put<UpdateShelterApiResponse>(
        API_ENDPOINTS.SHELTERS.UPDATE(refugioId),
        {
          name: shelterUpdate.nombre,
          description: shelterUpdate.descripcion,
          phone: shelterUpdate.telefono,
          email: shelterUpdate.correo,
          website: shelterUpdate.redesSociales?.web,
          municipality: shelterUpdate.alcaldia,
          fullAddress: shelterUpdate.direccionCompleta,
          schedule: shelterUpdate.schedule,
          facebook: shelterUpdate.redesSociales?.facebook,
          instagram: shelterUpdate.redesSociales?.instagram,
          twitter: shelterUpdate.redesSociales?.twitter,
          logo: shelterUpdate.logo,
          imageUrl: shelterUpdate.imagenPortada,
          adoptionFee: shelterUpdate.cuotaAdopcion ?? 0,
          acceptsDonations: shelterUpdate.donationConfig?.aceptaDonaciones,
          donationCauseText: shelterUpdate.donationConfig?.descripcionCausa,
          donationClabe: shelterUpdate.donationConfig?.cuentaClabe,
          donationBankName: shelterUpdate.donationConfig?.banco,
          donationAccountHolder: shelterUpdate.donationConfig?.titularCuenta,
          donationPaypalLink: shelterUpdate.donationConfig?.paypalLink,
          donationMercadoPagoLink:
            shelterUpdate.donationConfig?.mercadoPagoLink,
        },
      );
      const updated: Shelter = {
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
        direccionCompleta: data.fullAddress ?? "",
        schedule: data.schedule ?? "",
        aprobado: data.approved,
        logo: data.logo ?? "",
        imagenPortada: data.imageUrl ?? "",
        fechaRegistro: new Date(data.createdAt).toLocaleDateString("en-GB"),
        cuotaAdopcion: data.adoptionFee ?? 0,
        donationConfig: {
          aceptaDonaciones: data.acceptsDonations,
          banco: data.donationBankName,
          cuentaClabe: data.donationClabe,
          descripcionCausa: data.donationCauseText,
          mercadoPagoLink: data.donationMercadoPagoLink,
          paypalLink: data.donationPaypalLink,
          titularCuenta: data.donationAccountHolder,
        } as DonationConfig,
      };
      return updated;
    } catch (e) {
      console.log(e);
      throw Error("No se pudo actualizar el perfil del refugio");
    }
  }

  async getShelterById(id: string): Promise<Shelter> {
    return await this.getShelterProfile(id);
  }

  async createDog(
    payload: DogCreateData,
  ): Promise<{ dog: Dog; uploadUrls: string[] }> {
    try {
      const { data } = await apiClient.post<CreateDogWithUploadUrlsApiResponse>(
        API_ENDPOINTS.DOGS.CREATE,
        {
          name: payload.nombre,
          breed: payload.raza,
          age: payload.edad,
          shelterId: payload.refugioId,
          weightKg: payload.pesoKg ?? null,
          sex: payload.sexo,
          size: payload.tamano,
          energyLevel: payload.nivelEnergia,
          description: payload.descripcion,
          personality: payload.personalidad
            ? payload.personalidad.map((p) => ({
                label: p.label,
                category: p.categoria,
              }))
            : [],
          photo: "",
          goodWithKids: payload.aptoNinos ?? false,
          goodWithDogs: payload.aptoPerros ?? false,
          goodWithCats: payload.aptoGatos ?? false,
          sterilized: payload.castrado ?? false,
          needsYard: payload.necesitaJardin ?? false,
          isVaccinated: payload.estaVacunado ?? false,
          isDewormed: payload.estaDesparasitado ?? false,
          furLength: payload.largoPelaje,
          vaccinations: payload.vacunas
            ? payload.vacunas.map((v) => ({
                name: v.nombre,
                date: v.fecha,
                nextDose: v.proximaDosis ?? null,
                verified: v.verificada ?? false,
              }))
            : [],
          health: payload.salud,
          amountImagesToCreate: payload.fotos?.length ?? 0,
          breed2: payload.raza2 ?? null,
          shelterName: payload.refugioNombre,
          shelterLogo: payload.refugioLogo,
          adoptionFee: payload.cuotaAdopcion,
        },
        { timeout: 60_000 },
      );
      return { dog: parseDog(data.dog), uploadUrls: data.uploadUrls };
    } catch (e) {
      console.log(e);
      throw Error("Error al crear perro");
    }
  }

  async uploadDogImages(
    files: File[],
    uploadUrls: string[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<void> {
    const total = uploadUrls.length;

    async function putOnce(file: File, url: string): Promise<void> {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream" },
        body: file,
      });
      if (!res.ok) {
        throw new Error(`PUT ${url} → ${res.status}`);
      }
    }

    let completed = 0;
    const results = await Promise.allSettled(
      uploadUrls.map(async (url, i) => {
        const file = files[i];
        try {
          await putOnce(file, url);
        } catch {
          // Reintentar una vez antes de reportar fallo
          await putOnce(file, url);
        } finally {
          completed += 1;
          onProgress?.(completed, total);
        }
      }),
    );

    const failedIndices = results
      .map((r, i) => (r.status === "rejected" ? i : -1))
      .filter((i) => i !== -1);

    if (failedIndices.length > 0) {
      throw new Error(
        `Fallaron ${failedIndices.length} de ${total} fotos (índices: ${failedIndices.join(", ")}). El perro fue creado; reintenta la subida desde el detalle del perro.`,
      );
    }
  }

  async updateDog(
    id: string,
    payload: DogUpdateData,
  ): Promise<{ dog: Dog; uploadUrls: string[] }> {
    try {
      const { data } = await apiClient.put<CreateDogWithUploadUrlsApiResponse>(
        API_ENDPOINTS.DOGS.UPDATE(id),
        {
          name: payload.nombre,
          breed: payload.raza,
          age: payload.edad,
          shelterId: payload.refugioId,
          weightKg: payload.pesoKg ?? null,
          sex: payload.sexo,
          size: payload.tamano,
          energyLevel: payload.nivelEnergia,
          description: payload.descripcion,
          personality: payload.personalidad
            ? payload.personalidad.map((p) => ({
                label: p.label,
                category: p.categoria,
              }))
            : [],
          goodWithKids: payload.aptoNinos ?? false,
          goodWithDogs: payload.aptoPerros ?? false,
          goodWithCats: payload.aptoGatos ?? false,
          sterilized: payload.castrado ?? false,
          needsYard: payload.necesitaJardin ?? false,
          isVaccinated: payload.estaVacunado ?? false,
          isDewormed: payload.estaDesparasitado ?? false,
          furLength: payload.largoPelaje,
          vaccinations: payload.vacunas
            ? payload.vacunas.map((v) => ({
                name: v.nombre,
                date: v.fecha,
                nextDose: v.proximaDosis ?? null,
                verified: v.verificada ?? false,
              }))
            : [],
          health: payload.salud,
          photo: "",
          breed2: payload.raza2 ?? null,
          shelterName: payload.refugioNombre,
          shelterLogo: payload.refugioLogo,
          adoptionFee: payload.cuotaAdopcion,
          amountImagesToCreate: payload.amountImagesToCreate ?? 0,
          imagesToDelete: payload.imagesToDelete ?? [],
          updatedMainImageId: payload.updatedMainImageId ?? null,
        },
        { timeout: 60_000 },
      );
      return { dog: parseDog(data.dog), uploadUrls: data.uploadUrls };
    } catch (e) {
      console.log(e);
      throw Error("Error al actualizar perro");
    }
  }

  async deleteDog(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DOGS.DELETE(id), {
        timeout: 30_000,
      });
    } catch (e) {
      console.log(e);
      throw Error("Error al eliminar perro");
    }
  }

  async getDogs(refugioId: string): Promise<Dog[]> {
    try {
      const { data } = await apiClient.get<CreateDogApiResponse[]>(
        // const { data } = await apiClient.get<GetDogsApiResponse>(
        API_ENDPOINTS.DOGS.BY_SHELTER(refugioId),
      );
      return data.map(parseDog);
    } catch (e) {
      throw Error("Error al obtener los perros del refugio");
    }
  }

  async getDogById(id: string): Promise<Dog> {
    try {
      const { data } = await apiClient.get<CreateDogApiResponse>(
        API_ENDPOINTS.DOGS.BY_ID(id),
      );
      return parseDog(data);
    } catch (e) {
      throw Error("Error al obtener los datos del perro");
    }
  }

  async getShelterDogs(
    refugioId: string,
    filters?: DogFilters,
  ): Promise<PaginatedDogs> {
    try {
      const params: Record<string, string | number> = {};
      if (filters?.estado) params.status = filters.estado;
      if (filters?.search) params.search = filters.search;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      const { data } = await apiClient.get<GetDogsApiResponse>(
        API_ENDPOINTS.DOGS.BY_SHELTER(refugioId),
        { params },
      );
      return {
        data: data.data.map(parseDogListItem),
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        limit: data.limit,
      };
    } catch (e) {
      throw Error("Error al obtener los perros del refugio");
    }
  }

  togglePublish(id: string): Promise<Dog> {
    throw Error("Not implemented");
  }

  getShelterRequests(refugioId: string): Promise<AdoptionRequestListItem[]> {
    try {
      return Promise.resolve([]);
    } catch (e) {
      throw Error("Not implemented");
    }
  }

  updateRequestStatus(
    id: string,
    status: RequestStatus,
  ): Promise<AdoptionRequest> {
    throw Error("Not implemented");
  }

  getRecentRequests(
    refugioId: string,
    limit?: number,
  ): Promise<AdoptionRequestListItem[]> {
    try {
      return Promise.resolve([]);
    } catch (e) {
      throw Error("Not implemented");
    }
  }

  getRequestById(id: string): Promise<AdoptionRequest | null> {
    throw Error("Not implemented");
  }

  getDashboardStats(refugioId: string): Promise<ShelterDashboardStats> {
    throw Error("Not implemented");
  }
}
