import { Dog } from "../domain/dog";
import { DogFilters } from "../domain/dogFilters";
import { IDogsList } from "../domain/IDogsList";

export const getDogsList = async (
  repository: IDogsList,
  filters: DogFilters,
): Promise<Dog[]> => {
  try {
    return await repository.getDogs(filters);
  } catch (error) {
    console.error("Use Case Error:", error);
    throw new Error("Could not fetch dogs list.");
  }
};
