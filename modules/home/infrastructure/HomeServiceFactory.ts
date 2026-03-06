// modules/home/infrastructure/HomeServiceFactory.ts

import { HomeService } from "./HomeService";
import type { IHomeService } from "./IHomeService";
import { MockHomeService } from "./MockHomeService";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const homeService: IHomeService = useMock
  ? new MockHomeService()
  : new HomeService();
