// modules/auth/infrastructure/AuthService.ts
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
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
    const res = await apiClient.post<{
      user: AuthResponse["user"];
      accessToken: string;
      refreshToken: string;
    }>(API_ENDPOINTS.AUTH.LOGIN, payload);

    const { user, accessToken, refreshToken } = res.data;

    const store = useAuthStore.getState();
    store.setUser(user);
    store.setTokens(accessToken, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
  }

  async register(data: RegisterData): Promise<void> {
    const payload = {
      email: data.email,
      name: data.name,
      password: data.password,
    };
    await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  }

  async registerShelter(data: ShelterRegisterData): Promise<void> {
    const userPayload = {
      email: data.email,
      name: data.name,
      password: data.password,
    };

    const { data: resData } = await apiClient.post<{ user: { id: string } }>(
      API_ENDPOINTS.AUTH.REGISTER_SHELTER,
      userPayload,
    );

    const userId = resData?.user?.id;

    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario creado.");
    }

    const shelterPayload = {
      userId: String(userId),
      name: data.shelterName,
      description: data.description,
      phone: data.shelterPhone,
      email: data.shelterEmail,
      ubicacion: data.municipality,
    };

    await apiClient.post(API_ENDPOINTS.SHELTERS.CREATE, shelterPayload);
  }

  async forgotPassword(email: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async resetPassword(token: string, password: string): Promise<void> {
    throw new Error("Not implemented");
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
