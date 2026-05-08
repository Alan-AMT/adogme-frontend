// modules/recommendations/infrastructure/MLServiceFactory.ts
// Selecciona implementación de IMLService según env:
//   NEXT_PUBLIC_USE_MOCK=true  → MockMLService (sin red)
//   default                    → MLService real (HTTP al microservicio ML)

import type { IMLService } from "./IMLService";
import { MLService } from "./MLService";
import { MockMLService } from "./MockMLService";

const useMock = false;
// const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export const mlService: IMLService = useMock
  ? new MockMLService()
  : new MLService();
