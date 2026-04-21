// modules/shelter/infrastructure/ShelterServiceFactory.ts
import { MockShelterService } from "./MockShelterService";
import { ShelterService } from "./ShelterService";
import type { IShelterService } from "./IShelterService";

// const isMock = false;
const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const shelterService: IShelterService = isMock
  ? new MockShelterService()
  : new ShelterService();
