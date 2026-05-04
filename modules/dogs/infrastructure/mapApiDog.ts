// modules/dogs/infrastructure/mapApiDog.ts
// Mapper: shape del dogs-ms (en inglés) → Dog del FE (en español).
// Mantiene el dominio del FE estable aunque el backend cambie nombres.

import type {
  Dog,
  DogSize,
  DogSex,
  DogStatus,
  EnergyLevel,
  FurLength,
  PersonalityTag,
  Vaccination,
  DogImage,
} from '../domain/dog'
import { calcularEdadCategoria } from '../domain/dog'

// ─── Shape del backend (lo que devuelve dogs-ms) ─────────────────────────────

export interface ApiPersonalityTag {
  id:        string
  dogId?:    string
  label:     string
  category:  'caracter' | 'socializacion' | 'actividad' | 'entrenamiento'
  createdAt?: string
  updatedAt?: string
}

export interface ApiVaccination {
  id?:           string
  name?:         string
  date?:         string
  nextDose?:     string | null
  verified?:     boolean
}

export interface ApiDogImage {
  id?:     string
  dogId?:  string
  url?:    string
  status?: 'pending' | 'accepted' | 'rejected'
}

export interface ApiDog {
  id:           string
  userOwnerId:  string
  shelterId:    string
  status:       DogStatus
  name:         string
  breed:        string
  breed2?:      string
  age:          number
  sex:          DogSex
  size:         DogSize
  energyLevel:  EnergyLevel
  description:  string
  personality:  ApiPersonalityTag[]
  goodWithKids: boolean
  goodWithDogs: boolean
  goodWithCats: boolean
  sterilized:   boolean
  needsYard:    boolean
  isVaccinated: boolean
  isDewormed:   boolean
  furLength:    FurLength
  vaccinations: ApiVaccination[]
  health:       string
  weightKg:     number | null
  photo:        string
  shelterName?: string
  shelterLogo?: string
  vector?:      number[]
  images:       ApiDogImage[]
  createdAt:    string
  updatedAt:    string
}

// ─── Mappers de sub-entidades ────────────────────────────────────────────────

function mapPersonality(p: ApiPersonalityTag): PersonalityTag {
  return {
    id:        p.id,
    label:     p.label,
    categoria: p.category,
  }
}

function mapVaccination(v: ApiVaccination): Vaccination {
  return {
    id:           v.id ?? '',
    nombre:       v.name ?? '',
    fecha:        v.date ?? '',
    proximaDosis: v.nextDose ?? undefined,
    verificada:   v.verified ?? false,
  }
}

function mapImage(img: ApiDogImage, dogId: string): DogImage {
  return {
    id:     img.id ?? `${dogId}-img-${Math.random().toString(36).slice(2, 8)}`,
    dogId:  img.dogId ?? dogId,
    url:    img.url ?? '',
    status: img.status ?? 'accepted',
  }
}

// ─── Mapper principal ────────────────────────────────────────────────────────

export function mapApiDogToDog(api: ApiDog): Dog {
  return {
    id:                api.id,
    userOwnerId:       api.userOwnerId,
    refugioId:         api.shelterId,

    nombre:            api.name,
    raza:              api.breed,
    raza2:             api.breed2,
    edad:              api.age,
    pesoKg:            api.weightKg ?? undefined,
    sexo:              api.sex,
    tamano:            api.size,
    nivelEnergia:      api.energyLevel,
    descripcion:       api.description,
    estado:            api.status,

    personalidad:      (api.personality ?? []).map(mapPersonality),
    aptoNinos:         api.goodWithKids,
    aptoPerros:        api.goodWithDogs,
    aptoGatos:         api.goodWithCats,

    castrado:          api.sterilized,
    necesitaJardin:    api.needsYard,
    estaVacunado:      api.isVaccinated,
    estaDesparasitado: api.isDewormed,
    largoPelaje:       api.furLength,
    vacunas:           (api.vaccinations ?? []).map(mapVaccination),
    salud:             api.health,

    foto:              api.photo || undefined,
    fotos:             (api.images ?? []).map(img => mapImage(img, api.id)),

    edadCategoria:     calcularEdadCategoria(api.age),

    refugioNombre:     api.shelterName,
    refugioLogo:       api.shelterLogo,

    fechaRegistro:     api.createdAt,
    fechaActualizacion: api.updatedAt,
  }
}
