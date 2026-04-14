// modules/shared/mockData/users.mock.ts
// One user per role — test credentials documented here
//
// ┌─────────────────────────────────────────────────────┐
// │  TEST CREDENTIALS                                   │
// │  applicant:       ana@test.com        / test1234    │
// │  shelter:         refugio@huellitas.com / shelter123│
// │  shelter_pending: nuevo@refugio.com   / pending123  │
// │  admin:           admin@plataforma.com / admin123   │
// └─────────────────────────────────────────────────────┘

import type { Administrador, Adoptante, ShelterUser } from "../domain/User";
import { SHELTER_IDS } from "./shelters.mock";

// ─── Adoptante ───────────────────────────────────────────────────────────────

export const MOCK_ADOPTANTE: Adoptante = {
  id: 101,
  name: "Ana García",
  email: "ana@test.com",
  role: "applicant",
};

// ─── Shelter (approved) ──────────────────────────────────────────────────────

export const MOCK_SHELTER_USER: ShelterUser = {
  id: 201,
  name: "Refugio Huellitas MX",
  email: "refugio@huellitas.com",
  role: "shelter",
  shelterId: SHELTER_IDS.HUELLITAS,
  shelterStatus: "approved",
};

// ─── Shelter (pending) ───────────────────────────────────────────────────────

export const MOCK_SHELTER_PENDING_USER: ShelterUser = {
  id: 202,
  name: "Rescate Centro",
  email: "nuevo@refugio.com",
  role: "shelter",
  shelterId: SHELTER_IDS.PENDING_BAJIO,
  shelterStatus: "pending",
};

// ─── Admin ───────────────────────────────────────────────────────────────────

export const MOCK_ADMIN: Administrador = {
  id: 301,
  name: "Admin Plataforma",
  email: "admin@plataforma.com",
  role: "admin",
};

// ─── Credentials map for mock login ──────────────────────────────────────────

export const MOCK_CREDENTIALS: Record<
  string,
  { password: string; user: Adoptante | ShelterUser | Administrador }
> = {
  "ana@test.com": { password: "test1234", user: MOCK_ADOPTANTE },
  "refugio@huellitas.com": { password: "shelter123", user: MOCK_SHELTER_USER },
  "nuevo@refugio.com": {
    password: "pending123",
    user: MOCK_SHELTER_PENDING_USER,
  },
  "admin@plataforma.com": { password: "admin123", user: MOCK_ADMIN },
};

export const MOCK_USERS = [
  MOCK_ADOPTANTE,
  MOCK_SHELTER_USER,
  MOCK_SHELTER_PENDING_USER,
  MOCK_ADMIN,
];
