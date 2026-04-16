// modules/admin/infrastructure/IAdminService.ts
// Archivo 198a — Interfaz y tipos del servicio de administración.

import type { Shelter }        from '@/modules/shared/domain/Shelter'
import type { Dog, DogStatus } from '@/modules/shared/domain/Dog'
import type {
  AdoptionStep,
  ChatbotFAQ,
  GlobalStats,
} from '@/modules/shared/mockData/content.mock'

// ─── Stats del dashboard admin ────────────────────────────────────────────────

export interface AdminStats extends GlobalStats {
  refugiosPendientes:  number
  refugiosAprobados:   number
  refugiosSuspendidos: number
  refugiosRechazados:  number
  perrosEnProceso:     number
  perrosAdoptados:     number
}

// ─── Interfaz del servicio ────────────────────────────────────────────────────

export interface IAdminService {
  // Dashboard
  getStats(): Promise<AdminStats>

  // Gestión de refugios
  getAllShelters(): Promise<Shelter[]>
  getShelterById(id: string): Promise<Shelter | null>
  approveShelter(id: string, nota?: string): Promise<Shelter>
  rejectShelter(id: string, nota?: string): Promise<Shelter>
  suspendShelter(id: string, nota?: string): Promise<Shelter>

  // Moderación de perros
  getAllDogs(): Promise<Dog[]>
  updateDogStatus(id: string, status: DogStatus): Promise<Dog>

  // Gestión de contenido
  getAdoptionProcess(): Promise<AdoptionStep[]>
  updateAdoptionProcess(steps: AdoptionStep[]): Promise<AdoptionStep[]>
  getChatbotFAQs(): Promise<ChatbotFAQ[]>
  updateChatbotFAQs(faqs: ChatbotFAQ[]): Promise<ChatbotFAQ[]>
}
