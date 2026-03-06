// modules/shared/mockData/users.mock.ts
// Un usuario por rol — credenciales documentadas aquí
//
// ┌─────────────────────────────────────────────────────┐
// │  CREDENCIALES DE PRUEBA                             │
// │  applicant:       ana@test.com        / test1234    │
// │  shelter:         refugio@huellitas.com / shelter123│
// │  shelter_pending: nuevo@refugio.com   / pending123  │
// │  admin:           admin@plataforma.com / admin123   │
// └─────────────────────────────────────────────────────┘

import type { Administrador, Adoptante, ShelterUser } from '../domain/User'
import { SHELTER_IDS } from './shelters.mock'

// ─── Adoptante ────────────────────────────────────────────────────────────────

export const MOCK_ADOPTANTE: Adoptante = {
  id: 101,
  nombre: 'Ana García',
  correo: 'ana@test.com',
  telefono: '55 1111 2222',
  role: 'applicant',
  status: 'active',
  avatarUrl: '/assets/avatars/avatar1.png',
  fechaRegistro: '2024-09-01',
  direccion: 'Calle Reforma 123, Col. Juárez, CDMX',
}

// ─── Shelter aprobado ─────────────────────────────────────────────────────────

export const MOCK_SHELTER_USER: ShelterUser = {
  id: 201,
  nombre: 'Refugio Huellitas MX',
  correo: 'refugio@huellitas.com',
  telefono: '55 1234 5678',
  role: 'shelter',
  status: 'active',
  avatarUrl: '/assets/shelters/shelter1-logo.jpg',
  fechaRegistro: '2024-01-15',
  shelterId: SHELTER_IDS.HUELLITAS,
  shelterStatus: 'approved',
}

// ─── Shelter pendiente ────────────────────────────────────────────────────────

export const MOCK_SHELTER_PENDING_USER: ShelterUser = {
  id: 202,
  nombre: 'Rescate Centro',
  correo: 'nuevo@refugio.com',
  telefono: '47 7788 9900',
  role: 'shelter',
  status: 'pending_verification',
  avatarUrl: '/assets/shelters/shelter3-logo.jpg',
  fechaRegistro: '2025-01-20',
  shelterId: SHELTER_IDS.PENDING_BAJIO,
  shelterStatus: 'pending',
}

// ─── Administrador ────────────────────────────────────────────────────────────

export const MOCK_ADMIN: Administrador = {
  id: 301,
  nombre: 'Admin Plataforma',
  correo: 'admin@plataforma.com',
  telefono: '55 9999 0000',
  role: 'admin',
  status: 'active',
  avatarUrl: '/assets/avatars/avatar2.png',
  fechaRegistro: '2023-01-01',
  puesto: 'Administrador General',
}

// ─── Mapa para simular login ──────────────────────────────────────────────────
// El MockAuthService busca aquí por correo + password

export const MOCK_CREDENTIALS: Record<string, { password: string; user: Adoptante | ShelterUser | Administrador }> = {
  'ana@test.com':           { password: 'test1234',    user: MOCK_ADOPTANTE },
  'refugio@huellitas.com':  { password: 'shelter123',  user: MOCK_SHELTER_USER },
  'nuevo@refugio.com':      { password: 'pending123',  user: MOCK_SHELTER_PENDING_USER },
  'admin@plataforma.com':   { password: 'admin123',    user: MOCK_ADMIN },
}

export const MOCK_USERS = [MOCK_ADOPTANTE, MOCK_SHELTER_USER, MOCK_SHELTER_PENDING_USER, MOCK_ADMIN]
