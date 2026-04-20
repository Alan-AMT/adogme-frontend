import {
  AdoptionRequest,
  AdoptionRequestListItem,
  calcularEdadCategoria,
  Dog,
  DogFilters,
  DonationConfig,
  PaginatedDogs,
  RequestStatus,
  Shelter,
  PersonalityTag,
  Vaccination,
} from "@/modules/shared/domain";
import {
  DogCreateData,
  IShelterService,
  ShelterDashboardStats,
} from "./IShelterService";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import {
  CreateDogApiResponse,
  GetShelterProfileApiResponse,
  UpdateShelterApiResponse,
} from "./ApiResponses";

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
      return updated;
    } catch (e) {
      console.log(e);
      throw Error("No se pudo actualizar el perfil del refugio");
    }
  }

  async getShelterById(id: string): Promise<Shelter> {
    return await this.getShelterProfile(id);
  }

  async createDog(payload: DogCreateData): Promise<Dog> {
    try {
      console.log(payload);
      // const { data } = await apiClient.post<CreateDogApiResponse>(
      //   API_ENDPOINTS.DOGS.CREATE,
      //   {
      //     name: payload.nombre,
      //     breed: payload.raza,
      //     age: payload.edad,
      //     shelterId: payload.refugioId,
      //     weightKg: payload.pesoKg ?? null,
      //     sex: payload.sexo,
      //     size: payload.tamano,
      //     energyLevel: payload.nivelEnergia,
      //     description: payload.descripcion,
      //     personality: payload.personalidad
      //       ? payload.personalidad.map((p) => ({
      //           label: p.label,
      //           category: p.categoria,
      //         }))
      //       : [],
      //     goodWithKids: payload.aptoNinos ?? false,
      //     goodWithDogs: payload.aptoPerros ?? false,
      //     goodWithCats: payload.aptoGatos ?? false,
      //     sterilized: payload.castrado ?? false,
      //     needsYard: payload.necesitaJardin ?? false,
      //     isVaccinated: payload.estaVacunado ?? false,
      //     isDewormed: payload.estaDesparasitado ?? false,
      //     furLength: payload.largoPelaje,
      //     vaccinations: payload.vacunas
      //       ? payload.vacunas.map((v) => ({
      //           name: v.nombre,
      //           date: v.fecha,
      //           nextDose: v.proximaDosis ?? null,
      //           verified: v.verificada ?? false,
      //         }))
      //       : [],
      //     health: payload.salud,
      //     photo: "",
      //     breed2: payload.raza2 ?? null,
      //     shelterName: payload.refugioNombre,
      //     shelterLogo: payload.refugioLogo,
      //   },
      // );
      // const createdDog: Dog = {
      //   id: data.id,
      //   userOwnerId: data.userOwnerId,
      //   refugioId: data.shelterId,
      //   nombre: data.name,
      //   raza: data.breed,
      //   edad: data.age,
      //   sexo: data.sex,
      //   tamano: data.size,
      //   nivelEnergia: data.energyLevel,
      //   descripcion: data.description,
      //   estado: data.status,
      //   personalidad: data.personality.map((personality) => {
      //     const p: PersonalityTag = {
      //       id: personality.id,
      //       label: personality.label,
      //       icon: "string", // solo frontend — para renderizado de UI
      //       categoria: personality.category,
      //     };
      //     return p;
      //   }),
      //   aptoNinos: data.goodWithKids,
      //   aptoPerros: data.goodWithDogs,
      //   aptoGatos: data.goodWithCats,
      //   castrado: data.sterilized,
      //   necesitaJardin: data.needsYard,
      //   estaVacunado: data.isVaccinated,
      //   estaDesparasitado: data.isDewormed,
      //   largoPelaje: data.furLength,
      //   // vacunas: data.vaccinations,
      //   vacunas: data.vaccinations.map((vaccine) => {
      //     const v: Vaccination = {
      //       id: vaccine.id,
      //       nombre: vaccine.name,
      //       fecha: new Date(vaccine.date).toISOString(),
      //       verificada: vaccine.verified,
      //       proximaDosis: vaccine.nextDose
      //         ? new Date(vaccine.nextDose).toISOString()
      //         : undefined,
      //     };
      //     return v;
      //   }),
      //   salud: data.health,
      //   fotos: [],
      //   edadCategoria: calcularEdadCategoria(data.age),
      //   fechaRegistro: new Date(data.createdAt).toDateString(),
      //   fechaActualizacion: new Date(data.updatedAt).toDateString(),
      //   pesoKg: data.weightKg ?? undefined,
      //   foto: data.photo ?? undefined,
      //   raza2: data.breed,
      // };
      return {} as Dog;
    } catch (e) {
      throw Error("Error al crear perro");
    }
  }

  updateDog(id: string, data: DogCreateData): Promise<Dog> {
    throw Error("Not implemented");
  }

  deleteDog(id: string): Promise<void> {
    throw Error("Not implemented");
  }

  getDogs(refugioId: string): Promise<Dog[]> {
    try {
      return Promise.resolve([]);
    } catch (e) {
      throw Error("Not implemented");
    }
  }

  getDogById(id: string): Promise<Dog> {
    throw Error("Not implemented");
  }

  getShelterDogs(
    refugioId: string,
    filters?: DogFilters,
  ): Promise<PaginatedDogs> {
    throw Error("Not implemented");
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
