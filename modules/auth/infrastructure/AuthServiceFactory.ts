// modules/auth/infrastructure/AuthServiceFactory.ts
// ─────────────────────────────────────────────────────────────────────────────
// Singleton auth service instance.
// Selects implementation based on environment variable:
//   NEXT_PUBLIC_USE_MOCK=true  → MockAuthService (dev/staging)
//   otherwise                  → AuthService (production)
// ─────────────────────────────────────────────────────────────────────────────

import type { IAuthService } from "./IAuthService";
import { MockAuthService } from "./MockAuthService";
import { AuthService } from "./AuthService";

// const isMock = false;
const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const authService: IAuthService = isMock
  ? new MockAuthService()
  : new AuthService();
