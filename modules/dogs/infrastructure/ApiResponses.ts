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
  shelterId: string;
  shelterName: string | null;
  shelterLogo: string | null;
  status: DogStatus;
  name: string;
  breed: string;
  breed2: string | null;
  age: number;
  weightKg: number | null;
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
  photo: string | null;
  vector: [number, number, number, number];
  images: {
    id: string;
    dogId: string;
    url: string;
    status: "pending" | "accepted" | "rejected";
  }[];
  adoptionSpeed: number | null;
  updatedAt: Date;
  createdAt: Date;
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
