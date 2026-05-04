// modules/home/domain/ShelterCard.ts

export interface ShelterCard {
  id: string
  nombre: string
  logo: string
  imagenPortada: string
  alcaldia: string | null
  adopcionesRealizadas: number
  perrosDisponibles: number
  calificacion?: number
}

export interface PaginatedShelterCards {
  data: ShelterCard[]
  total: number
  page: number
  totalPages: number
  limit: number
}
