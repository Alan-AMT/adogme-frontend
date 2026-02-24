import { DogEnergyLevel, DogSex, DogSize, DogStatus } from "./dog";

export type DogFilters = {
  queryText: string | null;
  tamano: DogSize | null;
  sexo: DogSex | null;
  cachorro: boolean | null;
  nivelEnergia: DogEnergyLevel | null;
  estado: DogStatus | null;
  raza: string | null;
  refugioId: number | null;
};
