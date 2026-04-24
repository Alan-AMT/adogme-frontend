// modules/profile/infrastructure/ProfileServiceFactory.ts
import type { IProfileService } from './IProfileService'
import { MockProfileService } from './MockProfileService'
import { ProfileService } from './ProfileService'

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export const profileService: IProfileService = useMock
  ? new MockProfileService()
  : new ProfileService()
