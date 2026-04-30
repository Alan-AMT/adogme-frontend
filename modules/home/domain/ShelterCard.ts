// modules/home/domain/ShelterCard.ts

export interface ShelterCard {
  id: string
  nombre: string
  slug: string
  ubicacion: string
  alcaldia: string | null
  descripcion: string
  correo: string
  telefono: string
  logo: string
  imagenPortada: string
  fechaRegistro: string
  aprobado: boolean
  imageUrl: string
  adopcionesRealizadas: number
  perrosDisponibles: number
  calificacion?: number
}
