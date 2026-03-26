// modules/home/domain/DogCard.ts

export interface DogCard {
  id: number
  nombre: string
  raza: string
  descripcion: string
  edad: number
  tamano: string
  nivelEnergia: string
  salud: string
  estado: string
  imageUrl: string
  // Raw values for client-side filtering in hero
  tamanoRaw?: string
  nivelEnergiaRaw?: string
  edadCat?: string
}
