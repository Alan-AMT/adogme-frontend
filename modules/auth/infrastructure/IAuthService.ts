// modules/auth/infrastructure/IAuthService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Contract that both MockAuthService (dev) and AuthService (prod) must fulfill.
// Components and hooks depend on this interface, never on a concrete class.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  AuthResponse,
  LoginCredentials,
} from "@/modules/shared/domain/User";

// ─── Registration data ──────────────────────────────────────────────────────

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;

  municipality?: string;
  neighborhood?: string;
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  postalCode?: string;
}

export interface ShelterRegisterData {
  // Account owner
  name: string;
  email: string;
  phone: string;
  password: string;

  // Shelter info
  shelterName: string;
  municipality: string;
  fullAddress: string;
  shelterPhone?: string;
  shelterEmail?: string;
  shelterWebsite?: string;
  schedule?: string;
  description?: string;
}

// ─── Auth service interface ──────────────────────────────────────────────────

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  registerShelter(data: ShelterRegisterData): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

// ─── Re-exports ──────────────────────────────────────────────────────────────

export type { AuthResponse, LoginCredentials };
