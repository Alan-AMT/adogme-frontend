// modules/auth/infrastructure/MockAuthService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mock implementation of IAuthService — uses hardcoded MOCK_CREDENTIALS.
// Active when NEXT_PUBLIC_USE_MOCK=true.
//
// TEST CREDENTIALS:
//   adoptante  : ana@test.com          / test1234
//   shelter    : refugio@huellitas.com / shelter123
//   pending    : nuevo@refugio.com     / pending123    ← throws SHELTER_PENDING
//   admin      : admin@plataforma.com  / admin123
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import type { AuthResponse, ShelterUser } from "@/modules/shared/domain/User";
import { MOCK_CREDENTIALS } from "@/modules/shared/mockData/users.mock";
import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
import { buildMockToken } from "@/modules/shared/infrastructure/auth/tokenManager";
import type {
  IAuthService,
  LoginCredentials,
  RegisterData,
  ShelterRegisterData,
} from "./IAuthService";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Class ───────────────────────────────────────────────────────────────────

export class MockAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(600);

    const record = MOCK_CREDENTIALS[credentials.email];
    if (!record || record.password !== credentials.password) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    const user = record.user;

    if (
      user.role === "shelter" &&
      (user as ShelterUser).shelterStatus === "pending"
    ) {
      throw new Error(
        "SHELTER_PENDING: Tu solicitud de refugio está en revisión. " +
          "Te notificaremos por correo cuando sea aprobada.",
      );
    }

    const accessToken = buildMockToken(user);
    const refreshToken = `refresh-${user.id}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const store = useAuthStore.getState();
    store.setUser(user);
    store.setTokens(accessToken, refreshToken);

    return { user, accessToken, refreshToken, expiresAt };
  }

  async register(data: RegisterData): Promise<void> {
    await delay(600);

    if (MOCK_CREDENTIALS[data.email]) {
      throw new Error("El correo ya está registrado.");
    }
  }

  async registerShelter(data: ShelterRegisterData): Promise<void> {
    await delay(600);

    if (MOCK_CREDENTIALS[data.email]) {
      throw new Error("El correo ya está registrado.");
    }
  }

  async forgotPassword(_email: string): Promise<void> {
    await delay(600);
  }

  async resetPassword(_token: string, _password: string): Promise<void> {
    await delay(600);
  }

  async logout(): Promise<void> {
    useAuthStore.getState().logout();
  }
}
