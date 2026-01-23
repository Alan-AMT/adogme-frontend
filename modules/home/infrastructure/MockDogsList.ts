import { DogCard } from "../domain/DogCard";
import { HomeDogsListRepository } from "../domain/IHomeDogsList";

export class MockHomedogsListRepository implements HomeDogsListRepository {
  // El repository ya retorna el objeto, el tipo de datos
  public async getMainDogs(): Promise<DogCard[]> {
    const data = [
      {
        id: 1,
        name: "Max",
        description: "2 años, Mediano, Macho, Refugio Esperanza",
        imageUrl: "/dog1.jpg",
      },
      {
        id: 2,
        name: "Bella",
        description: "1 año, Pequeño, Hembra, Refugio Corazón",
        imageUrl: "/dog1.jpg",
      },
      {
        id: 3,
        name: "Rocky",
        description: "3 años, Grande, Macho, Refugio Amigos",
        imageUrl: "/dog1.jpg",
      },
      {
        id: 4,
        name: "Luna",
        description: "4 años, Mediano, Hembra, Refugio Huellitas",
        imageUrl: "/dog1.jpg",
      },
    ];
    return data.map((dog) => {
      const mapped: DogCard = {
        id: dog.id,
        name: dog.name,
        imageUrl: dog.imageUrl,
        description: dog.description,
      };
      return mapped;
    });
  }
}
