// modules/admin/infrastructure/MockAdminService.ts
// Archivo 198 — Implementación mock del panel de administración.
// Opera sobre copias mutables en memoria de los datos mock.
// Aprobación de refugios, moderación de perros y edición de contenido.

import type { Shelter }        from '@/modules/shared/domain/Shelter'
import type { Dog, DogStatus } from '@/modules/shared/domain/Dog'
import type { AdoptionStep, ChatbotFAQ } from '@/modules/shared/mockData/content.mock'
import { MOCK_SHELTERS, MOCK_PENDING_SHELTERS } from '@/modules/shared/mockData/shelters.mock'
import { MOCK_DOGS }                            from '@/modules/shared/mockData/dogs.mock'
import {
  MOCK_ADOPTION_PROCESS,
  MOCK_CHATBOT_FAQS,
  MOCK_GLOBAL_STATS,
} from '@/modules/shared/mockData/content.mock'
import type { IAdminService, AdminStats } from './IAdminService'

// ─── Copias mutables en memoria ───────────────────────────────────────────────

let _shelters:       Shelter[]      = [...MOCK_SHELTERS, ...MOCK_PENDING_SHELTERS]
let _dogs:           Dog[]          = [...MOCK_DOGS]
let _adoptionProcess: AdoptionStep[] = [...MOCK_ADOPTION_PROCESS]
let _faqs:           ChatbotFAQ[]   = [...MOCK_CHATBOT_FAQS]

const delay = (ms = 400) => new Promise<void>(r => setTimeout(r, ms))

// ─── Implementación ────────────────────────────────────────────────────────────

export class MockAdminService implements IAdminService {

  // ── Dashboard ────────────────────────────────────────────────────────────────

  async getStats(): Promise<AdminStats> {
    await delay()
    return {
      ...MOCK_GLOBAL_STATS,
      refugiosPendientes:  _shelters.filter(s => s.status === 'pending').length,
      refugiosAprobados:   _shelters.filter(s => s.status === 'approved').length,
      refugiosSuspendidos: _shelters.filter(s => s.status === 'suspended').length,
      refugiosRechazados:  _shelters.filter(s => s.status === 'rejected').length,
      perrosDisponibles:   _dogs.filter(d => d.estado === 'disponible').length,
      perrosEnProceso:     _dogs.filter(d => d.estado === 'en_proceso').length,
      perrosAdoptados:     _dogs.filter(d => d.estado === 'adoptado').length,
    }
  }

  // ── Gestión de refugios ───────────────────────────────────────────────────────

  async getAllShelters(): Promise<Shelter[]> {
    await delay()
    return [..._shelters]
  }

  async getShelterById(id: string): Promise<Shelter | null> {
    await delay(200)
    return _shelters.find(s => s.id === id) ?? null
  }

  async approveShelter(id: string, _nota?: string): Promise<Shelter> {
    await delay()
    const idx = _shelters.findIndex(s => s.id === id)
    if (idx === -1) throw new Error(`Refugio ${id} no encontrado`)
    _shelters[idx] = { ..._shelters[idx], status: 'approved', aprobado: true }
    return _shelters[idx]
  }

  async rejectShelter(id: string, _nota?: string): Promise<Shelter> {
    await delay()
    const idx = _shelters.findIndex(s => s.id === id)
    if (idx === -1) throw new Error(`Refugio ${id} no encontrado`)
    _shelters[idx] = { ..._shelters[idx], status: 'rejected', aprobado: false }
    return _shelters[idx]
  }

  async suspendShelter(id: string, _nota?: string): Promise<Shelter> {
    await delay()
    const idx = _shelters.findIndex(s => s.id === id)
    if (idx === -1) throw new Error(`Refugio ${id} no encontrado`)
    _shelters[idx] = { ..._shelters[idx], status: 'suspended', aprobado: false }
    return _shelters[idx]
  }

  // ── Moderación de perros ──────────────────────────────────────────────────────

  async getAllDogs(): Promise<Dog[]> {
    await delay()
    return [..._dogs]
  }

  async updateDogStatus(id: string, status: DogStatus): Promise<Dog> {
    await delay()
    const idx = _dogs.findIndex(d => d.id === id)
    if (idx === -1) throw new Error(`Perro ${id} no encontrado`)
    _dogs[idx] = { ..._dogs[idx], estado: status }
    return _dogs[idx]
  }

  // ── Gestión de contenido ──────────────────────────────────────────────────────

  async getAdoptionProcess(): Promise<AdoptionStep[]> {
    await delay(200)
    return [..._adoptionProcess]
  }

  async updateAdoptionProcess(steps: AdoptionStep[]): Promise<AdoptionStep[]> {
    await delay()
    _adoptionProcess = [...steps]
    return _adoptionProcess
  }

  async getChatbotFAQs(): Promise<ChatbotFAQ[]> {
    await delay(200)
    return [..._faqs]
  }

  async updateChatbotFAQs(faqs: ChatbotFAQ[]): Promise<ChatbotFAQ[]> {
    await delay()
    _faqs = [...faqs]
    return _faqs
  }
}
