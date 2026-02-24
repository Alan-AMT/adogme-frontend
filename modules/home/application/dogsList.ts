//adogme-frontend\modules\home\application\dogsList.ts
import { DogCard } from "../domain/DogCard";
import { HomeDogsListRepository } from "../domain/IHomeDogsList";

export const getHomeDogsList = async (
  repository: HomeDogsListRepository,
): Promise<DogCard[]> => {
  try {
    return await repository.getMainDogs();
  } catch (error) {
    console.error("Use Case Error:", error);
    throw new Error("Could not fetch the dog list.");
  }
};
