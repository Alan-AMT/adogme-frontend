// modules/auth/domain/AuthUser.ts

export type UserRole = "adoptante" | "refugio" | "administrador";

export interface LoginCredentials {
  correo: string;
  contrasena: string;
  recordar?: boolean;
}

export interface RegisterAdoptante {
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
  // Dirección
  alcaldia: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  codigoPostal: string;
}

export interface RegisterRefugio {
  nombre: string;
  ubicacion: string;
  descripcion: string;
  correo: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface AuthResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  token: string;
}
