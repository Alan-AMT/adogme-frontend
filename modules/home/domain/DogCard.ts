// modules/home/domain/DogCard.ts

export interface DogCard {
  id: string
  nombre: string
  raza: string
  edad: number
  tamano: string
  nivelEnergia: string
  estado: string
  imageUrl: string
  // Raw values for client-side filtering in hero
  tamanoRaw?: string
  nivelEnergiaRaw?: string
  edadCat?: string
}
