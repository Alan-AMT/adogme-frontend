import { DogCard } from "../domain/DogCard";
import { HomeDogsListRepository } from "../domain/IHomeDogsList";

export class MockHomedogsListRepository implements HomeDogsListRepository {
  public async getMainDogs(): Promise<DogCard[]> {
    return [
      {
        id: 1, refugio_id: 1, nombre: "Max", edad: 2, raza: "Labrador",
        tamano: "Grande", nivelEnergia: "Alta", sexo: "Macho", salud: "Buena",
        estado: "Disponible", compatibilidad: 9.5, fechaRegistro: "2024-01-10",
        descripcion: "Muy juguetón y activo.", imageUrl: "/dog1.jpg"
      },
      {
        id: 2, refugio_id: 2, nombre: "Bella", edad: 1, raza: "Poodle",
        tamano: "Pequeño", nivelEnergia: "Media", sexo: "Hembra", salud: "Excelente",
        estado: "En adopción", compatibilidad: 8.0, fechaRegistro: "2024-02-15",
        descripcion: "Cariñosa y tranquila.", imageUrl: "/dog1.jpg"
      },
      {
        id: 3, refugio_id: 3, nombre: "Rocky", edad: 3, raza: "Pastor Alemán",
        tamano: "Grande", nivelEnergia: "Alta", sexo: "Macho", salud: "Buena",
        estado: "Disponible", compatibilidad: 7.5, fechaRegistro: "2023-11-20",
        descripcion: "Protector y leal.", imageUrl: "/dog1.jpg"
      },
      {
        id: 4, refugio_id: 2, nombre: "Luna", edad: 4, raza: "Mestizo",
        tamano: "Mediano", nivelEnergia: "Baja", sexo: "Hembra", salud: "Estable",
        estado: "Disponible", compatibilidad: 9.0, fechaRegistro: "2024-03-01",
        descripcion: "Ideal para departamentos.", imageUrl: "/dog1.jpg"
      },
      {
        id: 5, refugio_id: 1, nombre: "Toby", edad: 2, raza: "Beagle",
        tamano: "Mediano", nivelEnergia: "Alta", sexo: "Macho", salud: "Buena",
        estado: "Disponible", compatibilidad: 8.5, fechaRegistro: "2024-01-25",
        descripcion: "Le encanta olfatear todo.", imageUrl: "/dog1.jpg"
      },
      {
        id: 6, refugio_id: 2, nombre: "Daisy", edad: 5, raza: "Golden Retriever",
        tamano: "Grande", nivelEnergia: "Media", sexo: "Hembra", salud: "Buena",
        estado: "Adoptado", compatibilidad: 9.8, fechaRegistro: "2023-10-12",
        descripcion: "La mejor compañera para niños.", imageUrl: "/dog1.jpg"
      },
      {
        id: 7, refugio_id: 1, nombre: "Coco", edad: 1, raza: "Chihuahua",
        tamano: "Pequeño", nivelEnergia: "Alta", sexo: "Macho", salud: "Buena",
        estado: "Disponible", compatibilidad: 6.5, fechaRegistro: "2024-04-05",
        descripcion: "Pequeño pero con gran personalidad.", imageUrl: "/dog1.jpg"
      },
      {
        id: 8, refugio_id: 1, nombre: "Milo", edad: 2, raza: "Bulldog",
        tamano: "Mediano", nivelEnergia: "Baja", sexo: "Macho", salud: "Buena",
        estado: "En tratamiento", compatibilidad: 7.0, fechaRegistro: "2024-02-28",
        descripcion: "Dormilón y muy dócil.", imageUrl: "/dog1.jpg"
      },
      {
        id: 9, refugio_id: 3, nombre: "Sasha", edad: 3, raza: "Husky",
        tamano: "Grande", nivelEnergia: "Extrema", sexo: "Hembra", salud: "Buena",
        estado: "Disponible", compatibilidad: 8.2, fechaRegistro: "2024-01-15",
        descripcion: "Necesita mucho ejercicio y espacio.", imageUrl: "/dog1.jpg"
      },
      {
        id: 10, refugio_id: 1, nombre: "Bruno", edad: 6, raza: "Boxer",
        tamano: "Grande", nivelEnergia: "Media", sexo: "Macho", salud: "Buena",
        estado: "Disponible", compatibilidad: 8.8, fechaRegistro: "2023-12-05",
        descripcion: "Un caballero maduro y educado.", imageUrl: "/dog1.jpg"
      }
    ];
  }
}
