// modules/auth/infrastructure/AuthService.ts
import axios from "axios";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
import { enrichUser } from "@/modules/shared/infrastructure/auth/enrichUser";
import type { Adoptante } from "@/modules/shared/domain/User";
import type {
  IAuthService,
  RegisterData,
  ShelterRegisterData,
  LoginCredentials,
  AuthResponse,
} from "./IAuthService";

export class AuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };

    let res;
    try {
      res = await apiClient.post<{
        user: AuthResponse["user"];
        accessToken: string;
        refreshToken: string;
      }>(API_ENDPOINTS.AUTH.LOGIN, payload);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 401 || status === 400)
          throw new Error(
            "Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.",
          );
        if (status === 404)
          throw new Error("No encontramos una cuenta con ese correo.");
        if (status === 429)
          throw new Error(
            "Demasiados intentos fallidos. Espera unos minutos antes de intentar de nuevo.",
          );
      }
      throw new Error("No pudimos iniciar sesión. Intenta de nuevo más tarde.");
    }

    const { user, accessToken, refreshToken } = res.data;

    const store = useAuthStore.getState();
    store.setTokens(accessToken, refreshToken);
    const enriched = await enrichUser(user);
    store.setUser(enriched);

    return {
      user: enriched,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const userPayload = {
      email: data.email,
      name: data.name,
      password: data.password,
    };

    const { data: resData } = await apiClient.post<{
      user: AuthResponse["user"];
      accessToken: string;
      refreshToken: string;
    }>(API_ENDPOINTS.AUTH.REGISTER, userPayload);

    const { user, accessToken, refreshToken } = resData;
    const store = useAuthStore.getState();
    store.setTokens(accessToken, refreshToken);

    if (!user.id) {
      throw new Error("No se pudo obtener el ID del usuario creado.");
    }

    const profilePayload = {
      userId: String(user.id),
      userName: data.name,
      address: data.address ?? "",
      postalCode: data.postalCode ?? "",
      phone: data.phone,
      email: data.email,
    };

    const { data: profile } = await apiClient.post<{
      id: string;
      userId: string;
      userName: string;
      address: string;
      postalCode: string;
      phone: string | null;
      email: string | null;
      avatarUrl: string | null;
      vector: number[];
    }>(API_ENDPOINTS.APPLICANTS.REGISTER, profilePayload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const adoptante: Adoptante = {
      ...user,
      role: "applicant",
      email: profile.email ?? user.email,
      phone: profile.phone ?? undefined,
      address: profile.address,
      avatarUrl: profile.avatarUrl ?? undefined,
      applicantId: profile.id,
    };
    const enriched = await enrichUser(adoptante);
    store.setUser(enriched);

    return {
      user: enriched,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
  }

  async registerShelter(data: ShelterRegisterData): Promise<void> {
    const userPayload = {
      email: data.email,
      name: data.name,
      password: data.password,
    };

    const { data: resData } = await apiClient.post<{
      user: AuthResponse["user"];
      accessToken: string;
      refreshToken: string;
    }>(API_ENDPOINTS.AUTH.REGISTER_SHELTER, userPayload);

    const { user, accessToken, refreshToken } = resData;
    const store = useAuthStore.getState();
    store.setUser(user);
    store.setTokens(accessToken, refreshToken);

    if (!user.id) {
      throw new Error("No se pudo obtener el ID del usuario creado.");
    }

    const shelterPayload = {
      userOwnerId: String(user.id),
      name: data.shelterName,
      description: data.description,
      phone: data.shelterPhone,
      email: data.shelterEmail,
      website: data.shelterWebsite,
      municipality: data.municipality,
      fullAddress: data.fullAddress,
      schedule: data.schedule,
    };

    await apiClient.post(API_ENDPOINTS.SHELTERS.CREATE, shelterPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const enriched = await enrichUser(user);
    store.setUser(enriched);
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT, { email });
  }

  async resetPassword(email: string, token: string, password: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET, { email, token, newPassword: password });
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore API errors on logout — always clear local state
    }
    useAuthStore.getState().logout();
  }
}
