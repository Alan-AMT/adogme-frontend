import { ShelterCard } from "../domain/ShelterCard";
import { HomeSheltersListRepository } from "../domain/IHomeSheltersList";

export class MockHomeSheltersListRepository implements HomeSheltersListRepository {
  public async getHomeSheltersList(): Promise<ShelterCard[]> {
    const shelters = [
      {
        id: 1,
        name: "Callejeritos",
        description: "Un lugar seguro para perros en busca de hogar.",
        imageUrl: "/dog1.jpg",
      },
    ];
    return shelters.map((shelter) => {
      const mapped: ShelterCard = {
        id: shelter.id,
        name: shelter.name,
        description: shelter.description,
        imageUrl: shelter.imageUrl,
      };
      return mapped;
    });
  }
}
