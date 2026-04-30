// modules/dogs/infrastructure/DogService.ts
// Servicio real que consume el MS de perros (adogme-ms-dogs) directamente.
// Mapea la respuesta del MS (inglés, UUIDs) al dominio del frontend (español).

import axios from 'axios'
import { API_ENDPOINTS } from '../../shared/infrastructure/api/endpoints'
import type {
  IDogService,
  DogCreateData,
  DogUpdateData,
  MediaValidationResult,
} from './IDogService'
import type {
  Dog,
  DogFilters,
  DogListItem,
  PaginatedDogs,
  Vaccination,
  PersonalityTag,
  AgeCategory,
} from '../domain/dog'

// ─── Tipos del MS (adogme-ms-dogs) ───────────────────────────────────────────

interface MsPersonality {
  label:    string
  category: string
}

interface MsVaccination {
  name:     string
  date:     string
  nextDose: string | null
  verified: boolean
}

interface MsDog {
  id:           string
  userOwnerId:  string
  shelterId:    string
  status:       'disponible' | 'en_proceso' | 'adoptado' | 'no_disponible'
  name:         string
  breed:        string
  age:          number
  sex:          'macho' | 'hembra'
  size:         'pequeño' | 'mediano' | 'grande' | 'gigante'
  energyLevel:  'baja' | 'moderada' | 'alta' | 'muy_alta'
  description:  string
  personality:  MsPersonality[]
  goodWithKids: boolean
  goodWithDogs: boolean
  goodWithCats: boolean
  sterilized:   boolean
  needsYard:    boolean
  isVaccinated: boolean
  isDewormed:   boolean
  furLength:    'corto' | 'mediano' | 'largo'
  vaccinations: MsVaccination[]
  health:       string
  weightKg:     number | null
  photo:        string | null
  breed2:       string | null
  shelterName:  string | null
  shelterLogo:  string | null
  updatedAt:    string
  createdAt:    string
}

// ─── Auth: header requerido por el MS cuando se consume directo ───────────────
// El MS espera x-apigateway-api-userinfo con el payload del usuario en Base64URL

function buildAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const token = window.__authToken
    if (!token) return {}
    const parts = token.split('.')
    if (parts.length < 2) return {}
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    const encoded = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    return { 'x-apigateway-api-userinfo': encoded }
  } catch {
    return {}
  }
}

// ─── Mapper: MS Dog → Frontend Dog ───────────────────────────────────────────

function calcEdadCategoria(ageMeses: number): AgeCategory {
  if (ageMeses < 12) return 'cachorro'
  if (ageMeses < 36) return 'joven'
  if (ageMeses < 96) return 'adulto'
  return 'senior'
}

function mapVaccinations(msVacs: MsVaccination[]): Vaccination[] {
  return (msVacs ?? []).map((v, i) => ({
    id:          i + 1,
    nombre:      v.name,
    fecha:       v.date,
    proximaDosis: v.nextDose ?? undefined,
    verificada:  v.verified,
  }))
}

function mapPersonality(msTags: MsPersonality[]): PersonalityTag[] {
  return (msTags ?? []).map((p, i) => ({
    id:       i + 1,
    label:    p.label,
    icon:     'pets',
    categoria: p.category as PersonalityTag['categoria'],
  }))
}

function mapMsDogToFrontend(ms: MsDog): Dog {
  return {
    id:            ms.id,
    refugioId:     ms.shelterId,
    nombre:        ms.name,
    edad:          ms.age,
    edadCategoria: calcEdadCategoria(ms.age),
    raza:          ms.breed,
    tamano:        ms.size,
    nivelEnergia:  ms.energyLevel,
    sexo:          ms.sex,
    salud:         ms.health,
    estado:        ms.status,
    compatibilidad: 0,
    descripcion:   ms.description,
    foto:          ms.photo ?? '',
    fotos:         ms.photo ? [ms.photo] : [],
    fechaRegistro: ms.createdAt.slice(0, 10),
    castrado:      ms.sterilized,
    microchip:     false,
    aptoNinos:     ms.goodWithKids,
    aptoPerros:    ms.goodWithDogs,
    aptoGatos:     ms.goodWithCats,
    necesitaJardin: ms.needsYard,
    pesoKg:        ms.weightKg ?? undefined,
    personalidad:  mapPersonality(ms.personality),
    vacunas:       mapVaccinations(ms.vaccinations),
    refugioNombre: ms.shelterName ?? undefined,
    refugioLogo:   ms.shelterLogo ?? undefined,
  }
}

function toListItem(d: Dog): DogListItem {
  return {
    id:            d.id,
    refugioId:     d.refugioId,
    nombre:        d.nombre,
    edad:          d.edad,
    edadCategoria: d.edadCategoria,
    raza:          d.raza,
    tamano:        d.tamano,
    sexo:          d.sexo,
    nivelEnergia:  d.nivelEnergia,
    estado:        d.estado,
    foto:          d.foto,
    compatibilidad: d.compatibilidad,
    aptoNinos:     d.aptoNinos,
    aptoPerros:    d.aptoPerros,
    necesitaJardin: d.necesitaJardin,
    refugioNombre: d.refugioNombre,
    refugioSlug:   d.refugioSlug,
    refugioCiudad: d.refugioCiudad,
  }
}

// ─── Mapper: Frontend DogCreateData → MS CreateDogDto ────────────────────────

const PELAJE_MAP: Record<number, 'corto' | 'mediano' | 'largo'> = {
  1: 'corto', 2: 'mediano', 3: 'largo',
}
const SALUD_MAP: Record<number, string> = {
  1: 'Sano', 2: 'Lesión leve', 3: 'Lesión grave',
}

function mapCreateToMs(data: DogCreateData): Record<string, unknown> {
  return {
    name:        data.nombre,
    breed:       data.raza,
    age:         data.edad,
    shelterId:   data.refugioId,
    weightKg:    data.pesoKg ?? null,
    sex:         data.sexo,
    size:        data.tamano,
    energyLevel: data.nivelEnergia,
    description: data.descripcion,
    personality: (data.personalidad ?? []).map(p => ({
      label:    p.label,
      category: p.categoria,
    })),
    goodWithKids: data.aptoNinos    ?? false,
    goodWithDogs: data.aptoPerros   ?? false,
    goodWithCats: data.aptoGatos    ?? false,
    sterilized:   data.castrado     ?? false,
    needsYard:    data.necesitaJardin ?? false,
    isVaccinated: data.vacunado,
    isDewormed:   data.desparasitado,
    furLength:    PELAJE_MAP[data.pelaje as number] ?? 'corto',
    vaccinations: (data.vacunas ?? []).map(v => ({
      name:     v.nombre,
      date:     v.fecha,
      nextDose: v.proximaDosis ?? null,
      verified: v.verificada,
    })),
    health:      SALUD_MAP[data.nivelSalud as number] ?? 'Sano',
    photo:       data.foto,
    breed2:      null,
    shelterName: null,
    shelterLogo: null,
    adoptionFee: data.cuotaAdopcion ?? null,
  }
}

function mapUpdateToMs(current: Dog, data: DogUpdateData): Record<string, unknown> {
  const base = mapCreateToMs({
    refugioId:     current.refugioId,
    nombre:        current.nombre,
    edad:          current.edad,
    raza:          current.raza,
    tamano:        current.tamano,
    nivelEnergia:  current.nivelEnergia,
    sexo:          current.sexo,
    descripcion:   current.descripcion,
    foto:          current.foto,
    vacunado:      current.vacunas.length > 0,
    desparasitado: false,
    castrado:      current.castrado,
    nivelSalud:    1,
    pelaje:        1,
    aptoNinos:     current.aptoNinos,
    aptoPerros:    current.aptoPerros,
    aptoGatos:     current.aptoGatos,
    necesitaJardin: current.necesitaJardin,
    pesoKg:        current.pesoKg,
    personalidad:  current.personalidad,
    vacunas:       current.vacunas,
  })

  const patch: Record<string, unknown> = {}
  if (data.nombre       !== undefined) patch.name        = data.nombre
  if (data.raza         !== undefined) patch.breed       = data.raza
  if (data.edad         !== undefined) patch.age         = data.edad
  if (data.tamano       !== undefined) patch.size        = data.tamano
  if (data.nivelEnergia !== undefined) patch.energyLevel = data.nivelEnergia
  if (data.sexo         !== undefined) patch.sex         = data.sexo
  if (data.descripcion  !== undefined) patch.description = data.descripcion
  if (data.foto         !== undefined) patch.photo       = data.foto
  if (data.castrado     !== undefined) patch.sterilized  = data.castrado
  if (data.aptoNinos    !== undefined) patch.goodWithKids = data.aptoNinos
  if (data.aptoPerros   !== undefined) patch.goodWithDogs = data.aptoPerros
  if (data.aptoGatos    !== undefined) patch.goodWithCats = data.aptoGatos
  if (data.necesitaJardin !== undefined) patch.needsYard = data.necesitaJardin
  if (data.pesoKg       !== undefined) patch.weightKg    = data.pesoKg
  if (data.vacunado     !== undefined) patch.isVaccinated = data.vacunado
  if (data.desparasitado !== undefined) patch.isDewormed  = data.desparasitado
  if (data.pelaje       !== undefined) patch.furLength    = PELAJE_MAP[data.pelaje as number] ?? 'corto'
  if (data.nivelSalud   !== undefined) patch.health       = SALUD_MAP[data.nivelSalud as number] ?? 'Sano'
  if (data.personalidad !== undefined) patch.personality  = data.personalidad.map(p => ({ label: p.label, category: p.categoria }))
  if (data.vacunas      !== undefined) patch.vaccinations = data.vacunas.map(v => ({ name: v.nombre, date: v.fecha, nextDose: v.proximaDosis ?? null, verified: v.verificada }))

  return { ...base, ...patch }
}

// ─── Filtros client-side (el MS no soporta query params de filtrado) ──────────

function applyClientFilters(dogs: Dog[], filters: DogFilters): Dog[] {
  let result = dogs

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(d =>
      d.nombre.toLowerCase().includes(q) ||
      d.raza.toLowerCase().includes(q) ||
      (d.refugioNombre ?? '').toLowerCase().includes(q)
    )
  }
  if (filters.tamano)        result = result.filter(d => d.tamano        === filters.tamano)
  if (filters.sexo)          result = result.filter(d => d.sexo          === filters.sexo)
  if (filters.nivelEnergia)  result = result.filter(d => d.nivelEnergia  === filters.nivelEnergia)
  if (filters.estado)        result = result.filter(d => d.estado        === filters.estado)
  if (filters.edadCategoria) result = result.filter(d => d.edadCategoria === filters.edadCategoria)
  if (filters.raza)          result = result.filter(d => d.raza.toLowerCase() === filters.raza!.toLowerCase())
  if (filters.refugioId)     result = result.filter(d => d.refugioId     === filters.refugioId)
  if (filters.aptoNinos  === true) result = result.filter(d => d.aptoNinos)
  if (filters.aptoPerros === true) result = result.filter(d => d.aptoPerros)
  if (filters.aptoGatos  === true) result = result.filter(d => d.aptoGatos)
  if (filters.castrado   === true) result = result.filter(d => d.castrado)
  if (filters.necesitaJardin === true) result = result.filter(d => d.necesitaJardin)

  return result
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

const DEFAULT_LIMIT = 30

export class DogService implements IDogService {

  private get authHeaders() {
    return buildAuthHeaders()
  }

  async getDogs(filters: DogFilters = {}): Promise<PaginatedDogs> {
    const res = await axios.get<MsDog[]>(API_ENDPOINTS.DOGS.LIST)
    const allDogs = res.data.map(mapMsDogToFrontend)
    const filtered = applyClientFilters(allDogs, filters)

    const total = filtered.length
    const page  = filters.page  ?? 1
    const limit = filters.limit ?? DEFAULT_LIMIT
    const data  = filtered.slice((page - 1) * limit, page * limit).map(toListItem)

    return { data, total, page, totalPages: Math.ceil(total / limit), limit }
  }

  async getDogById(id: string): Promise<Dog | null> {
    try {
      const res = await axios.get<MsDog>(API_ENDPOINTS.DOGS.DETAIL(id))
      return mapMsDogToFrontend(res.data)
    } catch {
      return null
    }
  }

  async getDogBySlug(_slug: string): Promise<Dog | null> {
    // El MS no soporta lookup por slug
    return null
  }

  async createDog(data: DogCreateData): Promise<Dog> {
    const body = mapCreateToMs(data)
    const res = await axios.post<MsDog>(
      API_ENDPOINTS.DOGS.CREATE,
      body,
      { headers: this.authHeaders }
    )
    return mapMsDogToFrontend(res.data)
  }

  async updateDog(id: string, data: DogUpdateData): Promise<Dog> {
    // MS usa PUT (reemplazo completo) — primero obtenemos el estado actual
    const current = await this.getDogById(id)
    if (!current) throw new Error(`Perro ${id} no encontrado`)

    const body = mapUpdateToMs(current, data)
    const res = await axios.put<MsDog>(
      API_ENDPOINTS.DOGS.UPDATE(id),
      body,
      { headers: this.authHeaders }
    )
    return mapMsDogToFrontend(res.data)
  }

  async deleteDog(_id: string): Promise<void> {
    // El MS no expone endpoint DELETE
    throw new Error('El MS de perros no soporta eliminación de perros')
  }

  async publishDog(id: string): Promise<Dog> {
    return this.updateDog(id, { estado: 'disponible' })
  }

  async unpublishDog(id: string): Promise<Dog> {
    return this.updateDog(id, { estado: 'no_disponible' })
  }

  async validateMedia(urls: string[]): Promise<MediaValidationResult[]> {
    const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
    return urls.map(url => {
      if (!url?.trim()) return { url, valid: false, error: 'not_found' as const }
      const lower = url.toLowerCase()
      if (!VALID_EXTS.some(ext => lower.includes(ext)))
        return { url, valid: false, error: 'invalid_format' as const }
      if (!lower.startsWith('/') && !lower.startsWith('http'))
        return { url, valid: false, error: 'unreachable' as const }
      return { url, valid: true }
    })
  }
}
