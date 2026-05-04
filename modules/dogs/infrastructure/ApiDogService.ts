// modules/dogs/infrastructure/ApiDogService.ts
// Implementación HTTP de IDogService — habla con dogs-ms.
//
// Solo implementa los métodos de READ que el flujo del quiz necesita.
// Para escritura (create/update/delete/publish) y media, delega al MockDogService
// para que el resto de la app no se rompa hasta que esos endpoints estén
// integrados.

import type { Dog, DogFilters, PaginatedDogs } from '../domain/dog'
import type {
  IDogService,
  DogCreateData,
  DogUpdateData,
  MediaValidationResult,
} from './IDogService'
import { apiClient }     from '@/modules/shared/infrastructure/api/apiClient'
import { API_ENDPOINTS } from '@/modules/shared/infrastructure/api/endpoints'
import { mapApiDogToDog, type ApiDog } from './mapApiDog'
import { MockDogService } from './MockDogService'

export class ApiDogService implements IDogService {

  // Fallback para métodos no implementados aún
  private readonly mock = new MockDogService()

  // ── READ ──────────────────────────────────────────────────────────────────

  async getDogById(id: string): Promise<Dog | null> {
    try {
      const { data } = await apiClient.get<ApiDog>(API_ENDPOINTS.DOGS.BY_ID(id))
      if (!data) return null
      return mapApiDogToDog(data)
    } catch (err) {
      console.warn('[ApiDogService.getDogById] failed for id', id, err)
      return null
    }
  }

  async getDogBySlug(slug: string): Promise<Dog | null> {
    try {
      const { data } = await apiClient.get<ApiDog>(API_ENDPOINTS.DOGS.BY_SLUG(slug))
      if (!data) return null
      return mapApiDogToDog(data)
    } catch (err) {
      console.warn('[ApiDogService.getDogBySlug] failed for slug', slug, err)
      return null
    }
  }

  async getDogs(filters?: DogFilters): Promise<PaginatedDogs> {
    try {
      const { data } = await apiClient.get<unknown>(API_ENDPOINTS.DOGS.LIST, {
        params: filters,
      })

      // Acepta tanto array como { data, total, page, ... }
      const list: ApiDog[] = Array.isArray(data)
        ? (data as ApiDog[])
        : ((data as { data?: ApiDog[] })?.data ?? [])

      const dogs = list.map(mapApiDogToDog)

      return {
        data:       dogs,
        total:      (data as { total?: number })?.total ?? dogs.length,
        page:       (data as { page?: number })?.page ?? 1,
        totalPages: (data as { totalPages?: number })?.totalPages ?? 1,
        limit:      filters?.limit ?? dogs.length,
      }
    } catch (err) {
      console.warn('[ApiDogService.getDogs] failed, falling back to mock', err)
      return this.mock.getDogs(filters)
    }
  }

  // ── WRITE — todavía no integrado, delegamos al mock ──────────────────────

  createDog(data: DogCreateData): Promise<Dog> {
    return this.mock.createDog(data)
  }

  updateDog(id: string, data: DogUpdateData): Promise<Dog> {
    return this.mock.updateDog(id, data)
  }

  deleteDog(id: string): Promise<void> {
    return this.mock.deleteDog(id)
  }

  publishDog(id: string): Promise<Dog> {
    return this.mock.publishDog(id)
  }

  unpublishDog(id: string): Promise<Dog> {
    return this.mock.unpublishDog(id)
  }

  validateMedia(urls: string[]): Promise<MediaValidationResult[]> {
    return this.mock.validateMedia(urls)
  }
}
