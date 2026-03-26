// modules/profile/infrastructure/ProfileServiceFactory.ts
import type { IProfileService } from './IProfileService'
import { MockProfileService } from './MockProfileService'

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export const profileService: IProfileService = useMock
  ? new MockProfileService()
  : new MockProfileService() // swap por ProfileService real cuando exista
