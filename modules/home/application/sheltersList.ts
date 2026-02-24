//adogme-frontend\modules\home\application\sheltersList.ts
import { HomeSheltersListRepository } from "../domain/IHomeSheltersList";
import { ShelterCard } from "../domain/ShelterCard";

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
