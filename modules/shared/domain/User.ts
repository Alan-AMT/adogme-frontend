// modules/shared/domain/User.ts
// Base user entities

// ─── Roles & statuses ───────────────────────────────────────────────────────

export type UserRole = "visitor" | "applicant" | "shelter" | "admin";

export type AccountStatus = "active" | "suspended" | "pending_verification";

// ─── Base entity ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ─── Adoptante ───────────────────────────────────────────────────────────────

export interface Adoptante extends User {
  role: "applicant";
  applicantId?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  avatarUrl?: string;
}

// ─── Administrador ───────────────────────────────────────────────────────────

export interface Administrador extends User {
  role: "admin";
}

// ─── Shelter user ────────────────────────────────────────────────────────────

export interface ShelterUser extends User {
  role: "shelter";
  shelterId?: string;
  shelterStatus?: "pending" | "approved" | "rejected" | "suspended";
  shelterName?: string;
  shelterLogo?: string;
  shelterAdoptionFee?: number;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: Adoptante | ShelterUser | Administrador;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterAdoptanteData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}
