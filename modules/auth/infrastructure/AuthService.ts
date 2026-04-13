// modules/auth/infrastructure/AuthService.ts
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
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
      email: credentials.correo,
      password: credentials.password,
    };
    const res = await apiClient.post<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>(API_ENDPOINTS.AUTH.LOGIN, payload);

    return {
      user: res.data.user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // Placeholder fallback if not provided
    } as AuthResponse;
  }

  async register(data: RegisterData): Promise<void> {
    // Map to CreateAdopterDto exactly as expected by the backend
    const payload = {
      email: data.correo,
      name: data.nombre,
      password: data.password,
    };
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  }

  async registerShelter(data: ShelterRegisterData): Promise<void> {
    // Step 1: Create the User account mapping to CreateShelterDto (user)
    const userPayload = {
      email: data.correo,
      name: data.nombre,
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

    // Step 2: Create the Shelter profile mapping to CreateShelterDto (profile)
    const shelterPayload = {
      userId: String(userId),
      name: data.nombreRefugio,
      description: data.descripcion,
      phone: data.telefonoRefugio,
      email: data.correoRefugio,
      ubicacion: data.alcaldia,
      // The frontend ShelterRegisterData only has alcaldia, direccion, but DTO expects ubicacion, ciudad, estado
      // Mapping alcaldia to ubicacion per requirements
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
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }
}
