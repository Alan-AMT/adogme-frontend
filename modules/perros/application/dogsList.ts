import { Dog } from "../domain/dog";
import { DogFilters } from "../domain/dogFilters";
import { DogsList } from "../domain/IDogsList";

export const getDogsList = async (
  repository: DogsList,
  filters: DogFilters,
): Promise<Dog[]> => {
  try {
    return await repository.getDogs(filters);
  } catch (error) {
    console.error("Use Case Error:", error);
    throw new Error("Could not fetch dogs list.");
  }
};
