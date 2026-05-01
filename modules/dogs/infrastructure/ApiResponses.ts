import {
  DogSex,
  DogSize,
  DogStatus,
  EnergyLevel,
  FurLength,
  PersonalityCategory,
} from "@/modules/shared/domain";

// ─── Detail (full Dog) ────────────────────────────────────────────────────────

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
  photo: string | null;
  images: {
    id: string;
    dogId: string;
    url: string;
    status: "pending" | "accepted" | "rejected";
  }[];
  breed2: string | null;
  shelterName: string | null;
  shelterLogo: string | null;
};

export type CreateDogWithUploadUrlsApiResponse = {
  dog: CreateDogApiResponse;
  uploadUrls: string[];
};

// ─── List (slim) ──────────────────────────────────────────────────────────────

export type DogListItemApiResponse = {
  id: string;
  shelterId: string;
  name: string;
  age: number;
  breed: string;
  size: DogSize;
  sex: DogSex;
  energyLevel: EnergyLevel;
  status: DogStatus;
  photo: string | null;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  needsYard: boolean;
  shelterName: string | null;
  compatibility?: number;
};

export type GetDogsApiResponse = {
  data: DogListItemApiResponse[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};
