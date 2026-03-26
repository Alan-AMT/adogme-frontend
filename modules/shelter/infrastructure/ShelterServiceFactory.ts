// modules/shelter/infrastructure/ShelterServiceFactory.ts
import { MockShelterService } from './MockShelterService'
import type { IShelterService } from './IShelterService'

export const shelterService: IShelterService = new MockShelterService()
