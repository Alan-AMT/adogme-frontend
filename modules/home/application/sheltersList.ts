import { ShelterCard } from "../domain/ShelterCard";
import { HomeSheltersListRepository } from "../domain/IHomeSheltersList";

export const getSheltersList = async (
  repository: HomeSheltersListRepository,
): Promise<ShelterCard[]> => {
  try {
    return await repository.getHomeSheltersList();
  } catch (error) {
    console.error("Use Case Error:", error);
    throw new Error("Could not fetch the shelter list.");
  }
};
