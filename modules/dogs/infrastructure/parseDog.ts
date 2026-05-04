import {
  Dog,
  DogListItem,
  calcularEdadCategoria,
} from "@/modules/shared/domain";
import { getPersonalityTagByLabel } from "@/modules/shared/utils/constants";
import type {
  CreateDogApiResponse,
  DogListItemApiResponse,
} from "./ApiResponses";

export function parseDog(data: CreateDogApiResponse): Dog {
  return {
    id: data.id,
    userOwnerId: data.userOwnerId,
    refugioId: data.shelterId,
    nombre: data.name,
    raza: data.breed,
    raza2: data.breed2 ?? undefined,
    edad: data.age,
    sexo: data.sex,
    tamano: data.size,
    nivelEnergia: data.energyLevel,
    descripcion: data.description,
    estado: data.status,
    personalidad: data.personality.flatMap((p) => {
      const tag = getPersonalityTagByLabel(p.label);
      return tag ? [tag] : [];
    }),
    aptoNinos: data.goodWithKids,
    aptoPerros: data.goodWithDogs,
    aptoGatos: data.goodWithCats,
    castrado: data.sterilized,
    necesitaJardin: data.needsYard,
    estaVacunado: data.isVaccinated,
    estaDesparasitado: data.isDewormed,
    largoPelaje: data.furLength,
    vacunas: data.vaccinations.map((v) => ({
      id: v.id,
      nombre: v.name,
      fecha: new Date(v.date).toISOString(),
      verificada: v.verified,
      proximaDosis: v.nextDose ? new Date(v.nextDose).toISOString() : undefined,
    })),
    salud: data.health,
    fotos: data.images,
    edadCategoria: calcularEdadCategoria(data.age),
    fechaRegistro: new Date(data.createdAt).toDateString(),
    fechaActualizacion: new Date(data.updatedAt).toDateString(),
    pesoKg: data.weightKg ?? undefined,
    foto: data.photo ?? undefined,
    refugioNombre: data.shelterName ?? undefined,
    refugioLogo: data.shelterLogo ?? undefined,
  };
}

export function parseDogListItem(data: DogListItemApiResponse): DogListItem {
  return {
    id: data.id,
    refugioId: data.shelterId,
    nombre: data.name,
    edad: data.age,
    edadCategoria: calcularEdadCategoria(data.age),
    raza: data.breed,
    tamano: data.size,
    sexo: data.sex,
    nivelEnergia: data.energyLevel,
    estado: data.status,
    foto: data.photo ?? undefined,
    compatibilidad: data.compatibility,
    aptoNinos: data.goodWithKids,
    aptoPerros: data.goodWithDogs,
    necesitaJardin: data.needsYard,
    refugioNombre: data.shelterName ?? undefined,
  };
}
