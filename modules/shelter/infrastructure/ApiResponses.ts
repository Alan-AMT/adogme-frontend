import {
  DogSex,
  DogSize,
  DogStatus,
  EnergyLevel,
  FurLength,
  PersonalityCategory,
} from "@/modules/shared/domain";

export type CreateDogApiResponse = {
  id: string;
  userOwnerId: string;
  shelterId: string;
  status: DogStatus;
  name: string;
  breed: string;
  age: number;
  sex: DogSex;
  size: DogSize;
  energyLevel: EnergyLevel;
  description: string;
  personality: {
    id: string;
    dogId: string | null;
    label: string;
    category: PersonalityCategory;
    updatedAt: Date;
    createdAt: Date;
  }[];
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  sterilized: boolean;
  needsYard: boolean;
  isVaccinated: boolean;
  isDewormed: boolean;
  furLength: FurLength;
  vaccinations: {
    id: string;
    dogId: string;
    name: string;
    date: Date;
    verified: boolean;
    updatedAt: Date;
    createdAt: Date;
    nextDose: Date | null;
  }[];
  health: string;
  updatedAt: Date;
  createdAt: Date;
  weightKg: number | null;
  photo: string | null; // URL principal
  breed2: string | null;
  shelterName: string | null;
  shelterLogo: string | null;
};

// export type GetDogsApiResponse = {
//   data:       CreateDogApiResponse[];
//   total:      number;
//   page:       number;
//   totalPages: number;
//   limit:      number;
// };

export type GetShelterProfileApiResponse = {
  id: string;
  userOwnerId: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  municipality: string | null;
  fullAddress: string | null;
  schedule: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  approved: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  logo: string | null;
  imageUrl: string | null;
  adoptionFee: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateShelterApiResponse = {
  id: string;
  userOwnerId: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  municipality: string | null;
  fullAddress: string | null;
  schedule: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  approved: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  logo: string | null;
  imageUrl: string | null;
  adoptionFee: number | null;
  createdAt: Date;
  updatedAt: Date;
};
