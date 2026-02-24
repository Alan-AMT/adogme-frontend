// modules/auth/infrastructure/MockAuthService.ts

import { AuthResponse, LoginCredentials, RegisterAdoptante, RegisterRefugio } from "../domain/AuthUser";

// ── Mock users DB ──────────────────────────────────────────
export const MOCK_ADOPTANTES = [
  {
    id: 1,
    nombre: "Ana García López",
    correo: "ana.garcia@email.com",
    telefono: "55 1234 5678",
    direccion: "Calle Insurgentes 45, Col. Lindavista, Gustavo A. Madero",
    fechaRegistro: new Date("2024-01-15"),
    rol: "adoptante" as const,
  },
  {
    id: 2,
    nombre: "Carlos Mendoza Ruiz",
    correo: "carlos.mendoza@email.com",
    telefono: "55 9876 5432",
    direccion: "Av. Instituto Politécnico 120, Col. Martín Carrera, GAM",
    fechaRegistro: new Date("2024-03-22"),
    rol: "adoptante" as const,
  },
];

export const MOCK_REFUGIOS = [
  {
    id: 10,
    nombre: "Refugio Patitas Felices",
    correo: "patitas@refugio.org",
    telefono: "55 2233 4455",
    rol: "refugio" as const,
  },
];

export const MOCK_ADMINS = [
  {
    id: 100,
    nombre: "Admin Adogme",
    correo: "admin@adogme.mx",
    puesto: "Coordinador General",
    rol: "administrador" as const,
  },
];

// All mock users (password is always "password123" in mock)
const ALL_USERS = [
  ...MOCK_ADOPTANTES.map((u) => ({ ...u, contrasena: "password123" })),
  ...MOCK_REFUGIOS.map((u) => ({ ...u, contrasena: "password123" })),
  ...MOCK_ADMINS.map((u) => ({ ...u, contrasena: "password123" })),
];

// ── Mock Service ───────────────────────────────────────────
export async function mockLogin(creds: LoginCredentials): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 900)); // simulate network

  const user = ALL_USERS.find(
    (u) => u.correo === creds.correo && u.contrasena === creds.contrasena
  );

  if (!user) throw new Error("Correo o contraseña incorrectos.");

  return {
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
    token: `mock-jwt-token-${user.id}-${Date.now()}`,
  };
}

export async function mockRegisterAdoptante(data: RegisterAdoptante): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 1100));

  const exists = ALL_USERS.find((u) => u.correo === data.correo);
  if (exists) throw new Error("El correo ya está registrado.");

  const newId = Date.now();
  return {
    id: newId,
    nombre: data.nombre,
    correo: data.correo,
    rol: "adoptante",
    token: `mock-jwt-token-${newId}`,
  };
}

export async function mockRegisterRefugio(data: RegisterRefugio): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 1100));

  const exists = ALL_USERS.find((u) => u.correo === data.correo);
  if (exists) throw new Error("El correo ya está registrado.");

  const newId = Date.now();
  return {
    id: newId,
    nombre: data.nombre,
    correo: data.correo,
    rol: "refugio",
    token: `mock-jwt-token-${newId}`,
  };
}

// Alcaldías GAM + CDMX for address form
export const ALCALDIAS_CDMX = [
  "Gustavo A. Madero",
  "Azcapotzalco",
  "Iztapalapa",
  "Coyoacán",
  "Cuauhtémoc",
  "Álvaro Obregón",
  "Xochimilco",
  "Tlalpan",
  "Iztacalco",
  "Benito Juárez",
  "Miguel Hidalgo",
  "Venustiano Carranza",
  "Tláhuac",
  "La Magdalena Contreras",
  "Cuajimalpa de Morelos",
  "Milpa Alta",
];
