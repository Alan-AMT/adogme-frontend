import { DogFilters } from "../domain/dogFilters";
import { Dog } from "../domain/dog";
import { DogsList } from "../domain/IDogsList";

export class MockDogsList implements DogsList {
  public async getDogs(filters: DogFilters) {
    const data = [
      {
        name: "Max",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 3,
      },
      {
        name: "Cindy",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 1,
      },
      {
        name: "Rex",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 7,
      },
      {
        name: "Cooper",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 8,
      },
      {
        name: "Amy",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 9,
      },
      {
        name: "Nolan",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 12,
      },
      {
        name: "Regy",
        shelter: "Refugio Patitas GAM",
        imageUrl: "/dog1.jpg",
        age: 2,
      },
    ];
    return data.map((dog) => {
      const mapped: Dog = {
        name: dog.name,
        imageUrl: dog.imageUrl,
        age: dog.age,
        shelterName: dog.shelter,
      };
      return mapped;
    });
  }
}
