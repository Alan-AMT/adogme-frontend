import { AdoptionStory } from "../domain/AdoptionStory";

export class MockAdoptionStoriesRepository {
  async getLatestStories(): Promise<AdoptionStory[]> {
    return [
      {
        id: 1,
        dogName: "Bobby",
        adopterName: "Familia García",
        storyShort: "Bobby encontró el hogar perfecto después de 2 años en el refugio. Ahora corre feliz en su nuevo jardín.",
        imageUrl: "/adoptionStory1.jpg",
        date: "Hace 2 semanas"
      },
      {
        id: 2,
        dogName: "Luna",
        adopterName: "Carla Jiménez",
        storyShort: "Luna era muy tímida, pero con paciencia y amor se ha convertido en la reina de la casa.",
        imageUrl: "/adoptionStory1.jpg",
        date: "Hace 1 mes"
      },
      {
        id: 3,
        dogName: "Rocky",
        adopterName: "Andrés Pozos",
        storyShort: "De las calles de la GAM a dormir en un sofá caliente. Una transformación increíble.",
        imageUrl: "/adoptionStory1.jpg",
        date: "Hace 3 días"
      }
    ];
  }
}
