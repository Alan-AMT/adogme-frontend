import { ShelterCard } from "../domain/ShelterCard";

export interface HomeSheltersListRepository {
  getHomeSheltersList: () => Promise<ShelterCard[]>;
}
