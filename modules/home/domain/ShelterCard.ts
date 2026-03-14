// modules/home/domain/ShelterCard.ts

export interface ShelterCard {
  id: number
  nombre: string
  slug: string
  ubicacion: string
  ciudad: string
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
