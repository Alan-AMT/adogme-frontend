export type DogSize = "pequeño" | "mediano" | "grande";
export type DogSex = "macho" | "hembra";
export type DogEnergyLevel = "baja" | "media" | "alta";
export type DogStatus = "disponible" | "adoptado" | "en_proceso";

export type Dog = {
  id: number;
  refugioId: number;
  shelterName: string;
  nombre: string;
  edad: number; // en meses
  raza: string;
  tamano: DogSize;
  nivelEnergia: DogEnergyLevel;
  sexo: DogSex;
  salud: string;
  estado: DogStatus;
  compatibilidad: number; // 0–1
  descripcion: string;
  fechaRegistro: string; // ISO date
  imageUrl: string;
};
