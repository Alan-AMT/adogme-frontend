// modules/donations/infrastructure/DonationServiceFactory.ts
// Singleton del servicio de donaciones.

import { MockDonationService } from './MockDonationService'
import type { IDonationService } from './IDonationService'

export const donationService: IDonationService = new MockDonationService()
