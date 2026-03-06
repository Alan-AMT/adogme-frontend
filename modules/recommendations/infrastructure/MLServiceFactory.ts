// modules/recommendations/infrastructure/MLServiceFactory.ts
import type { IMLService } from './IMLService'
import { MockMLService } from './MockMLService'

export const mlService: IMLService = new MockMLService()
// swap por implementación real (API call al backend ML) cuando exista
